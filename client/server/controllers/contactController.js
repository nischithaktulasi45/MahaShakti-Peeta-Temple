const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");

const submitContact = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    subject,
    message,
  } = req.body;

  if (
    !name ||
    !phone ||
    !email ||
    !subject ||
    !message
  ) {
    return res.status(400).json({
      success: false,
      message: "All contact fields are required",
    });
  }

  const contact = await Contact.create({
    name,
    phone,
    email,
    subject,
    message,
  });

  console.log(
    `MongoDB contact record created: ${contact._id}`
  );

  res.status(201).json({
    success: true,
    message: "Contact message saved successfully",
    data: contact,
  });
});

const getContactMessages = asyncHandler(
  async (req, res) => {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  }
);

const deleteContactMessage = asyncHandler(
  async (req, res) => {
    const contact =
      await Contact.findByIdAndDelete(req.params.id);

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
  }
);

module.exports = {
  submitContact,
  getContactMessages,
  deleteContactMessage,
};