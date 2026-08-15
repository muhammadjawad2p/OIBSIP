const express = require("express");
const router = express.Router();
const { protectUser } = require("../middlewares/authMiddleware");
const {
  createRazorpayOrder,
  verifyPayment,
  markPaymentFailed,
  getMyPayments,
} = require("../controllers/paymentController");
const {
  initiateEasyPaisaPayment,
  confirmEasyPaisaPayment,
} = require("../controllers/easyPaisaController");

router.use(protectUser);

// Razorpay (India, test mode)
router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);
router.post("/failed", markPaymentFailed);

// EasyPaisa (simulated flow for demo purposes)
router.post("/easypaisa/initiate", initiateEasyPaisaPayment);
router.post("/easypaisa/confirm", confirmEasyPaisaPayment);

router.get("/my-payments", getMyPayments);

module.exports = router;
