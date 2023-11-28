import express from 'express'
import { getPartners, getPartnerById, createPartner, updatePartner, deletePartner } from '../controllers/PartnerController.js'

const router = express.Router()

router.get('/partners', getPartners)
router.get('/partners/:id', getPartnerById)
router.post('/partners', createPartner)
router.patch('/partners', updatePartner)
router.delete('/partners', deletePartner)

export default router