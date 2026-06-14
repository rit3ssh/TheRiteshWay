import mongoose from "mongoose";


async function connectDB(){

    try {
        console.log('Connecting to database...');
         await mongoose.connect(process.env.MONGODB_URL)

        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed', error);
    }

}


export default connectDB;