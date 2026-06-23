
const express = require("express")
const cartController = require("../controllers/cartController")
const auth = require("../middleware/auth")
const handleAnonymousCart = require("../middleware/anonymousCart")

const router = express.Router()

router.use(handleAnonymousCart)

router.post("/addToCart", auth.optional, cartController.addToCart)
router.get("/", auth.optional, cartController.getCart)
router.put("/update", auth.optional, cartController.updateQuantity)
router.delete("/remove/:itemId", auth.optional, cartController.removeItem);

module.exports = router
