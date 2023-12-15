const express = require('express')
const { getPartners, getPartnerById, createPartner, updatePartner, deletePartner } = require('../controllers/PartnerController.js')

const router = express.Router()

router.get('/partners', getPartners)
router.get('/partners/:id', getPartnerById)
router.post('/partners', createPartner)
router.patch('/partners/:id', updatePartner)
router.delete('/partners/:id', deletePartner)

module.exports = router