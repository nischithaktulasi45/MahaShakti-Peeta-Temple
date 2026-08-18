const express = require("express");
const router = express.Router();

const { submitDonation } = require("../controllers/donationController");

router.post("/", submitDonation);

module.exports = router;
