
const Cart = require("../models/cart");
const Product = require("../models/product"); 
const mongoose = require("mongoose");

// Calculate Amount
const calculateAmount = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  return product.price * quantity;
};


//to new 18 march

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ anonymousId: req.anonymousId });
    }

    // ✅ Create only if not exist
    if (!cart) {
      cart = new Cart({
        user: req.user ? req.user.id : null,
        anonymousId: req.user ? null : req.anonymousId,
        products: []
      });
    }

    const existingItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity
      });
    }

    await cart.save();
    await cart.populate("products.product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//change to new 18th march
exports.getCart = async (req, res) => {
  try {
    let cart;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ anonymousId: req.anonymousId });
    }

    if (!cart) {
      return res.json({ products: [] });
    }

    await cart.populate("products.product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// change to new 18 march
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ anonymousId: req.anonymousId });
    }

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.products.find(
      (i) => i.product.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("products.product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//change to new 18 march
exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    let cart;

    if (req.user) {
      cart = await Cart.findOne({ user: req.user.id });
    } else {
      cart = await Cart.findOne({ anonymousId: req.anonymousId });
    }

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // 🔥 REMOVE ONLY ONE ITEM
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== itemId
    );

    await cart.save();
    await cart.populate("products.product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

