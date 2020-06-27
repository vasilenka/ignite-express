import { User } from './user.model'
import { crudControllers } from '../../utils/crud'

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

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
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

export default crudControllers(User)
