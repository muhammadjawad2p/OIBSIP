const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza" },
    name: { type: String, required: true },
    size: { type: String, enum: ["Small", "Medium", "Large"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    customization: {
      base: String,
      sauce: String,
      cheese: String,
      vegetables: [String],
    },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const ORDER_STATUSES = [
  "Order Received",
  "Preparing",
  "In Kitchen",
  "Ready",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
    },
    couponCode: { type: String, default: null },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Order Received",
    },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUSES },
        changedAt: { type: Date, default: Date.now },
      },
    ],
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

orderSchema.statics.STATUSES = ORDER_STATUSES;

module.exports = mongoose.model("Order", orderSchema);
