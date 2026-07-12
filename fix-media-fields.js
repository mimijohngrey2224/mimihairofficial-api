const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);

  const products = await Product.find();

  for (const p of products) {
    let changed = false;

    const imgIsVideo = p.img && p.img.includes(".mp4");
    const videoIsMissing = !p.video || p.video === "undefined" || p.video === null;

    // FIX: move mp4 from img → video
    if (imgIsVideo && videoIsMissing) {
      p.video = p.img;
      p.img = null;
      changed = true;

      console.log(`🔁 Fixed: ${p.name}`);
    }

    if (changed) {
      await p.save();
    }
  }

  console.log("🎉 FIX COMPLETE");
  process.exit();
}

fix();