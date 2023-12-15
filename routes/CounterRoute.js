const express = require('express')
const { getCounter, createCounter, updateCounter, deleteCounter, getCounterById } = require('../controllers/CounterController.js')

const router = express.Router()

router.get('/counters', getCounter)
router.get('/counters/:id', getCounterById)
router.post('/counters', createCounter)
router.patch('/counters/:id', updateCounter)
router.delete('/counters/:id', deleteCounter)

module.exports = router