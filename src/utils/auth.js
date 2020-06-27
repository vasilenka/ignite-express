import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const generateToken = user => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.secrets.jwt,
    {
      expiresIn: config.secrets.jwtExp
    }
  )
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const validateToken = async (req, res) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  res.status(200).json({ token, user })
}

export const register = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: 'need username, email, and password' })
  }

  if (!req?.user?.role !== 'public') {
    req.body.role = 'public'
  }

  req.body.username = req.body.username.toLowerCase()

  let registeredUser = await User.findOne()
    .or([{ email: req.body.email }, { username: req.body.username }])
    .lean()
    .exec()

  if (registeredUser) {
    if (registeredUser.email === req.body.email) {
      return res.status(400).send({ message: 'email already taken' })
    }
    if (registeredUser.username === req.body.username) {
      return res.status(400).send({ message: 'username already taken' })
    }
  }

  try {
    const user = await User.create(req.body)
    let userData = await user.getPublicField()
    const token = generateToken(user)
    return res.status(201).send({ token, data: userData })
  } catch (e) {
    return res.status(500).json({ ERROR: e })
  }
}

export const adminRegister = async (req, res) => {
  try {
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: 'Igniter',
      username: 'igniter',
      role: 'admin',
      isConfirmed: true
    })

    return res.status(201).send({
      message: 'admin account created'
    })
  } catch (e) {
    return res.status(500).json(e)
  }
}

export const resetPassword = async (req, res) => {
  if (!req.body.email || !req.body.current || !req.body.password) {
    return res
      .status(400)
      .send({ message: 'need email, current password, and updated password' })
  }

  const invalid = { message: 'Invalid email and password combination' }

  try {
    const user = await User.findOne({ email: req.body.email })
      .select('email password role')
      .exec()

    if (!user) {
      return res.status(401).send(invalid)
    }

    const match = await user.checkPassword(req.body.current)

    if (!match) {
      return res.status(401).send(invalid)
    }

    user.password = req.body.password
    let updatedUser = await user.save()

    const token = generateToken(updatedUser)
    return res.status(200).send({
      token,
      user: {
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }

  const invalid = { message: 'Invalid email and password combination' }

  try {
    const user = await User.findOne({ email: req.body.email })
      .select('email password role name')
      .exec()

    if (!user) {
      return res.status(401).send(invalid)
    }

    const match = await user.checkPassword(req.body.password)

    if (!match) {
      return res.status(401).send(invalid)
    }

    const token = generateToken(user)
    return res.status(201).send({
      token,
      user: { email: user.email, role: user.role, name: user.name }
    })
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  let user
  try {
    user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()
  } catch (error) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  if (!user) {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }

  console.log('USER: ', user)

  req.user = user
  next()
}

export const onlyAdmin = async (req, res, next) => {
  if (req.user?.role === 'admin') {
    next()
  } else {
    return res.status(401).send({
      message: 'access forbidden'
    })
  }
}

export const relatedEditor = model => async (req, res, next) => {
  const doc = await model.findOne({
    _id: req.params.id,
    editor: req.user._id
  })

  if (!doc) {
    return res.status(400).end()
  }

  next()
}

export const relatedEditorOrAdmin = model => async (req, res, next) => {
  const doc = await model.findOne({
    _id: req.params.id,
    editor: req.user._id
  })

  if (!doc && req.user.role !== 'admin') {
    return res.status(400).end()
  }

  next()
}
