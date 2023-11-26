import express from 'express'
import { getCounter, createCounter, updateCounter, deleteCounter } from '../controllers/CounterController.js'

const router = express.Router()

router.get('/counters', getCounter)
router.post('/counters', createCounter)
router.patch('/counters/:id', updateCounter)
router.delete('/counters/:id', deleteCounter)

export default router