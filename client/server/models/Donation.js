const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    utrNumber: {
      type: String,
      required: true,
      trim: true,
    },
    paymentStatus: {
      type: String,
      default: "submitted",
      enum: ["submitted", "completed", "failed"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Donation", donationSchema);
