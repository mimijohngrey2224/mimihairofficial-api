
const Product = require("../models/product");
const { validateProduct } = require("../validator");

exports.createProduct = async (req, res) => {
  try {
    // ✅ FIX DATA TYPES FIRST
    req.body.price = Number(req.body.price);
    req.body.featured = req.body.featured === "true";
    req.body.trending = req.body.trending === "true";

    // ✅ THEN VALIDATE
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    // ✅ FIX PATHS FOR BROWSER
    const imgPath = req.files?.img?.[0]?.path
      ? req.files.img[0].path.replace(/\\/g, "/")
      : null;

    const videoPath = req.files?.video?.[0]?.path
      ? req.files.video[0].path.replace(/\\/g, "/")
      : null;

    if (!imgPath) {
      return res.status(400).json("Product image is required");
    }

    const product = new Product({
      category: req.body.category,
      name: req.body.name,
      img: imgPath,
      video: videoPath,
      price: req.body.price,
      featured: req.body.featured,
      trending: req.body.trending,
    });

    const productItem = await product.save();
    res.status(201).json(productItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProducts = async (req, res)=>{
  try {
    const product = await Product.find().populate('category')
    res.json(product)
  } catch (error) {
    res.status(500).json({message: error.message})
    
  }
} 

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getFeaturedProducts = async(req, res)=>{
  try {
    const featured = await Product.find({featured: true}).populate('category')
    res.json(featured)
  } catch (error) {
    res.json({message: error.message})
  }
}

exports.getTrendingProducts = async(req, res)=>{
  try {
    const trending = await Product.find({trending: true}).populate('category')
    res.json(trending)
  } catch (error) {
    res.json({message: error.message})
  }
}

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getShopAllProducts = async (req, res) => {
  try {
    const ACCESSORIES_ID = "69725870dbc24cf84962c756";

    const products = await Product.find({
      category: ACCESSORIES_ID,
    }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



