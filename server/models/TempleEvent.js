const mongoose = require("mongoose");

const templeEventSchema = new mongoose.Schema(
  {
    tag: { type: String, default: "" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    location: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    category: { type: String, default: "General" },
    contactInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.TempleEvent || mongoose.model("TempleEvent", templeEventSchema);
