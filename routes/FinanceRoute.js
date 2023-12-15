const express = require('express')
const { getFinance, createFinance, updateFinance, deleteFinance, getFinanceById } = require('../controllers/FinanceController.js')

const router = express.Router()

router.get('/finances', getFinance)
router.get('/finances/:id', getFinanceById)
router.post('/finances', createFinance)
router.patch('/finances/:id', updateFinance)
router.delete('/finances/:id', deleteFinance)

module.exports = router