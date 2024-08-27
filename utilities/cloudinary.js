const cloudinary=require("cloudinary")
cloudinary.config({
    API_KEY:process.env.API_KEY,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_SECRET: process.env.API_SECRET
});
module.exports=cloudinary