
import blogModel from '../models/blog.model.js';
// import jwt from 'jsonwebtoken';
import  uploadFile  from '../service/storage.service.js';


async function getAllBlogs(req, res ) {



    const all_blogs = await blogModel.find()
    if (all_blogs.length === 0){
        return res.status(404).json({
            message: 'No blogs found'
        });
    }
    res.status(200).json({
        success: true,
        message: 'Blogs retrieved successfully',
        blogs: all_blogs

    });
}

async function getBlogById (req, res){
    const blogId = req.params.id
    const blog = await blogModel.find({_id: blogId})
    if (!blog){
        return res.status(404).json({
            message: 'Blog not found'
        });
    }
    res.status(200).json({
        message: 'Blog retrieved successfully',
        blog
        // blog: blog
    });
}

async function createBlog(req, res){

    // console.log(req.body);
    // console.log(req.file);

    const result = await uploadFile(req.file);
    // console.log(result.url);
    const {title, description } = req.body;

    const blog=await blogModel.create({
        uri:result.url,
        title,
        description,
        writer: req.user.id
    });
    res.status(201).json({
        message: 'Blog created successfully',
        created_blog:{
            id: blog._id,
            uri: blog.uri,
            title: blog.title,
            description: blog.description,
            writer: blog.writer
        }
    });
}



async function updateBlog(req, res){

    if (req.file){

        const uri= await uploadFile(req.file);
        // console.log(uri.url);
        // console.log(req.body);
        if (uri.url){
            req.body.uri=uri.url;
        }
    }
    const blog =await blogModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Only updates the keys present in req.body
      { new: true, runValidators: true } // Returns the modified doc and runs schema validation
    );
    res.status(200).json({
        success: true,
        message: 'Blog updated successfully',
        updated_blog: {
            id: blog._id,
            uri: blog.uri,
            title: blog.title,
            description: blog.description
        }
    });
}


async function deleteBlog(req, res){
    if (!blogModel.findById(req.params.id)){
        return res.status(404).json({
            message: 'Blog not found'
        });
    }
    const blog=await blogModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message: 'Blog deleted successfully',
        "deleted_blog": {
            id: blog._id,
            uri: blog.uri,
            title: blog.title,
            description: blog.description
        }
    });
}

export {getAllBlogs, createBlog, getBlogById, updateBlog, deleteBlog}