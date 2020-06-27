import { Router } from 'express'
import userControllers, {
  updateMe,
  deleteMe,
  getAllUsers
} from './user.controllers'
import { protect, signup, onlyAdmin, resetPassword } from '../../utils/auth'

const router = Router()

// router.get('/', me)
router.get('/', getAllUsers)
router.get('/:id', userControllers.getById)

router.post('/', protect, onlyAdmin, signup)
router.put('/:id', protect, userControllers.updateOneWithId)
router.delete('/:id', protect, userControllers.removeOneWithId)

router.put('/reset/:id', protect, resetPassword)

router.put('/', protect, updateMe)
router.delete('/', protect, deleteMe)

module.exports = router
