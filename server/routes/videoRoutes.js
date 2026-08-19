const express = require("express");
const router = express.Router();
const protectAdmin = require("../middleware/auth");
const {
  getProgressVideos,
  uploadProgressVideo,
  createProgressVideo,
  updateProgressVideo,
  deleteProgressVideo,
} = require("../controllers/videoController");
const { upload } = require("../controllers/galleryController");

router.get("/", getProgressVideos);
router.post("/upload", protectAdmin, upload.single("file"), uploadProgressVideo);
router.post("/", protectAdmin, createProgressVideo);
router.put(
  "/:id",
  protectAdmin,
  updateProgressVideo
);
router.delete("/:id", protectAdmin, deleteProgressVideo);

module.exports = router;
