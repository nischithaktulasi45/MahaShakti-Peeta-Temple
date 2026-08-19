const mongoose = require("mongoose");

const galleryPhotoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
    },

    source: {
      type: String,
      enum: ["default", "uploaded"],
      default: "uploaded",
    },

    orientation: {
      type: String,
      enum: ["landscape", "portrait", "square", "vertical"],
      default: "landscape",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.GalleryPhoto ||
  mongoose.model("GalleryPhoto", galleryPhotoSchema);