// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const resourceType = file.mimetype.startsWith("video")
//       ? "video"
//       : "image";

//     return {
//       folder: "mimihair",
//       resource_type: resourceType,
//       allowed_formats: [
//         "jpg",
//         "jpeg",
//         "png",
//         "webp",
//         "mp4",
//         "mov",
//         "avi",
//         "mkv",
//       ],
//     };
//   },
// });

// module.exports = multer({ storage });


// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "mimihair",
//     resource_type: "auto",
//     allowed_formats: [
//       "jpg",
//       "jpeg",
//       "png",
//       "webp",
//       "mp4",
//       "mov",
//       "avi",
//       "mkv",
//     ],
//   },
// });

// module.exports = multer({ storage });


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mimihair",
    resource_type: "auto",
  },
});

module.exports = multer({ storage });