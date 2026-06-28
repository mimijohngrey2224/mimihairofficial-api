
const express = require("express");
// const multer = require("multer");
const upload = require("../config/cloudinaryStorage");

const {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getShopAllProducts,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts
} = require("../controllers/productController");

const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// GET ALL PRODUCTS
router.get("/", getAllProducts);

// CREATE PRODUCT (ADMIN ONLY)
router.post(
  "/",
  auth,
  admin,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createProduct
);

router.get("/featured", getFeaturedProducts);
router.get("/trending", getTrendingProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/shopall", getShopAllProducts);
router.get("/:id", getProductById);

module.exports = router;
