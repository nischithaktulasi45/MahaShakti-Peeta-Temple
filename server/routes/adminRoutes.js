const express = require("express");
const router = express.Router();

const protectAdmin = require("../middleware/auth");

const {
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
  verifyAdminEmail,
  resendVerificationEmail,
} = require("../controllers/adminController");

const {
  getContactMessages,
  deleteContactMessage,
} = require("../controllers/contactController");

const {
  getDonationRecords,
} = require("../controllers/donationController");

// ===============================
// ADMIN AUTH
// ===============================

router.post("/login", loginAdmin);

router.post(
  "/logout",
  protectAdmin,
  logoutAdmin
);

router.get(
  "/me",
  protectAdmin,
  getAdminProfile
);

router.get(
  "/verify/:token",
  verifyAdminEmail
);

router.post(
  "/resend-verification",
  resendVerificationEmail
);

// ===============================
// CONTACT MESSAGES
// ===============================

// Get all submitted contact forms
router.get(
  "/contacts",
  protectAdmin,
  getContactMessages
);

// Delete a submitted contact form
router.delete(
  "/contacts/:id",
  protectAdmin,
  deleteContactMessage
);

// ===============================
// DONATIONS
// ===============================

router.get(
  "/donations",
  protectAdmin,
  getDonationRecords
);

module.exports = router;