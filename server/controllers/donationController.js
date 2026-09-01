const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const asyncHandler = require("../utils/asyncHandler");
const { createDonationRecord, listDonationRecords } = require("../utils/storage");

const submitDonation = asyncHandler(async (req, res) => {
  const { name, phone, email, amount, purpose, utrNumber, paymentStatus } = req.body;
  if (!name || !phone || !email || !amount || !purpose || !utrNumber) {
    return res.status(400).json({ success: false, message: "All donation fields are required" });
  }

  const payload = {
    name,
    phone,
    email,
    amount: Number(amount),
    purpose,
    utrNumber,
    paymentStatus: paymentStatus || "submitted",
  };

  // Save to memory storage immediately for instant response (critical for Vercel)
  const donation = createDonationRecord(payload);
  console.log(`Memory storage donation record created: ${donation._id}`);

  // Return instant response to user
  res.status(201).json({
    success: true,
    message: "Donation saved successfully",
    data: donation,
  });

  // Save to MongoDB in background (non-blocking) for persistence
  if (mongoose.connection.readyState === 1) {
    Donation.create(payload)
      .then((dbDonation) => {
        console.log(`MongoDB donation record created in background: ${dbDonation._id}`);
      })
      .catch((error) => {
        console.error("Background MongoDB save failed:", error.message);
      });
  }
});

const getDonationRecords = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: donations });
  }

  const donations = listDonationRecords();
  res.status(200).json({ success: true, data: donations });
});

module.exports = { submitDonation, getDonationRecords };
