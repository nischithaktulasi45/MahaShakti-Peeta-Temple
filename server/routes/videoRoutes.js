const express = require("express");
const router = express.Router();
const protectAdmin = require("../middleware/auth");
const {
  getProgressVideos,
  uploadProgressVideo,
  createProgressVideo,
  updateProgressVideo,
  deleteProgressVideo,
  upload,
} = require("../controllers/videoController");

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
