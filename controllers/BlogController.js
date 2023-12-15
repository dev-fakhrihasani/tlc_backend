const Blog = require("../models/BlogModel.js");
const User = require("../models/UserModel.js");
// const Op = require("sequelize")
const path = require("path")
const fs = require("fs")

const getBlogs = async (req, res) => {
  try {
    let blog
    if (req.role === "Admin") {
      blog = await Blog.findAll({
        include: [{
          model: User,
        }]
      })
    } else {
      blog = await Blog.findAll({
        attributes: ['id', 'title', 'slug', 'desc', 'date', 'category', 'image', 'url'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'image', 'url', 'job']
        }]
      })
    }
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      attributes: ['id', 'title', 'slug', 'desc', 'date', 'category', 'image', 'url'],
      where: {
        // [Op.and]: [{ id: blog.id }, { userId: req.userId }]
        id: req.params.id
      },
      include: [{
        model: User,
        attributes: ['id', 'name', 'image', 'url', 'job']
      }]
    })
    if (!blog) return res.status(404).json({ msg: "Data blog not found" })
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const createBlog = async (req, res) => {
  // Cek apakah ada file
  if (req.files === null) return res.status(400).json({ msg: "No file uploaded" })

  const title = req.body.title
  const slug = req.body.slug
  const desc = req.body.desc
  const date = req.body.date
  const category = req.body.category

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
      await Blog.create({
        title,
        slug,
        desc,
        date,
        category,
        image: fileName,
        url,
        userId: req.userId
      })
      res.status(201).json({ msg: "Blog created succesfully" })
    } catch (error) {
      res.status(500).json({ msg: error.message })
    }
  })
}

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!blog) return res.status(404).json({ msg: "Data blog not found" })

    // Cek apakah ada file
    let fileName = ""
    if (req.files === null) {
      fileName = blog.image
    } else {
      const file = req.files.file
      const fileSize = file.data.length
      const ext = path.extname(file.name)
      fileName = file.md5 + ext

      const allowedType = [".png", ".jpg", ".jpeg"]

      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Image extension must be JPG or PNG" })
      if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" })

      const filepath = `./public/images/${blog.image}`
      fs.unlinkSync(filepath)
      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message })
      })
    }

    const title = req.body.title
    const slug = req.body.slug
    const desc = req.body.desc
    const date = req.body.date
    const category = req.body.category
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`


    if (req.role === 'Admin') {
      await blog.update({
        title,
        slug,
        desc,
        date,
        category,
        image: fileName,
        url
      }, {
        where: {
          id: blog.id
        }
      })
    } else {
      res.status(401).json({ msg: "You are not authorized" })
    }
    res.status(201).json({ msg: "Blog updated successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })

  }
}
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!blog) return res.status(404).json({ msg: "Data blog not found" })

    const filepath = `./public/images/${blog.image}`
    fs.unlinkSync(filepath)

    if (req.role === 'Admin') {
      await blog.destroy({
        where: {
          id: blog.id
        }
      })
    } else {
      res.status(401).json({ msg: "You are not authorized" })
    }
    res.status(201).json({ msg: "Blog deleted successfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })

  }
}

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog }