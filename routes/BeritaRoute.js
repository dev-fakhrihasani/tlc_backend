const express = require('express')
const { getBerita, getBeritaById, createBerita, updateBerita, deleteBerita } = require('../controllers/BeritaController.js')

const router = express.Router()

router.get('/berita', getBerita)
router.get('/berita/:id', getBeritaById)
router.post('/berita', createBerita)
router.patch('/berita/:id', updateBerita)
router.delete('/berita/:id', deleteBerita)

module.exports = router