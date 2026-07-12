const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

async function clearProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const result = await Product.deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} products`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearProducts();