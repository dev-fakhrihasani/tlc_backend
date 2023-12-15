const express = require('express')
const { getVolunteers, getVolunteerById, createVolunteer, updateVolunteer, deleteVolunteer } = require('../controllers/VolunteerController.js')
const { verifyUser, adminOnly } = require('../middleware/AuthUser.js')

const router = express.Router()

router.get('/volunteers', getVolunteers)
router.get('/volunteers/:id', getVolunteerById)
router.post('/volunteers', createVolunteer)
router.patch('/volunteers/:id', updateVolunteer)
router.delete('/volunteers/:id', deleteVolunteer)

module.exports = router
