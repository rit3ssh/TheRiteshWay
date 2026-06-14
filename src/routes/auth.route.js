import express from 'express';  
import { userRegistration, userLogin, userLogout,userProfile ,updateProfile} from '../controller/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import upload from '../service/multer.service.js';

const authRoutes = express.Router();

authRoutes.post('/register', userRegistration);

authRoutes.post('/login', userLogin);

authRoutes.post('/logout', userLogout);

authRoutes.get('/profile',authenticateUser,userProfile);

authRoutes.patch('/profile',authenticateUser,upload.single('profilepicture'),updateProfile)













export default authRoutes;