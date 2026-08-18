const mongoose = require("mongoose");

const progressVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    publicId: { type: String, default: "" },
    orientation: {
      type: String,
      enum: ["landscape", "portrait", "square", "vertical"],
      default: "landscape",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ProgressVideo || mongoose.model("ProgressVideo", progressVideoSchema);
