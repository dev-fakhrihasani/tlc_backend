import Users from '../models/UserModel.js'
import argon from "argon2"
import path from "path"
import fs from "fs"

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['uuid', 'name', 'email', 'role', 'job', 'image', 'url',],
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const users = await Users.findOne({
      attributes: ['uuid', 'name', 'email', 'role', 'job', 'image', 'url'],
      where: {
        uuid: req.params.id
      }
    });
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const createUser = async (req, res) => {
  // Cek apakah ada file
  if (req.files === null) return res.status(400).json({ msg: "No file uploaded" })

  // Setting variabel untuk input data
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const role = req.body.role
  const job = req.body.job

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

    // Validasi dan Hash password
    if (password !== confirmPassword) return res.status(400).json({ msg: "Password didn't match!" })
    const hashPassword = await argon.hash(password)

    // Create data
    try {
      await Users.create({
        name: name,
        email: email,
        password: hashPassword,
        role: role,
        job: job,
        image: fileName,
        url: url
      })
      res.status(201).json({ msg: "User created successfully" })
    } catch (error) {
      res.status(400).json({ msg: error.message })
    }
  })
}

export const updateUser = async (req, res) => {

  // Cari user berdasarkan ID
  const user = await Users.findOne({
    where: {
      uuid: req.params.id
    }
  })
  if (!user) return res.status(404).json({ msg: "User ID not found!" })

  // Cek apakah ada file
  let fileName = ""
  if (req.files === null) {
    fileName = user.image
  } else {
    const file = req.files.file
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

    const allowedType = [".png", ".jpg", ".jpeg"]

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Image extension must be JPG or PNG" })
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

    const filepath = `./public/images/${user.image}`
    fs.unlinkSync(filepath)
    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message })
    })
  }

  const name = req.body.name
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const role = req.body.role

  let hashPassword
  if (password === "" || password === null) {
    hashPassword = user.password
  } else {
    hashPassword = await argon.hash(password)
  }
  if (password !== confirmPassword) return res.status(400).json({ msg: "Password didn't match!" })
  try {
    await Users.update({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
      image: fileName,
      url: url
    }, {
      where: {
        id: user.id
      }
    })
    res.status(200).json({ msg: "User updated successfully" })
    // res.json(user)
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id
    }
  })
  if (!user) return res.status(401).json({ msg: "User ID not found" })

  try {
    const filepath = `./public/images/${user.image}`
    fs.unlinkSync(filepath)
    await Users.destroy({
      where: {
        id: user.id
      }
    })
    res.status(200).json({ msg: "User deleted successfully" })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}