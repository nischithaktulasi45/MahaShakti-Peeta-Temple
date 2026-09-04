const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const multer = require("multer");
const { listGalleryPhotos, createGalleryPhotoRecord, deleteGalleryPhotoRecord } = require("../utils/storage");
const GalleryPhoto = require("../models/GalleryPhoto");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const resolveMediaFilePath = (mediaUrl) => {
  if (!mediaUrl) return null;

  try {
    const parsed = new URL(mediaUrl);
    const pathname = decodeURIComponent(parsed.pathname);
    const relativePath = pathname.replace(/^\/+/, "");
    if (!relativePath) return null;
    return path.join(__dirname, "..", "..", "client", "public", relativePath);
  } catch {
    if (!mediaUrl.startsWith("/")) return null;
    const relativePath = mediaUrl.replace(/^\/+/, "");
    return path.join(__dirname, "..", "..", "client", "public", relativePath);
  }
};

const removeUploadedMediaFile = (mediaUrl) => {
  if (!mediaUrl) return;

  const filePath = resolveMediaFilePath(mediaUrl);
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn("Failed to remove uploaded gallery file:", mediaUrl, error.message || error);
  }
};

const getGalleryPhotos = asyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
  );

  if (
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    const photos = await GalleryPhoto.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: photos,
    });
  }

  const photos = listGalleryPhotos();

  res.status(200).json({
    success: true,
    data: photos,
  });
});
const updateGalleryPhoto = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    orientation,
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const allowedOrientations = [
    "landscape",
    "portrait",
    "square",
    "vertical",
  ];

  if (
    orientation &&
    !allowedOrientations.includes(orientation)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid orientation",
    });
  }

  if (mongoose.connection.readyState === 1) {
    const photo = await GalleryPhoto.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description || "",
        category: category || "General",
        ...(orientation ? { orientation } : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Gallery photo not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: photo,
    });
  }

  const photo = listGalleryPhotos().find(
    (item) => item._id === req.params.id
  );

  if (!photo) {
    return res.status(404).json({
      success: false,
      message: "Gallery photo not found",
    });
  }

  photo.title = title.trim();
  photo.description = description || "";
  photo.category = category || "General";

  if (orientation) {
    photo.orientation = orientation;
  }

  return res.status(200).json({
    success: true,
    data: photo,
  });
});
const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryHelper");

const uploadGalleryImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  const buffer = req.file.buffer;

  // Try Cloudinary upload if configured
  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadBufferToCloudinary(buffer, {
        folder: "temple-website/gallery",
        resource_type: "image",
      });
      return res.status(201).json({
        success: true,
        data: { imageUrl: result.url, publicId: result.publicId },
      });
    } catch (err) {
      console.warn("Cloudinary upload failed, using local storage fallback:", err?.message || err);
    }
  }

  // Local storage fallback
  const originalName = req.file.originalname || "image";
  const extension = path.extname(originalName) || ".jpg";
  const publicDir = path.join(__dirname, "..", "..", "client", "public", "image", "gallery");
  fs.mkdirSync(publicDir, { recursive: true });

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const imagePath = path.join(publicDir, safeName);
  fs.writeFileSync(imagePath, buffer);

  const imageUrl = `/image/gallery/${safeName}`;
  res.status(201).json({ success: true, data: { imageUrl, publicId: safeName } });
});

const createGalleryPhoto = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, publicId, category, orientation } = req.body;
  if (!title || !imageUrl || !orientation) {
    return res.status(400).json({ success: false, message: "Title, image URL, and orientation are required" });
  }

  const allowedOrientations = ["landscape", "portrait", "square", "vertical"];
  if (!allowedOrientations.includes(orientation)) {
    return res.status(400).json({ success: false, message: "Invalid orientation" });
  }

  if (mongoose.connection.readyState === 1) {
    const photo = await GalleryPhoto.create({ title, description, imageUrl, publicId, category, orientation });
    return res.status(201).json({ success: true, data: photo });
  }

  const photo = createGalleryPhotoRecord({ title, description, imageUrl, publicId, category, orientation });
  res.status(201).json({ success: true, data: photo });
});

const deleteGalleryPhoto = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: "Gallery photo not found" });
    }
    if (photo.publicId && !photo.publicId.includes(".")) {
      await deleteFromCloudinary(photo.publicId, "image");
    }
    removeUploadedMediaFile(photo.imageUrl);
    return res.status(200).json({ success: true, message: "Gallery photo deleted successfully" });
  }

  const photo = deleteGalleryPhotoRecord(req.params.id);
  if (!photo) {
    return res.status(404).json({ success: false, message: "Gallery photo not found" });
  }

  if (photo.publicId && !photo.publicId.includes(".")) {
    await deleteFromCloudinary(photo.publicId, "image");
  }
  removeUploadedMediaFile(photo.imageUrl);
  res.status(200).json({ success: true, message: "Gallery photo deleted successfully" });
});

module.exports = {
  getGalleryPhotos,
  uploadGalleryImage,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  upload,
};