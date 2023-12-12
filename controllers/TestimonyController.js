import Testimony from "../models/TestimonyModel.js"
import path from "path"
import fs from "fs"

export const getTestimonies = async (req, res) => {
  try {
    const testimony = await Testimony.findAll({
      attributes: ["id", "name", "position", "desc", "image", "url"]
    })
    res.status(200).json(testimony)
  } catch (error) {
    res.status(200).json({ msg: error.message })
  }
}

export const getTestimonyById = async (req, res) => {
  try {
    const testimony = await Testimony.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!testimony) return res.status(404).json({ msg: "Data testimony not found!" })
    res.status(200).json(testimony)
  } catch (error) {
    res.status(200).json({ msg: error.message })
  }
}

export const createTestimony = async (req, res) => {
  // Cek apakah ada file
  if (req.files === null) return res.status(400).json({ msg: "No file uploaded" })

  // Setting variabel untuk input data
  const name = req.body.name
  const position = req.body.position
  const desc = req.body.desc

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
      await Testimony.create({
        name,
        position,
        desc,
        image: fileName,
        url: url
      })
      res.status(201).json({ msg: "Testimony created successfully" })
    } catch (error) {
      res.status(400).json({ msg: error.message })
    }
  })
}

export const updateTestimony = async (req, res) => {
  const testimony = await Testimony.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!testimony) return req.status(404).json({ msg: "Testimony ID not found" })

  let fileName = ""
  if (req.files === null) {
    fileName = testimony.image
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

    const allowedType = [".png", ".jpg", ".jpeg"]

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Image extension must be JPG or PNG" })
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

    const filepath = `./public/images/${testimony.image}`
    fs.unlinkSync(filepath)
    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }

  const name = req.body.name
  const position = req.body.position
  const desc = req.body.desc
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  try {
    await Testimony.update({
      name,
      position,
      desc,
      image: fileName,
      url
    }, {
      where: {
        id: testimony.id
      }
    })
    res.status(200).json({ msg: "Data testimony updated successfully" })
    // res.json(user)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}

export const deleteTestimony = async (req, res) => {
  const testimony = await Testimony.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!testimony) return res.status(401).json({ msg: "Testimony ID not found" })

  try {
    const filepath = `./public/images/${testimony.image}`
    fs.unlinkSync(filepath)
    await Testimony.destroy({
      where: {
        id: testimony.id
      }
    })
    res.status(200).json({ msg: "Data Testimony deleted successfully" })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}