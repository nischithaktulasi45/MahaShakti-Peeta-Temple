const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");
const {
  createContactMessageRecord,
  listContactMessages,
  deleteContactMessageRecord,
} = require("../utils/storage");

const submitContact = asyncHandler(async (req, res) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All contact fields are required",
    });
  }

  const payload = {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
  };

  if (mongoose.connection.readyState === 1) {
    const contact = await Contact.create(payload);
    console.log(`MongoDB contact record created: ${contact._id}`);

    return res.status(201).json({
      success: true,
      message: "Contact message saved successfully",
      data: contact,
    });
  }

  const contact = createContactMessageRecord(payload);
  console.log(`Memory storage contact record created: ${contact._id}`);

  res.status(201).json({
    success: true,
    message: "Contact message saved successfully",
    data: contact,
  });
});

const getContactMessages = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: messages,
    });
  }

  const messages = listContactMessages();
  res.status(200).json({
    success: true,
    data: messages,
  });
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  }

  const contact = deleteContactMessageRecord(req.params.id);
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: "Contact message not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
  });
});

module.exports = {
  submitContact,
  getContactMessages,
  deleteContactMessage,
};