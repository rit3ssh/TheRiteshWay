import ImageKit from '@imagekit/nodejs';
import dotenv from 'dotenv';

dotenv.config();

const imageKit = new ImageKit({
  privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
  publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
});


async function uploadFile(file){

    const response = await imageKit.files.upload({
    file: file.buffer.toString('base64'),
    fileName: file.originalname,
    folder: '/blogs'
    });

    return response;

}

export default uploadFile;