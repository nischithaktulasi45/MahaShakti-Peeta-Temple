const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const multer = require("multer");

const {
  listProgressVideos,
  createProgressVideoRecord,
  deleteProgressVideoRecord,
} = require("../utils/storage");

const ProgressVideo = require("../models/ProgressVideo");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

// =========================================================
// GET ALL PROGRESS VIDEOS
// =========================================================

const getProgressVideos = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const videos = await ProgressVideo.find()
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      `Returning ${videos.length} progress videos from MongoDB`
    );

    return res.status(200).json({
      success: true,
      data: videos,
    });
  }

  const videos = listProgressVideos();

  console.log(
    `Returning ${videos.length} progress videos from memory storage`
  );

  res.status(200).json({
    success: true,
    data: videos,
  });
});

// =========================================================
// MEDIA FILE HELPERS
// =========================================================

const resolveMediaFilePath = (mediaUrl) => {
  if (!mediaUrl) return null;

  try {
    const parsed = new URL(mediaUrl);
    const pathname = decodeURIComponent(parsed.pathname);

    const relativePath = pathname.replace(/^\/+/, "");

    if (!relativePath) return null;

    return path.join(
      __dirname,
      "..",
      "..",
      "client",
      "public",
      relativePath
    );
  } catch {
    if (!mediaUrl.startsWith("/")) return null;

    const relativePath = mediaUrl.replace(/^\/+/, "");

    return path.join(
      __dirname,
      "..",
      "..",
      "client",
      "public",
      relativePath
    );
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
    console.warn(
      "Failed to remove uploaded media file:",
      mediaUrl,
      error.message || error
    );
  }
};

// =========================================================
// UPLOAD PROGRESS VIDEO
// =========================================================

const uploadProgressVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Video file is required",
    });
  }

  const orientation = req.body.orientation;

  const allowedOrientations = [
    "landscape",
    "portrait",
    "square",
    "vertical",
  ];

  if (
    !orientation ||
    !allowedOrientations.includes(orientation)
  ) {
    return res.status(400).json({
      success: false,
      message: "Video orientation is required",
    });
  }

  const buffer = req.file.buffer;

  const originalName =
    req.file.originalname || "video";

  const extension =
    path.extname(originalName) || ".mp4";

  const publicDir = path.join(
    __dirname,
    "..",
    "..",
    "client",
    "public",
    "progress"
  );

  fs.mkdirSync(publicDir, {
    recursive: true,
  });

  const safeName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${extension}`;

  const videoPath = path.join(
    publicDir,
    safeName
  );

  fs.writeFileSync(videoPath, buffer);

  const baseUrl = (
    process.env.SERVER_URL ||
    process.env.API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  const videoUrl = `${baseUrl}/progress/${safeName}`;

  const publicId = safeName;

  res.status(201).json({
    success: true,
    data: {
      videoUrl,
      publicId,
      orientation,
    },
  });
});

// =========================================================
// CREATE PROGRESS VIDEO
// =========================================================

const createProgressVideo = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      publicId,
      orientation,
    } = req.body;

    if (!title || !videoUrl || !orientation) {
      return res.status(400).json({
        success: false,
        message:
          "Title, video URL, and orientation are required",
      });
    }

    const allowedOrientations = [
      "landscape",
      "portrait",
      "square",
      "vertical",
    ];

    if (
      !allowedOrientations.includes(orientation)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid orientation",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const video =
        await ProgressVideo.create({
          title,
          description,
          videoUrl,
          thumbnailUrl,
          publicId,
          orientation,
        });

      console.log(
        "Progress video saved to MongoDB",
        {
          id: video._id,
          title,
          videoUrl,
        }
      );

      return res.status(201).json({
        success: true,
        data: video,
      });
    }

    const video =
      createProgressVideoRecord({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        publicId,
        orientation,
      });

    console.log(
      "Progress video saved to memory storage",
      {
        id: video._id,
        title,
        videoUrl,
      }
    );

    res.status(201).json({
      success: true,
      data: video,
    });
  }
);

// =========================================================
// UPDATE PROGRESS VIDEO
// =========================================================

const updateProgressVideo = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      thumbnailUrl,
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

    // MongoDB
    if (mongoose.connection.readyState === 1) {
      const video =
        await ProgressVideo.findByIdAndUpdate(
          req.params.id,
          {
            title: title.trim(),
            description: description || "",
            thumbnailUrl: thumbnailUrl || "",
            ...(orientation
              ? { orientation }
              : {}),
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!video) {
        return res.status(404).json({
          success: false,
          message: "Progress video not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: video,
      });
    }

    // Memory storage fallback
    const video = listProgressVideos().find(
      (item) => item._id === req.params.id
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Progress video not found",
      });
    }

    video.title = title.trim();
    video.description = description || "";
    video.thumbnailUrl = thumbnailUrl || "";

    if (orientation) {
      video.orientation = orientation;
    }

    return res.status(200).json({
      success: true,
      data: video,
    });
  }
);

// =========================================================
// DELETE PROGRESS VIDEO
// =========================================================

const deleteProgressVideo = asyncHandler(
  async (req, res) => {
    if (mongoose.connection.readyState === 1) {
      const video =
        await ProgressVideo.findByIdAndDelete(
          req.params.id
        );

      if (!video) {
        return res.status(404).json({
          success: false,
          message: "Progress video not found",
        });
      }

      removeUploadedMediaFile(
        video.videoUrl
      );

      return res.status(200).json({
        success: true,
        message:
          "Progress video deleted successfully",
      });
    }

    const video =
      deleteProgressVideoRecord(
        req.params.id
      );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Progress video not found",
      });
    }

    removeUploadedMediaFile(
      video.videoUrl
    );

    res.status(200).json({
      success: true,
      message:
        "Progress video deleted successfully",
    });
  }
);

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getProgressVideos,
  uploadProgressVideo,
  createProgressVideo,
  updateProgressVideo,
  deleteProgressVideo,
  upload,
};