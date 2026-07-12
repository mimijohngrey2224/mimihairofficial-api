const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const bad = await Product.find({
    $or: [
      { img: { $regex: "uploads" } },
      { video: { $regex: "uploads" } }
    ]
  });

  console.log("UNMIGRATED PRODUCTS:", bad.length);

  bad.forEach(p => {
    console.log("\n--------------------");
    console.log(p.name);
    console.log("IMG:", p.img);
    console.log("VIDEO:", p.video);
  });

  process.exit();
}

run();