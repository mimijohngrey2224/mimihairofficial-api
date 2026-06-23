const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastName: String,
    phone: String,
    address: String,
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],
    amount: Number,
    status: {
      type: String,
      default: "pending",
    },
    transactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);