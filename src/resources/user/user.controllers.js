import { User } from './user.model'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const getAllUsers = async (req, res) => {
  let role = null
  if (req?.query?.role) {
    role = { role: req.query.role }
  }

  try {
    const users = await User.find(role)
      .select('-password')
      .lean()
      .exec()

    return res.status(201).send({ data: users })
  } catch (error) {
    console.error(e)
    res.status(400).send(e)
  }
}

export const getUserById = async (req, res) => {
  let user
  try {
    user = await User.findById(req.id)
      .select('-password')
      .lean()
      .exec()
  } catch (error) {
    console.error('ERROR GETTING USER BY ID: ', { e })
    return res.status(400).json({ error: e })
  }

  return res.status(201).json({ data: user })
}

export const updateMe = async () => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true
    })
      .select('-password')
      .lean()
      .exec()

    res.status(200).json({ data: updatedUser })
  } catch (e) {
    console.error('ERROR UPDATING USER', { e })
    res.status(400).send(e)
  }
}

export const updateUserWithId = async () => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .select('-password')
      .lean()
      .exec()

    res.status(200).json({ data: updatedUser })
  } catch (e) {
    console.error('ERROR UPDATING USER', { e })
    res.status(400).send(e)
  }
}

export const deleteMe = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id)
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch {}
}

export const removeUserById = async (req, res) => {
  try {
    const removed = await User.findByIdAndRemove(req.params.id).select(
      '-password'
    )

    if (!removed) {
      return res.status(400).end()
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    console.error('ERROR REMOVING USER', { e })
    res.status(400).send(e)
  }
}
