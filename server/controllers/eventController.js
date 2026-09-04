const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const { listTempleEvents, createTempleEventRecord, updateTempleEventRecord, deleteTempleEventRecord } = require("../utils/storage");
const TempleEvent = require("../models/TempleEvent");

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
    console.warn("Failed to remove uploaded event file:", mediaUrl, error.message || error);
  }
};

const getTempleEvents = asyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
  );

  if (
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    const events = await TempleEvent.find().sort({ createdAt: -1 }).lean();
    console.log(`Returning ${events.length} temple events from MongoDB`);
    return res.status(200).json({ success: true, data: events });
  }

  const events = listTempleEvents();
  console.log(`Returning ${events.length} temple events from memory storage`);
  res.status(200).json({ success: true, data: events });
});

const {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryHelper");

const uploadTempleEventImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Event photo is required" });
  }

  const buffer = req.file.buffer;

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadBufferToCloudinary(buffer, {
        folder: "temple-website/events",
        resource_type: "image",
      });
      return res.status(201).json({
        success: true,
        data: { imageUrl: result.url, publicId: result.publicId },
      });
    } catch (err) {
      console.warn("Cloudinary event upload failed, using local fallback:", err?.message || err);
    }
  }

  const originalName = req.file.originalname || "event";
  const extension = path.extname(originalName) || ".jpg";
  const publicDir = path.resolve(__dirname, "..", "..", "client", "public", "images", "events");
  fs.mkdirSync(publicDir, { recursive: true });

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const imagePath = path.join(publicDir, safeName);
  fs.writeFileSync(imagePath, buffer);

  const imageUrl = `/images/events/${safeName}`;
  res.status(201).json({ success: true, data: { imageUrl, publicId: safeName } });
});

const createTempleEvent = asyncHandler(async (req, res) => {
  const { tag, title, description, date, startTime, endTime, location, imageUrl, publicId, category, contactInfo } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: "Please enter an event title." });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: "Please enter an event description." });
  }

  if (mongoose.connection.readyState === 1) {
    const event = await TempleEvent.create({
      tag: tag || "",
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      endTime,
      location,
      imageUrl,
      publicId: publicId || "",
      category,
      contactInfo,
    });
    console.log("Temple event saved to MongoDB", { id: event._id, title: event.title, imageUrl: event.imageUrl });
    return res.status(201).json({ success: true, data: event });
  }

  const event = createTempleEventRecord({ tag: tag || "", title: title.trim(), description: description.trim(), date, startTime, endTime, location, imageUrl, publicId: publicId || "", category, contactInfo });
  console.log("Temple event saved to memory storage", { id: event._id, title: event.title, imageUrl: event.imageUrl });
  res.status(201).json({ success: true, data: event });
});

const updateTempleEvent = asyncHandler(async (req, res) => {
  const { tag, title, description, date, startTime, endTime, location, imageUrl, publicId, category, contactInfo } = req.body;

  if (mongoose.connection.readyState === 1) {
    const event = await TempleEvent.findByIdAndUpdate(
      req.params.id,
      { tag, title, description, date, startTime, endTime, location, imageUrl, ...(publicId ? { publicId } : {}), category, contactInfo },
      { new: true, runValidators: true },
    );
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(200).json({ success: true, data: event });
  }

  const event = updateTempleEventRecord(req.params.id, req.body);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.status(200).json({ success: true, data: event });
});

const deleteTempleEvent = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const event = await TempleEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    if (event.publicId && !event.publicId.includes(".")) {
      await deleteFromCloudinary(event.publicId, "image");
    }
    removeUploadedMediaFile(event.imageUrl);
    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  }

  const event = deleteTempleEventRecord(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  if (event.publicId && !event.publicId.includes(".")) {
    await deleteFromCloudinary(event.publicId, "image");
  }
  removeUploadedMediaFile(event.imageUrl);
  res.status(200).json({ success: true, message: "Event deleted successfully" });
});

module.exports = { getTempleEvents, uploadTempleEventImage, createTempleEvent, updateTempleEvent, deleteTempleEvent, upload };
