import { Router } from 'express'
import userControllers, {
  updateMe,
  updateUserWithId,
  deleteMe,
  getAllUsers,
  getUserById,
  removeUserById
} from './user.controllers'
import { protect, register, resetPassword } from '../../utils/auth'

const router = Router()

// router.get('/', me)
router.get('/', getAllUsers)
router.get('/:id', getUserById)

router.post('/', register)

router.put('/:id', protect, updateUserWithId)
router.put('/reset/:id', protect, resetPassword)
router.put('/', protect, updateMe)

router.delete('/:id', protect, removeUserById)
router.delete('/', protect, deleteMe)

module.exports = router
