const Users = require("../models/UserModel.js")
const argon = require("argon2")

const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email
    }
  })
  if (!user) return res.status(404).json({ msg: "User not found!" })
  const match = await argon.verify(user.password, req.body.password)
  if (!match) return res.status(400).json({ msg: "Wrong password" })

  req.session.userId = user.uuid
  const uuid = user.uuid
  const name = user.name
  const email = user.email
  const role = user.role
  const job = user.job
  const image = user.image
  const url = user.url
  res.status(200).json({ uuid, name, email, role, job, image, url })
}

const Me = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ msg: "Please login!" })
  const user = await Users.findOne({
    attributes: ['uuid', 'name', 'email', 'role', 'job', 'image', 'url'],
    where: {
      uuid: req.session.userId
    }
  })
  if (!user) return res.status(404).json({ msg: "User not Found" })
  res.status(200).json(user)
}

const logOut = (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(400).json({ msg: "Cannot logout" })
    res.status(200).json({ msg: "Your account has been logged out" })
  })
}

module.exports = {
  Login,
  Me,
  logOut
}