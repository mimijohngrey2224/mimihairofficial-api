const mongoose = require("mongoose");
require("dotenv").config();

// 👇 CHANGE THIS BEFORE RUNNING
const LOCAL_DB = "mongodb://localhost:27017/mimihair";
const ATLAS_DB = process.env.MONGODB_URI;

// MODELS
const Product = require("./models/product");
const Category = require("./models/category");
const User = require("./models/user");

// CONNECT + MIGRATE
const migrate = async () => {
  try {
    console.log("Connecting to LOCAL DB...");
    const localConn = await mongoose.createConnection(LOCAL_DB);

    console.log("Connecting to ATLAS DB...");
    const atlasConn = await mongoose.createConnection(ATLAS_DB);

    // Bind models to connections
    const LocalProduct = localConn.model("Product", Product.schema);
    const AtlasProduct = atlasConn.model("Product", Product.schema);

    const LocalCategory = localConn.model("Category", Category.schema);
    const AtlasCategory = atlasConn.model("Category", Category.schema);

    console.log("Migrating categories...");
    const categories = await LocalCategory.find();
    await AtlasCategory.insertMany(categories);

    console.log("Migrating products...");
    const products = await LocalProduct.find();
    await AtlasProduct.insertMany(products);

    console.log("Migrating users...");
    const LocalUser = localConn.model("User", User.schema);
    const AtlasUser = atlasConn.model("User", User.schema);

    const users = await LocalUser.find();
    await AtlasUser.insertMany(users);

    console.log("✅ MIGRATION COMPLETE!");
    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrate();