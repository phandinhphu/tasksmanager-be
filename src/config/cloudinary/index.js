const dotenv = require('dotenv');

dotenv.config();

const cloud_name = process.env.CLOUDINARY_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

module.exports = {
    cloud_name,
    api_key,
    api_secret
};
