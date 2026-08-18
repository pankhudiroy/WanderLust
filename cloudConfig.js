// const cloudinary = require('cloudinary').v2;
// const  CloudinaryStorage  = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key : process.env.CLOUD_API_KEY,
//     api_secret : process.env.CLOUD_API_SECTRET

// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'Stayzy',
//     allowed_formats: ["jpeg", "png", "jpeg"],
//   },
// });

// module.exports ={
//     cloudinary,
//     storage,
// };


// const cloudinary = require('cloudinary').v2;
// const CloudinaryStorage = require('multer-storage-cloudinary');

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECTRET   
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: 'Stayzy',
//   allowedFormats: ['jpeg', 'png', 'jpg']
// });

// module.exports = { cloudinary, storage };

const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECTRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "major-project",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};

