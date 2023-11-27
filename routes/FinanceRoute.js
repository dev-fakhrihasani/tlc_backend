import express from 'express'
import { getFinance, createFinance, updateFinance, deleteFinance, getFinanceById } from '../controllers/FinanceController.js'

const router = express.Router()

router.get('/finances', getFinance)
router.get('/finances/:id', getFinanceById)
router.post('/finances', createFinance)
router.patch('/finances/:id', updateFinance)
router.delete('/finances/:id', deleteFinance)

export default router