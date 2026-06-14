import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.route.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());



app.use('/api/v1/blogs/', blogRoutes)
app.use('/api/v1/auth/', authRoutes)




export default app;