const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

// @desc    Create a Razorpay order (call before showing checkout modal)
// @route   POST /api/payments/create-order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body; // amount in INR (rupees)
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const payment = await Payment.create({
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount,
      status: "Created",
    });

    res.status(201).json({
      success: true,
      razorpayOrder,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment signature after checkout completes
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // our internal Order _id, if already created
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (generatedSignature !== razorpay_signature) {
      payment.status = "Failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    payment.status = "Paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    if (orderId) {
      payment.order = orderId;
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        payment: payment._id,
      });
    }

    await payment.save();

    res.json({ success: true, message: "Payment verified successfully", payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a payment failed (called from client on Razorpay failure handler)
// @route   POST /api/payments/failed
exports.markPaymentFailed = async (req, res, next) => {
  try {
    const { razorpay_order_id, orderId } = req.body;
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (payment) {
      payment.status = "Failed";
      await payment.save();
    }
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
    }
    res.json({ success: true, message: "Payment marked as failed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's payment history
// @route   GET /api/payments/my-payments
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};
