const Admin = require("../models/Admin");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

// @desc    Admin login
// @route   POST /api/admin/auth/login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(admin._id, admin.role);
    const refreshToken = generateRefreshToken(admin._id, admin.role);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in admin profile
// @route   GET /api/admin/auth/me
exports.getAdminMe = async (req, res, next) => {
  res.json({ success: true, admin: req.admin });
};
