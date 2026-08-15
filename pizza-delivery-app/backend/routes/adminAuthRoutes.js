const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const validate = require("../middlewares/validateMiddleware");
const { protectAdmin } = require("../middlewares/authMiddleware");
const { adminLogin, getAdminMe } = require("../controllers/adminAuthController");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  adminLogin
);

router.get("/me", protectAdmin, getAdminMe);

module.exports = router;
