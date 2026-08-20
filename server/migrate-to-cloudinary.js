require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary");
const GalleryPhoto = require("./models/GalleryPhoto");
const ProgressVideo = require("./models/ProgressVideo");
const TempleEvent = require("./models/TempleEvent");

const CLIENT_PUBLIC = path.join(__dirname, "..", "client", "public");

function resolveLocalFilePath(url) {
  if (!url) return null;
  const cleaned = url.replace(/^https?:\/\/[^/]+/, "").replace(/\\/g, "/");
  const filename = path.basename(cleaned);
  const candidates = [
    path.join(CLIENT_PUBLIC, cleaned.replace(/^\//, "")),
    path.join(CLIENT_PUBLIC, "progress", filename),
    path.join(CLIENT_PUBLIC, "image", filename),
    path.join(CLIENT_PUBLIC, "image", "gallery", filename),
    path.join(CLIENT_PUBLIC, "images", "events", filename),
  ];
  for (const c of candidates) { if (fs.existsSync(c)) return c; }
  return null;
}

function uploadToCloudinary(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: options.folder || "temple-website", resource_type: options.resource_type || "auto", use_filename: true, unique_filename: true },
      (error, result) => { if (error) return reject(error); resolve(result); }
    );
    fs.createReadStream(filePath).pipe(stream);
  });
}

async function migrateGallery() {
  console.log("\n=== GALLERY PHOTOS ===");
  const photos = await GalleryPhoto.find();
  console.log(`Found ${photos.length} gallery records`);
  let uploaded = 0, skipped = 0, failed = 0;
  for (const photo of photos) {
    if (photo.imageUrl && photo.imageUrl.includes("cloudinary.com")) { console.log(`  [SKIP] ${photo.title}`); skipped++; continue; }
    const localPath = resolveLocalFilePath(photo.imageUrl);
    if (!localPath) { console.log(`  [MISSING] ${photo.imageUrl} (${photo.title})`); skipped++; continue; }
    try {
      console.log(`  [UPLOAD] ${photo.title} -> ${path.basename(localPath)}`);
      const result = await uploadToCloudinary(localPath, { folder: "temple-website/gallery", resource_type: "image" });
      await GalleryPhoto.findByIdAndUpdate(photo._id, { imageUrl: result.secure_url, publicId: result.public_id });
      console.log(`    OK: ${result.secure_url}`);
      uploaded++;
    } catch (err) { console.error(`    FAIL: ${err.message || err}`); failed++; }
  }
  console.log(`Gallery: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

async function migrateEvents() {
  console.log("\n=== TEMPLE EVENTS ===");
  const events = await TempleEvent.find({ imageUrl: { $ne: "" } });
  console.log(`Found ${events.length} events with images`);
  let uploaded = 0, skipped = 0, failed = 0;
  for (const event of events) {
    if (event.imageUrl && event.imageUrl.includes("cloudinary.com")) { console.log(`  [SKIP] ${event.title}`); skipped++; continue; }
    const localPath = resolveLocalFilePath(event.imageUrl);
    if (!localPath) { console.log(`  [MISSING] ${event.imageUrl} (${event.title})`); skipped++; continue; }
    try {
      console.log(`  [UPLOAD] ${event.title} -> ${path.basename(localPath)}`);
      const result = await uploadToCloudinary(localPath, { folder: "temple-website/events", resource_type: "image" });
      await TempleEvent.findByIdAndUpdate(event._id, { imageUrl: result.secure_url, publicId: result.public_id });
      console.log(`    OK: ${result.secure_url}`);
      uploaded++;
    } catch (err) { console.error(`    FAIL: ${err.message || err}`); failed++; }
  }
  console.log(`Events: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

async function migrateVideos() {
  console.log("\n=== PROGRESS VIDEOS ===");
  const videos = await ProgressVideo.find();
  console.log(`Found ${videos.length} video records`);
  let uploaded = 0, skipped = 0, failed = 0;
  for (const video of videos) {
    if (video.videoUrl && video.videoUrl.includes("cloudinary.com")) { console.log(`  [SKIP] ${video.title}`); skipped++; continue; }
    const localPath = resolveLocalFilePath(video.videoUrl);
    if (!localPath) { console.log(`  [MISSING] ${video.videoUrl} (${video.title})`); skipped++; continue; }
    const sizeMB = (fs.statSync(localPath).size / 1024 / 1024).toFixed(1);
    try {
      console.log(`  [UPLOAD] ${video.title} -> ${path.basename(localPath)} (${sizeMB} MB)`);
      const result = await uploadToCloudinary(localPath, { folder: "temple-website/videos", resource_type: "video" });
      await ProgressVideo.findByIdAndUpdate(video._id, { videoUrl: result.secure_url, publicId: result.public_id });
      console.log(`    OK: ${result.secure_url}`);
      uploaded++;
    } catch (err) { console.error(`    FAIL: ${err.message || err}`); failed++; }
  }
  console.log(`Videos: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
}

async function main() {
  console.log("Starting Cloudinary migration...");
  console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
  try { const ping = await cloudinary.api.ping(); console.log("Cloudinary OK:", ping.status); } catch(e) { console.error("Cloudinary FAIL:", e.message); process.exit(1); }
  try { await mongoose.connect(process.env.MONGODB_URI); console.log("MongoDB OK"); } catch(e) { console.error("MongoDB FAIL:", e.message); process.exit(1); }
  await migrateGallery();
  await migrateEvents();
  await migrateVideos();
  console.log("\nMigration complete!");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error("Migration error:", e); process.exit(1); });
