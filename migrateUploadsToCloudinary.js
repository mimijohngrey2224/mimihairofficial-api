// const mongoose = require("mongoose");
// const path = require("path");
// const fs = require("fs");
// require("dotenv").config();

// const Product = require("./models/product");
// const cloudinary = require("./config/cloudinary");

// async function migrate() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("✅ Connected to MongoDB Atlas");

//     const products = await Product.find();

//     for (const product of products) {
//       let updated = false;

//       // ================= IMAGE =================
//     //   if (
//     //     product.img &&
//     //     product.img.startsWith("uploads") &&
//     //     !product.img.includes("cloudinary.com")
//     //   ) {
//     //     // const imgFile = path.join(
//     //     //   __dirname,
//     //     //   product.img.replace(/\\/g, path.sep).replace(/\//g, path.sep)
//     //     // );
//     //     const imgFile = path.resolve(
//     //     __dirname,
//     //         "uploads",
//     //      path.basename(product.img)
//     //         );

//     //     console.log(`📷 Uploading image: ${product.name}`);

//     //     const imgUpload = await cloudinary.uploader.upload(imgFile, {
//     //       folder: "mimihair",
//     //       resource_type: "image",
//     //     });

//     //     product.img = imgUpload.secure_url;
//     //     updated = true;
//     //   }

//         // if (
//         // product.img &&
//         // product.img.startsWith("uploads") &&
//         // !product.img.includes("cloudinary.com")
//         // ) {
//         // const imgFile = path.resolve(__dirname, product.img);

//         // if (!fs.existsSync(imgFile)) {
//         //     console.log("❌ Image file not found:", imgFile);
//         //     continue;
//         // }

//         // const imgUpload = await cloudinary.uploader.upload(imgFile, {
//         //     folder: "mimihair",
//         //     resource_type: "image",
//         // });

//         // product.img = imgUpload.secure_url;
//         // updated = true;
//         // }


//         if (
//   product.img &&
//   product.img.startsWith("uploads") &&
//   !product.img.includes("cloudinary.com")
// ) {
//   const imgFile = path.resolve(
//     __dirname,
//     "uploads",
//     path.basename(product.img)
//   );

//   if (!fs.existsSync(imgFile)) {
//     console.log("❌ Image file not found:", imgFile);
//   } else {
//     console.log(`📷 Uploading image: ${product.name}`);

//     const imgUpload = await cloudinary.uploader.upload(imgFile, {
//       folder: "mimihair",
//       resource_type: "image",
//     });

//     product.img = imgUpload.secure_url;
//     updated = true;
//   }
// }

//       // ================= VIDEO =================
//     //   if (
//     //     product.video &&
//     //     product.video.startsWith("uploads") &&
//     //     !product.video.includes("cloudinary.com")
//     //   ) {
//     //     // const videoFile = path.join(
//     //     //   __dirname,
//     //     //   product.video.replace(/\\/g, path.sep).replace(/\//g, path.sep)
//     //     // );

//     //      const videoFile = path.resolve(
//     //         __dirname,
//     //         "uploads",
//     //         path.basename(product.video)
//     //         );

//     //     console.log(`🎥 Uploading video: ${product.name}`);

//     //     const videoUpload = await cloudinary.uploader.upload(videoFile, {
//     //       folder: "mimihair",
//     //       resource_type: "video",
//     //     });

//     //     product.video = videoUpload.secure_url;
//     //     updated = true;
//     //   }


//     // if (
//     //     product.video &&
//     //     product.video.startsWith("uploads") &&
//     //     !product.video.includes("cloudinary.com")
//     //     ) {
//     //     const videoFile = path.resolve(__dirname, product.video);

//     //     if (!fs.existsSync(videoFile)) {
//     //         console.log("❌ Video file not found:", videoFile);
//     //         continue;
//     //     }

//     //     const videoUpload = await cloudinary.uploader.upload(videoFile, {
//     //         folder: "mimihair",
//     //         resource_type: "video",
//     //     });

//     //     product.video = videoUpload.secure_url;
//     //     updated = true;
//     //     }

//     if (
//   product.video &&
//   product.video.startsWith("uploads") &&
//   !product.video.includes("cloudinary.com")
// ) {
//   const videoFile = path.resolve(
//     __dirname,
//     "uploads",
//     path.basename(product.video)
//   );

//   if (!fs.existsSync(videoFile)) {
//     console.log("❌ Video file not found:", videoFile);
//   } else {
//     console.log(`🎥 Uploading video: ${product.name}`);

//     const videoUpload = await cloudinary.uploader.upload(videoFile, {
//       folder: "mimihair",
//       resource_type: "video",
//     });

//     product.video = videoUpload.secure_url;
//     updated = true;
//   }
// }

//       if (updated) {
//         await product.save();
//         console.log(`✅ Updated: ${product.name}`);
//       } else {
//         console.log(`⏭ Skipped: ${product.name}`);
//       }
//     }

//     console.log("\n🎉 ALL PRODUCTS MIGRATED SUCCESSFULLY!");
//     process.exit(0);

//   } catch (err) {
//     console.error("❌ Migration failed");
//     console.error(err);
//     process.exit(1);
//   }
// }

// migrate();


const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Product = require("./models/product");
const cloudinary = require("./config/cloudinary");

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const products = await Product.find();

    for (const product of products) {
      let updated = false;

      // ================= IMAGE =================
    //   if (
    //     product.img &&
    //     product.img.startsWith("uploads") &&
    //     !product.img.includes("cloudinary.com")
    //   ) {
    //     const imgFile = path.resolve(
    //       __dirname,
    //       "uploads",
    //       path.basename(product.img)
    //     );

    //     if (!fs.existsSync(imgFile)) {
    //       console.log("❌ Image file not found, skipping:", imgFile);
    //     } else {
    //       console.log(`📷 Uploading image: ${product.name}`);

    //       const imgUpload = await cloudinary.uploader.upload(imgFile, {
    //         folder: "mimihair",
    //         resource_type: "image",
    //       });

    //       product.img = imgUpload.secure_url;
    //       updated = true;
    //     }
    //   }

    if (
  product.img &&
  product.img.startsWith("uploads") &&
  !product.img.includes("cloudinary.com")
) {
  const imgFile = path.resolve(
    __dirname,
    "uploads",
    path.basename(product.img)
  );

  try {
    if (!fs.existsSync(imgFile)) {
      console.log("❌ Image not found:", imgFile);
    } else {
      console.log(`📷 Uploading image: ${product.name}`);

      const imgUpload = await cloudinary.uploader.upload(imgFile, {
        folder: "mimihair",
        resource_type: "image",
      });

      product.img = imgUpload.secure_url;
      updated = true;
    }
  } catch (err) {
    console.log("❌ Image upload failed:", product.name);
    console.log(err.message);
  }
}

      // ================= VIDEO =================
    //   if (
    //     product.video &&
    //     product.video.startsWith("uploads") &&
    //     !product.video.includes("cloudinary.com")
    //   ) {
    //     const videoFile = path.resolve(
    //       __dirname,
    //       "uploads",
    //       path.basename(product.video)
    //     );

    //     if (!fs.existsSync(videoFile)) {
    //       console.log("❌ Video file not found, skipping:", videoFile);
    //     } else {
    //       console.log(`🎥 Uploading video: ${product.name}`);

    //       const videoUpload = await cloudinary.uploader.upload(videoFile, {
    //         folder: "mimihair",
    //         resource_type: "video",
    //       });

    //       product.video = videoUpload.secure_url;
    //       updated = true;
    //     }
    //   }

    if (
  product.video &&
  product.video.startsWith("uploads") &&
  !product.video.includes("cloudinary.com")
) {
  const videoFile = path.resolve(
    __dirname,
    "uploads",
    path.basename(product.video)
  );

  try {
    if (!fs.existsSync(videoFile)) {
      console.log("❌ Video not found:", videoFile);
    } else {
      console.log(`🎥 Uploading video: ${product.name}`);

      const videoUpload = await cloudinary.uploader.upload(videoFile, {
        folder: "mimihair",
        resource_type: "video",
      });

      product.video = videoUpload.secure_url;
      updated = true;
    }
  } catch (err) {
    console.log("❌ Video upload failed:", product.name);
    console.log(err.message);
  }
}

      if (updated) {
        await product.save();
        console.log(`✅ Updated: ${product.name}`);
      } else {
        console.log(`⏭ Skipped: ${product.name}`);
      }
    }

    console.log("\n🎉 ALL PRODUCTS MIGRATED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed");
    console.error(err);
    process.exit(1);
  }
}

migrate();