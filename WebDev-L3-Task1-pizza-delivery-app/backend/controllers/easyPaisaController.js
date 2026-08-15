const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

// This is a SIMULATED EasyPaisa flow for demo/internship purposes.
// Real EasyPaisa integration requires a registered business merchant account,
// KYC approval, and credentials issued directly by Easypaisa (see their
// Merchant Integration Guide). This mock reproduces the user experience
// (mobile account number entry, processing delay, success/fail) without
// calling any real Easypaisa endpoint.

const generateTxnId = () =>
  `EP-${Date.now()}${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

// Basic Pakistani mobile number validation: 03XXXXXXXXX (11 digits)
const isValidMobileAccount = (number) => /^03\d{9}$/.test(number);

// @desc    Initiate a mock EasyPaisa transaction
// @route   POST /api/payments/easypaisa/initiate
exports.initiateEasyPaisaPayment = async (req, res, next) => {
  try {
    const { amount, mobileAccountNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (!isValidMobileAccount(mobileAccountNumber)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid EasyPaisa mobile account number (e.g. 03XXXXXXXXX)",
      });
    }

    const transactionId = generateTxnId();

    const payment = await Payment.create({
      user: req.user._id,
      method: "EasyPaisa",
      transactionId,
      mobileAccountNumber,
      amount,
      currency: "PKR",
      status: "Created",
    });

    res.status(201).json({
      success: true,
      paymentId: payment._id,
      transactionId,
      message: "Transaction initiated. Awaiting confirmation.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm/simulate the mock EasyPaisa transaction result
// @route   POST /api/payments/easypaisa/confirm
exports.confirmEasyPaisaPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, simulateSuccess = true } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (!simulateSuccess) {
      payment.status = "Failed";
      await payment.save();
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
      }
      return res.json({ success: false, message: "Payment declined", payment });
    }

    payment.status = "Paid";

    if (orderId) {
      payment.order = orderId;
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        payment: payment._id,
      });
    }

    await payment.save();

    res.json({ success: true, message: "Payment confirmed successfully", payment });
  } catch (error) {
    next(error);
  }
};
