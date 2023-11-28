import express from 'express'
import { getTestimonies, getTestimonyById, createTestimony, updateTestimony, deleteTestimony } from '../controllers/TestimonyController.js'
import { verifyUser, adminOnly } from '../middleware/AuthUser.js'

const router = express.Router()

router.get('/testimonies', getTestimonies)
router.get('/testimonies/:id', getTestimonyById)
router.post('/testimonies', verifyUser, adminOnly, createTestimony)
router.patch('/testimonies/:id', verifyUser, adminOnly, updateTestimony)
router.delete('/testimonies/:id', verifyUser, adminOnly, deleteTestimony)

export default router
