const express = require("express");
const router = express.Router();

const protectAdmin = require("../middleware/auth");

const {
  submitContact,
  deleteContactMessage,
} = require("../controllers/contactController");

router.post("/", submitContact);

router.delete(
  "/:id",
  protectAdmin,
  deleteContactMessage
);

module.exports = router;