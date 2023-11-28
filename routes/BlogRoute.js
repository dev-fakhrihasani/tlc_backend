import express from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/BlogController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/blogs', getBlogs)
router.get('/blogs/:id', getBlogById)
router.post('/blogs', verifyUser, adminOnly, createBlog)
router.patch('/blogs/:id', verifyUser, adminOnly, updateBlog)
router.delete('/blogs/:id', verifyUser, adminOnly, deleteBlog)

export default router;