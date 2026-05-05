const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// BUG-17 FIX: resource_type must be passed as an option to upload(), not as
// a second argument to resolve() — Promise.resolve() only accepts one value.
const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      fileToUploads,
      { resource_type: "auto" },
      (result) => {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    );
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(
      fileToDelete,
      { resource_type: "auto" },
      (result) => {
        resolve({
          result,
        });
      }
    );
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
