import express from 'express'
import { getCounter, createCounter, updateCounter, deleteCounter, getCounterById } from '../controllers/CounterController.js'

const router = express.Router()

router.get('/counters', getCounter)
router.get('/counters/:id', getCounterById)
router.post('/counters', createCounter)
router.patch('/counters/:id', updateCounter)
router.delete('/counters/:id', deleteCounter)

export default router