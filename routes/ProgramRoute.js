import express from 'express'
import { getProgram, createProgram, deleteProgram, updateProgram, getProgramById } from '../controllers/ProgramController.js'

const router = express.Router()

router.get('/programs', getProgram)
router.get('/programs/:id', getProgramById)
router.post('/programs', createProgram)
router.patch('/programs/:id', updateProgram)
router.delete('/programs/:id', deleteProgram)

export default router