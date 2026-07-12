const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Product = require("./models/product");
const cloudinary = require("./config/cloudinary");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const products = await Product.find();

  for (const p of products) {
    let updated = false;

    if (p.video && p.video.includes("uploads")) {
      const videoFile = path.resolve(
        __dirname,
        "uploads",
        path.basename(p.video)
      );

      if (!fs.existsSync(videoFile)) {
        console.log("❌ Missing file:", videoFile);
        continue;
      }

      console.log("🎥 Uploading:", p.name);

      const upload = await cloudinary.uploader.upload(videoFile, {
        folder: "mimihair",
        resource_type: "video",
      });

      p.video = upload.secure_url;
      updated = true;
    }

    if (updated) {
      await p.save();
      console.log("✅ Updated:", p.name);
    }
  }

  console.log("🎉 VIDEO MIGRATION COMPLETE");
  process.exit();
}

run();