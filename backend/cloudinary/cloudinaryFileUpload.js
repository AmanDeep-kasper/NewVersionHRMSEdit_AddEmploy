const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Upload image file to Cloudinary
const cloudinaryFileUploder = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    } else {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      await fs.unlinkSync(localFilePath);
      return { image_url: response.url, publicId: response.public_id };
    }
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log("Cloudinary error", err);
  }
};

// Upload images to Cloudinary
const uplodeImagesCloudinary = async (filePath) => {
  if (filePath) {
    const image = await cloudinary.uploader.upload(filePath);
    if (image) {
      fs.unlinkSync(filePath);
      return { image_url: image.url, publicId: image.public_id };
    } else {
      fs.unlinkSync(filePath);
      return null;
    }
  } else {
    return null;
  }
};

// Remove image from Cloudinary
const removeCloudinaryImage = async (publicId) => {
  const imageStatus = await cloudinary.uploader.destroy(publicId);
  return imageStatus;
};


module.exports = {
  cloudinaryFileUploder,
  removeCloudinaryImage,
  uplodeImagesCloudinary,
};
