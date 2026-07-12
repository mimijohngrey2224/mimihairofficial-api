// const mongoose = require("mongoose");
// require("dotenv").config();

// const Product = require("./models/product");

// async function check() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const uploadsLeft = await Product.find({
//     img: { $regex: "uploads" }
//   });

//   console.log("Remaining uploads images:", uploadsLeft.length);

//   process.exit();
// }

// check();

const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);

  const uploadsLeft = await Product.find({
    img: { $regex: "uploads" }
  });

  console.log("Remaining uploads images:", uploadsLeft.length);

  console.log("\n--- PRODUCTS STILL NOT MIGRATED ---\n");

  uploadsLeft.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`);
    console.log(`   IMG: ${p.img}`);
    console.log(`   VIDEO: ${p.video}`);
    console.log("--------------------------------------------------");
  });

  process.exit();
}

check();