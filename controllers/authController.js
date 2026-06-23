const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Cart = require("../models/cart")   // 👈 ADD THIS

//password validation function

const validatePassword = (password) => {
  const pass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pass.test(password);
};


exports.register = async (req, res) => {
   console.log("REGISTER ROUTE HIT");
  console.log("REGISTER BODY:", req.body);
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    role
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters and contain letters and numbers"
    });
  }

  try {
    // Always lowercase emails
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      password,
      role
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // await mergeGuestCart(user._id, req.body.guestCart);

    // Generate token
    const token = user.generateAuthToken();

    const { password: pwd, ...userData } = user._doc;

    res.status(201).json({
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//19 march 
exports.login = async (req, res) => {
  console.log("BODY FROM FRONTEND:", req.body);

  const { email, password, anonymousId } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid Email/Password" });
    }

    const validPassword = await bcrypt.compare(
      password.trim(),
      user.password
    );

    console.log("Password match:", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Email/Password" });
    }

    // ✅ MERGE CART
    if (anonymousId) {
      const guestCart = await Cart.findOne({ anonymousId });

      if (guestCart) {
        let userCart = await Cart.findOne({ user: user._id });

        if (!userCart) {
          guestCart.user = user._id;
          guestCart.anonymousId = undefined;
          await guestCart.save();
        } else {
          guestCart.products.forEach((guestItem) => {
            const existingItem = userCart.products.find(
              (item) =>
                item.product.toString() === guestItem.product.toString()
            );

            if (existingItem) {
              existingItem.quantity += guestItem.quantity;
            } else {
              userCart.products.push(guestItem);
            }
          });

          await userCart.save();
          await Cart.findByIdAndDelete(guestCart._id);
        }
      }
    }

    const token = user.generateAuthToken();

    const { password: pwd, ...userData } = user._doc;

    res.json({ token, user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


   