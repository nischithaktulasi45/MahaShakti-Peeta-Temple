const express = require("express");
const router = express.Router();
const protectAdmin = require("../middleware/auth");
const { getTempleEvents, uploadTempleEventImage, createTempleEvent, updateTempleEvent, deleteTempleEvent, upload } = require("../controllers/eventController");

router.get("/", getTempleEvents);
router.post("/upload", protectAdmin, upload.single("file"), uploadTempleEventImage);
router.post("/", protectAdmin, createTempleEvent);
router.put("/:id", protectAdmin, updateTempleEvent);
router.delete("/:id", protectAdmin, deleteTempleEvent);

module.exports = router;
