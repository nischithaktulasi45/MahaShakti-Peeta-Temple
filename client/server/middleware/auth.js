const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const Admin = require("../models/Admin");
const { getAdminById } = require("../utils/storage");

const protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "temple-admin-secret");
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  try {
    let admin = null;

    if (mongoose.connection.readyState === 1) {
      admin = await Admin.findById(decoded.id).select("-passwordHash");
    }

    if (!admin) {
      admin = await getAdminById(decoded.id);
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    console.error("Admin authentication lookup failed:", error.message || error);
    return res.status(500).json({ success: false, message: "Unable to verify admin session. Please try again." });
  }
});

module.exports = protectAdmin;
