require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("./models/product");
const Category = require("./models/category");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


const seedProducts = async () => {
  try {
    // Read db.json from frontend project
    const dbPath = path.join(
      __dirname,
      "..",
      "mimi-hair webreact",
      "mimi-hair",
      "db.json"
    );

    if (!fs.existsSync(dbPath)) {
      throw new Error(`db.json not found at: ${dbPath}`);
    }

    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    console.log("db.json loaded successfully");


    // Find categories
    const wigCategory = await Category.findOne({
      _id: "69724ceedbc24cf84962c736",
    });

    const shopAllCategory = await Category.findOne({
      _id: "69725870dbc24cf84962c756",
    });


    if (!wigCategory) {
      throw new Error("Wig category not found");
    }

    if (!shopAllCategory) {
      throw new Error("ShopAll category not found");
    }


    const products = [];


    // ======================
    // FEATURED + TRENDING VIDEOS
    // ======================

    data.featured.forEach((item) => {

      products.push({
        category: wigCategory._id,
        name: item.name,
        video: item.video,
        img: null,
        price: Number(item.price),
        featured: item.featured,
        trending: item.trending,
      });

    });



    // ======================
    // WIG PRODUCTS
    // ======================

    data.wigs.forEach((item) => {

      products.push({
        category: wigCategory._id,
        name: item.name,
        img: item.img,
        video: null,
        price: Number(item.price),
        featured: false,
        trending: false,
      });

    });



    // ======================
    // SHOP ALL PRODUCTS
    // ======================

    data.shopall.forEach((item) => {

      products.push({
        category: shopAllCategory._id,
        name: item.name,
        img: item.img,
        video: null,
        price: Number(item.price),
        featured: false,
        trending: false,
      });

    });



    console.log(`Preparing to insert ${products.length} products`);



    // Safety check
    const existingCount = await Product.countDocuments();

    console.log(
      `Current products in database: ${existingCount}`
    );


    if (existingCount > 0) {
      console.log(
        "Products already exist. Nothing inserted to avoid duplicates."
      );

      await mongoose.connection.close();
      return;
    }



    const inserted = await Product.insertMany(products);


    console.log(
      `SUCCESS: Inserted ${inserted.length} products`
    );


    await mongoose.connection.close();

    console.log("Database connection closed");


  } catch (error) {

    console.error(
      "SEED ERROR:",
      error.message
    );

    await mongoose.connection.close();
    process.exit(1);
  }
};



connectDB().then(seedProducts);