const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const products = await Product.find();

    const seen = new Map();
    let deleted = 0;

    for (const p of products) {
      // Create a "unique identity" for each real product
      const key = p.name.trim().toLowerCase();

      const isCloudinary =
        (p.img && p.img.includes("cloudinary.com")) ||
        (p.video && p.video.includes("cloudinary.com"));

      if (seen.has(key)) {
        const existing = seen.get(key);

        // KEEP the one with Cloudinary
        if (!isCloudinary && existing.isCloudinary) {
          await Product.findByIdAndDelete(p._id);
          console.log("🗑 Deleted (old upload version):", p.name);
          deleted++;
        } else if (isCloudinary && !existing.isCloudinary) {
          await Product.findByIdAndDelete(existing.id);
          seen.set(key, { id: p._id, isCloudinary: true });
          console.log("🗑 Replaced old with Cloudinary version:", p.name);
          deleted++;
        } else {
          await Product.findByIdAndDelete(p._id);
          console.log("🗑 Deleted duplicate:", p.name);
          deleted++;
        }
      } else {
        seen.set(key, {
          id: p._id,
          isCloudinary: isCloudinary,
        });
      }
    }

    console.log("\n🎉 CLEANUP COMPLETE");
    console.log("Total deleted:", deleted);

    process.exit();
  } catch (err) {
    console.error("❌ Error during cleanup:", err);
    process.exit(1);
  }
}

run();