const mongoose = require("mongoose");

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delievered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clientSecret: {
      type: String,
      required: true,
    },
    payementIntentID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
