import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    uri:{
        type: String,
        required: true,
        // unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    writer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const blogModel = mongoose.model('Blog', blogSchema);

export default blogModel;