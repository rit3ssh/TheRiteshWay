import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import uploadFile from '../service/storage.service.js';



async function userRegistration (req, res){
    const { username, email, password } = req.body;

    if (!username || !email || !password){
        return res.status(400).json({
            message: 'All fields are required'
        });
    } 

    const userAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (userAlreadyExists){
        return res.status(409).json({
            message: 'User with the same username or email already exists'
        });
    }
    const hashPassword=await bcrypt.hash(password, 10);


    const user =await userModel.create({
        username,
        email,
        password: hashPassword
    });

    const token = jwt.sign({
        id: user._id,
        email: user.email,
    }, process.env.JWT_SECRET_KEY);

    res.cookie('token', token, {
        httpOnly: true,
    });

    res.status(201).json({
         message: 'User registration successful',
         user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        //  token:token
    });
}



async function userLogin (req, res){
    const { email, password } = req.body;
    // console.log(req.body)

    if (!email || !password){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    const user = await userModel.findOne({ email});
    
    if (!user){
        return res.status(404).json({
            message: 'Invalid credentials'
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid){
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
    }, process.env.JWT_SECRET_KEY);



    res.cookie('token', token, {
        httpOnly: true,
    });

    res.status(200).json({ 
        message: 'User login successful',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

}



function userLogout (req, res){
    res.clearCookie('token');
    res.status(200).json({
        message: 'User logout successful'
    });
    
}   


async function userProfile(req, res){
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    if (!user){
        return res.status(404).json({
            message: 'User not found'
        });
    }
    res.status(200).json({
        message: 'User profile retrieved successfully',
        user
    });
}

///// update profile picture and username and email

// async function updateProfile(req, res){
//     const userId = req.user.id;
//     // const profilepicture =req.file
//     if (req.file){

//         const result = await uploadFile(req.file);
//         if (result.url){
//             req.body.profilepicture=result.url;
//         }
//     }
//     const { username, email, } = req.body;
//     // do not allow to choose username and email which are already taken by other users
//     if (username){
//         const usernameAlreadyExists = await userModel.findOne({ username });
//         if (usernameAlreadyExists && usernameAlreadyExists._id.toString() !== userId){
//             return res.status(409).json({
//                 message: 'Username already taken'
//             });
//         }
//     }

//     if (email){
//         const emailAlreadyExists = await userModel.findOne({ email });
//         if (emailAlreadyExists && emailAlreadyExists._id.toString() !== userId){
//             return res.status(409).json({
//                 message: 'Email already taken'
//             });
//         }
//     }   

//     if (password){
//         return res.status(400).json({
//             message: 'Password cannot be updated'
//         });
//     }

//     const updates = {};
//     if (username) updates.username = username;
//     if (email) updates.email = email;
//     if (req.body.profilepicture) updates.profilepicture = req.body.profilepicture;

//     const updatedUser = await userModel.findByIdAndUpdate(userId, {

//         $set: updates
//     }, { new: true }).select('-password');

//     if (!updatedUser){
//         return res.status(404).json({
//             message: 'User not found'
//         });
//     }

//     res.status(200).json({
//         message: 'User profile updated successfully',
//         user: updatedUser
//     });
// }

async function updateProfile(req, res) {
    const userId = req.user.id;

    const updates = {};

    // file upload
    if (req.file) {
        const result = await uploadFile(req.file);
        if (result?.url) {
            updates.profilepicture = result.url;
        }
    }

    const { username, email, password } = req.body;

    // block password update
    if (password) {
        return res.status(400).json({
            message: 'Password cannot be updated'
        });
    }

    // username check
    if (username) {
        const exists = await userModel.findOne({
            username,
            _id: { $ne: userId }
        });

        if (exists) {
            return res.status(409).json({
                message: 'Username already taken'
            });
        }

        updates.username = username;
    }

    // email check
    if (email) {
        const exists = await userModel.findOne({
            email,
            _id: { $ne: userId }
        });

        if (exists) {
            return res.status(409).json({
                message: 'Email already taken'
            });
        }

        updates.email = email;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    res.status(200).json({
        message: 'User profile updated successfully',
        user: updatedUser
    });
}


export { userRegistration, userLogin, userLogout, userProfile, updateProfile };