const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const Admin = require("../models/Admin");
const { createDefaultAdminIfNeeded, getAdminByEmail, compareAdminPassword } = require("../utils/storage");
const { sendVerificationEmail } = require("../utils/emailService");

const getJwtSecret = () => process.env.JWT_SECRET || "temple-admin-secret";
const getTokenExpiration = () => ({ expiresIn: "8h" });
const createVerificationToken = () => crypto.randomBytes(32).toString("hex");

const createAdminIfNeeded = async () => {
  const result = await createDefaultAdminIfNeeded();
  const admin = result?.admin || result;

  if (result?.created && admin?.verificationToken) {
    try {
      await sendVerificationEmail({ email: admin.email, name: admin.name, token: admin.verificationToken });
      console.log(`Verification email dispatched to admin: ${admin.email}`);
    } catch (error) {
      console.warn("Failed to send verification email for new admin account", error.message || error);
    }
  }

  return admin;
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const admin = await getAdminByEmail(email);
  if (!admin) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = await compareAdminPassword(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  if (!admin.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Email not verified. Please verify your admin email before logging in.",
      verificationRequired: true,
    });
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, getJwtSecret(), getTokenExpiration());

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

const verifyAdminEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({ success: false, message: "Verification token is required" });
  }

  const admin = await Admin.findOne({ verificationToken: token });
  if (!admin) {
    return res.status(400).json({ success: false, message: "Invalid verification link" });
  }

  if (!admin.verificationTokenExpiresAt || admin.verificationTokenExpiresAt < new Date()) {
    return res.status(400).json({ success: false, message: "Verification link has expired" });
  }

  admin.isVerified = true;
  admin.verificationToken = null;
  admin.verificationTokenExpiresAt = null;
  await admin.save();

  res.status(200).json({ success: true, message: "Email verified successfully. You may now login." });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const admin = await getAdminByEmail(email);
  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin account not found" });
  }

  if (admin.isVerified) {
    return res.status(400).json({ success: false, message: "Admin email is already verified" });
  }

  const verificationToken = createVerificationToken();
  admin.verificationToken = verificationToken;
  admin.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await admin.save();

  await sendVerificationEmail({ email: admin.email, name: admin.name, token: verificationToken });

  res.status(200).json({ success: true, message: "Verification email sent" });
});

module.exports = {
  createAdminIfNeeded,
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
  verifyAdminEmail,
  resendVerificationEmail,
};
