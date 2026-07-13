require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("./models/product");
const Category = require("./models/category");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connected!");

  console.log("Products:", await Product.countDocuments());

  console.log("Categories:", await Category.countDocuments());

  const cats = await Category.find();

  console.log(cats);

  await mongoose.connection.close();
}

check();