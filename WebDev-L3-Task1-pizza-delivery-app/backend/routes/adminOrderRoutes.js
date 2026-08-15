const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/authMiddleware");
const {
  getAllOrdersAdmin,
  updateOrderStatus,
  getDashboardStats,
} = require("../controllers/orderController");

router.use(protectAdmin);

router.get("/", getAllOrdersAdmin);
router.get("/stats", getDashboardStats);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
