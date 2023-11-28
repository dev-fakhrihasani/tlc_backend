import Blog from "../models/BlogModel.js";
import User from "../models/UserModel.js";
// import { Op } from "sequelize"

export const getBlogs = async (req, res) => {
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
        attributes: ['id', 'title', 'slug', 'desc', 'date', 'category'],
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

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      attributes: ['id', 'title', 'slug', 'desc', 'date', 'category'],
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

export const createBlog = async (req, res) => {
  const { title, slug, desc, date, category } = req.body
  try {
    await Blog.create({
      title,
      slug,
      desc,
      date,
      category,
      userId: req.userId
    })
    res.status(201).json({ msg: "Blog created succesfully" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }

}

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!blog) return res.status(404).json({ msg: "Data blog not found" })

    const { title, slug, desc, date, category } = req.body
    if (req.role === 'Admin') {
      await blog.update({
        title,
        slug,
        desc,
        date,
        category
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
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!blog) return res.status(404).json({ msg: "Data blog not found" })

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