import express from 'express'
import { getProgram, createProgram, deleteProgram, updateProgram } from '../controllers/ProgramController.js'

const router = express.Router()

router.get('/programs', getProgram)
router.post('/programs', createProgram)
router.patch('/programs/:id', updateProgram)
router.delete('/programs/:id', deleteProgram)

export default router