import { Router } from "express";
import { getAllBlogs , createBlog,getBlogById,updateBlog,deleteBlog} from "../controller/blog.controller.js";
import {authenticateUser} from '../middleware/auth.middleware.js';
import upload from '../service/multer.service.js';



const router = Router();




router.get('/',getAllBlogs);



router.post('/', authenticateUser, upload.single('image'), createBlog);

router.get('/:id',getBlogById);

router.patch('/:id',authenticateUser, upload.single('image'), updateBlog);

router.delete('/:id',authenticateUser, deleteBlog);



export default router;