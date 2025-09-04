const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "xxx",
  api_key: process.env.CLOUDINARY_API_KEY || "xxx",
  api_secret: process.env.CLOUDINARY_API_SECRET || "xxx",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ironhack",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

// Configure Multer
const upload = multer({ storage: storage });

module.exports.deleteFile = async (fileName) => {
  const result = await cloudinary.uploader.destroy(fileName);

  if (result.result === "ok") {
    console.log(`file deleted: ${fileName}`);
  } else {
    throw new Error("error deleting file", fileName, result);
  }
};

module.exports.storage = upload;
