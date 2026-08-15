const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    method: {
      type: String,
      enum: ["Razorpay", "EasyPaisa"],
      default: "Razorpay",
    },

    // Razorpay-specific fields (unused when method === "EasyPaisa")
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // EasyPaisa mock-specific fields (unused when method === "Razorpay")
    transactionId: { type: String }, // our own generated mock txn ref, e.g. EP-XXXXXXXX
    mobileAccountNumber: { type: String }, // the 03XXXXXXXXX number entered at checkout

    amount: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    status: {
      type: String,
      enum: ["Created", "Paid", "Failed"],
      default: "Created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
