const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);

  const products = await Product.find();

  for (const p of products) {
    let changed = false;

    const imgIsVideo = p.img && p.img.includes(".mp4");

    // 1. MOVE VIDEO OUT OF IMG
    if (imgIsVideo) {
      console.log(`🔁 Fixing: ${p.name}`);

      // move to video field
      if (!p.video || p.video === "undefined" || p.video === null) {
        p.video = p.img;
      }

      // IMPORTANT: keep img valid (DO NOT set null)
      p.img = "https://via.placeholder.com/500";

      changed = true;
    }

    // 2. CLEAN VIDEO FIELD (optional safety)
    if (p.video === "undefined") {
      p.video = null;
      changed = true;
    }

    if (changed) {
      await p.save();
    }
  }

  console.log("🎉 SAFE FIX COMPLETED");
  process.exit();
}

fix();