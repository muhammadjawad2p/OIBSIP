const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/authMiddleware");
const {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  increaseStock,
  decreaseStock,
  deleteInventoryItem,
} = require("../controllers/inventoryController");

router.use(protectAdmin);

router.get("/", getInventory);
router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.patch("/:id/increase", increaseStock);
router.patch("/:id/decrease", decreaseStock);
router.delete("/:id", deleteInventoryItem);

module.exports = router;
