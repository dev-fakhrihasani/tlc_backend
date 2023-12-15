const express = require("express")
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require("../controllers/BlogController.js")
const { verifyUser, adminOnly } = require("../middleware/AuthUser.js")

const router = express.Router();

router.get('/blogs', getBlogs)
router.get('/blogs/:id', getBlogById)
router.post('/blogs', verifyUser, adminOnly, createBlog)
router.patch('/blogs/:id', verifyUser, adminOnly, updateBlog)
router.delete('/blogs/:id', verifyUser, adminOnly, deleteBlog)

module.exports = router;