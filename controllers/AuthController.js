import Users from "../models/UserModel.js"
import argon from "argon2"

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email
    }
  })
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" })
  const match = await argon.verify(user.password, req.body.password)
  if (!match) return res.status(400).json({ msg: "Wrong Password" })

  req.session.userId = user.uuid
  const uuid = user.uuid
  const name = user.name
  const email = user.email
  const role = user.role
  const job = user.job
  const image = user.image
  res.status(200).json({ uuid, name, email, role, job, image })
}

export const Me = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ msg: "Mohon Login ke akun anda" })
  const user = await Users.findOne({
    attributes: ['uuid', 'name', 'email', 'role', 'job', 'image'],
    where: {
      uuid: req.session.userId
    }
  })
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" })
  res.status(200).json(user)
}

export const logOut = (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(400).json({ msg: "Tidak dapat logout" })
    res.status(200).json({ msg: "Anda telah logout" })
  })
}