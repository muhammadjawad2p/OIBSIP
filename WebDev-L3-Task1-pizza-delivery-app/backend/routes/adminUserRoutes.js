const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, deleteUser } = require("../controllers/userManagementController");

router.use(protectAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;
