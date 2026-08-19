const Donation = require("../models/Donation");
const asyncHandler = require("../utils/asyncHandler");

const submitDonation = asyncHandler(async (req, res) => {
  const { name, phone, email, amount, purpose, utrNumber, paymentStatus } = req.body;
  if (!name || !phone || !email || !amount || !purpose || !utrNumber) {
    return res.status(400).json({ success: false, message: "All donation fields are required" });
  }

  const donation = await Donation.create({
    name,
    phone,
    email,
    amount,
    purpose,
    utrNumber,
    paymentStatus: paymentStatus || "submitted",
  });

  res.status(201).json({
    success: true,
    message: "Donation saved successfully",
    data: donation,
  });
});

const getDonationRecords = asyncHandler(async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: donations });
});

module.exports = { submitDonation, getDonationRecords };
