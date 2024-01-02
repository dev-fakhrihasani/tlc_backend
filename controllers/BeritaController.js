const Berita = require("../models/BeritaModel.js")
const path = require("path")
const fs = require("fs")

const getBerita = async (req, res) => {
  try {
    const berita = await berita.findAll({
      attributes: ['id', 'title', 'image', 'url']
    })
    res.status(200).json(berita)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const getBeritaById = async (req, res) => {
  try {
    const berita = await Berita.findOne({
      attributes: ['id', 'title', 'image', 'url'],
      where: {
        id: req.params.id
      }
    })
    if (!berita) return res.status(404).json({ msg: "Data Berita not found" })
    res.status(200).json(berita)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const createBerita = async (req, res) => {
  // Cek apakah ada file
  if (req.files === null) return res.status(400).json({ msg: "No file uploaded" })

  // Setting variabel untuk input data
  const title = req.body.title

  // Setting input file
  const file = req.files.file
  const fileSize = file.data.length
  const ext = path.extname(file.name)
  const timeStamp = new Date().getTime()
  const fileName = file.md5 + timeStamp + ext
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
  const allowedType = [".png", ".jpg", ".jpeg"]

  // Validasi ekstensi file dan ukuran file
  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Image's extension must be JPG or PNG" })
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

  // Menyimpan file di folder public/image
  file.mv(`./public/images/${fileName}`, async (err) => {
    // Validasi apakah ada error
    if (err) return res.status(500).json({ msg: err.message })

    // Create data
    try {
      await Berita.create({
        title,
        image: fileName,
        url: url
      })
      res.status(201).json({ msg: "Berita created successfully" })
    } catch (error) {
      res.status(400).json({ msg: error.message })
    }
  })
}

const updateBerita = async (req, res) => {
  const berita = await Berita.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!berita) return req.status(404).json({ msg: "Berita ID not found" })

  // Cek apakah ada file
  let fileName = ""
  if (req.files === null) {
    fileName = partner.image
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

    const allowedType = [".png", ".jpg", ".jpeg"]

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Image extension must be JPG or PNG" })
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

    const filepath = `./public/images/${partner.image}`
    fs.unlinkSync(filepath)
    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }

  const title = req.body.title
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  try {
    await Berita.update({
      title,
      image: fileName,
      url
    }, {
      where: {
        id: berita.id
      }
    })
    res.status(200).json({ msg: "Berita updated successfully" })
    // res.json(user)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}

const deleteBerita = async (req, res) => {
  const berita = await Berita.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!berita) return res.status(401).json({ msg: "Berita ID not found" })

  try {
    const filepath = `./public/images/${partner.image}`
    fs.unlinkSync(filepath)
    await Berita.destroy({
      where: {
        id: berita.id
      }
    })
    res.status(200).json({ msg: "Berita deleted successfully" })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}

module.exports = {
  getBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita
}