const express = require('express')
const { getTestimonies, getTestimonyById, createTestimony, updateTestimony, deleteTestimony } = require('../controllers/TestimonyController.js')
const { verifyUser, adminOnly } = require('../middleware/AuthUser.js')

const router = express.Router()

router.get('/testimonies', getTestimonies)
router.get('/testimonies/:id', getTestimonyById)
router.post('/testimonies', verifyUser, adminOnly, createTestimony)
router.patch('/testimonies/:id', verifyUser, adminOnly, updateTestimony)
router.delete('/testimonies/:id', verifyUser, adminOnly, deleteTestimony)

module.exports = router
