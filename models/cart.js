
// chnage to new 18 march
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  anonymousId: { type: String },

  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);

