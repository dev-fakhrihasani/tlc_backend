import Partner from "../models/PartnerModel.js";
import path from "path"
import fs from "fs"

export const getPartners = async (req, res) => {
  try {
    const partner = await Partner.findAll({
      attributes: ['id', 'name', 'image', 'url']
    })
    res.status(200).json(partner)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findOne({
      attributes: ['id', 'name', 'image', 'url'],
      where: {
        id: req.params.id
      }
    })
    if (!partner) return res.status(404).json({ msg: "Data Partner not found" })
    res.status(200).json(partner)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const createPartner = async (req, res) => {
  // Cek apakah ada file
  if (req.files === null) return res.status(400).json({ msg: "No file uploaded" })

  // Setting variabel untuk input data
  const name = req.body.name

  // Setting input file
  const file = req.files.file
  const fileSize = file.data.length
  const ext = path.extname(file.name)
  const fileName = file.md5 + ext
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
      await Partner.create({
        name,
        image: fileName,
        url: url
      })
      res.status(201).json({ msg: "Partner created successfully" })
    } catch (error) {
      res.status(400).json({ msg: error.message })
    }
  })
}

export const updatePartner = async (req, res) => {
  const partner = await Partner.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!partner) return req.status(404).json({ msg: "Partner ID not found" })

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

  const name = req.body.name
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  try {
    await Partner.update({
      name,
      image: fileName,
      url
    }, {
      where: {
        id: partner.id
      }
    })
    res.status(200).json({ msg: "Partner updated successfully" })
    // res.json(user)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}

export const deletePartner = async (req, res) => {
  const partner = await Partner.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!partner) return res.status(401).json({ msg: "Partner ID not found" })

  try {
    const filepath = `./public/images/${partner.image}`
    fs.unlinkSync(filepath)
    await Partner.destroy({
      where: {
        id: partner.id
      }
    })
    res.status(200).json({ msg: "Partner deleted successfully" })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}