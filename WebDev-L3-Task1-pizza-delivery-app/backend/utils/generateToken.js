const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

const generateRefreshToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};

const generateRandomToken = () => crypto.randomBytes(32).toString("hex");

module.exports = { generateAccessToken, generateRefreshToken, generateRandomToken };
