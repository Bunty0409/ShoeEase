const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// BUG-18 FIX: The previous code wrote the resized file then immediately deleted
// it, before the upload controller could send it to Cloudinary. Now we:
// 1. Resize the image to the target directory
// 2. Delete the original temp file (uploaded by multer)
// 3. Update file.path to point to the resized file so the upload controller
//    picks up the correct (resized) file
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const resizedPath = path.join(
        __dirname,
        `../public/images/products/${file.filename}`
      );
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(resizedPath);
      // Delete the original temp upload, keep the resized file for Cloudinary
      fs.unlinkSync(file.path);
      // Point multer's file.path to the resized file
      file.path = resizedPath;
    })
  );
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const resizedPath = path.join(
        __dirname,
        `../public/images/blogs/${file.filename}`
      );
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(resizedPath);
      fs.unlinkSync(file.path);
      file.path = resizedPath;
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
