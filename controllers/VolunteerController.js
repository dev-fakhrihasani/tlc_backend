const Volunteer = require("../models/VolunteerModel.js")
const path = require("path")
const fs = require("fs")

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll({
      attributes: ['id', 'name', 'division', 'image', 'url'],
    });
    res.json(volunteers);
  } catch (error) {
    console.log(error.message);
  }
}


const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({
      attributes: ['id', 'name', 'division', 'image', 'url'],
      where: {
        id: req.params.id
      }
    });
    if (!volunteer) return res.status(404).json({ msg: "Data volunteer not found!" })
    res.json(volunteer);
  } catch (error) {
    console.log(error.message);
  }
}


const createVolunteer = async (req, res) => {
  // Cek apakah ada file
  if (req.files === null) return res.status(400).json({ msg: "No file uploaded" })

  // Setting variabel untuk input data
  const name = req.body.name
  const division = req.body.division

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
      await Volunteer.create({
        name,
        division,
        image: fileName,
        url: url
      })
      res.status(201).json({ msg: "Volunteer created successfully" })
    } catch (error) {
      res.status(400).json({ msg: error.message })
    }
  })
}

const updateVolunteer = async (req, res) => {

  const volunteer = await Volunteer.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!volunteer) return req.status(404).json({ msg: "Volunteer ID not found" })

  let fileName = ""
  if (req.files === null) {
    fileName = volunteer.image
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

    const allowedType = [".png", ".jpg", ".jpeg"]

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Image extension must be JPG or PNG" })
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

    const filepath = `./public/images/${volunteer.image}`
    fs.unlinkSync(filepath)
    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }

  const name = req.body.name
  const division = req.body.division
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  try {
    await Volunteer.update({
      name,
      division,
      image: fileName,
      url
    }, {
      where: {
        id: volunteer.id
      }
    })
    res.status(200).json({ msg: "Volunteer updated successfully" })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }

}


const deleteVolunteer = async (req, res) => {
  const volunteer = await Volunteer.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!volunteer) return res.status(404).json({ msg: "Volunteer ID not found" })

  try {
    const filepath = `./public/images/${volunteer.image}`
    fs.unlinkSync(filepath)
    await Volunteer.destroy({
      where: {
        id: volunteer.id
      }
    })
    res.status(200).json({ msg: "Volunteer deleted successfully" })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

module.exports = {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer
}