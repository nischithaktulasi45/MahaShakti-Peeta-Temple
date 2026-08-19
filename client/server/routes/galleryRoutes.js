const express = require("express");

const router = express.Router();

const {
  getGalleryPhotos,
  uploadGalleryImage,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  upload,
} = require("../controllers/galleryController");

const  protectAdmin  = require("../middleware/auth");

router.get("/", getGalleryPhotos);

router.post(
  "/upload",
  protectAdmin,
  upload.single("file"),
  uploadGalleryImage
);

router.post(
  "/",
  protectAdmin,
  createGalleryPhoto
);

router.put(
  "/:id",
  protectAdmin,
  updateGalleryPhoto
);

router.delete(
  "/:id",
  protectAdmin,
  deleteGalleryPhoto
);

module.exports = router;