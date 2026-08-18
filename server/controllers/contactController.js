const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");
const { sendWhatsAppNotification } = require("../services/whatsappService");

const submitContact = asyncHandler(async (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All contact fields are required" });
  }

  const contact = await Contact.create({ name, phone, email, subject, message });
  console.log(`MongoDB record created: ${contact._id}`);

  let whatsappNotification = "pending";

  try {
    const result = await sendWhatsAppNotification(contact);

    if (result.success && !result.skipped) {
      contact.whatsappNotificationSent = true;
      contact.whatsappNotificationSentAt = new Date();
      contact.whatsappMessageId = result.messageId || undefined;
      await contact.save();
      whatsappNotification = "sent";
      console.log(`WhatsApp notification sent successfully: ${contact._id}`);
    } else if (result.skipped) {
      whatsappNotification = "skipped";
      console.log(`WhatsApp notification skipped for record: ${contact._id}`);
    } else {
      whatsappNotification = "failed";
      console.log(`WhatsApp notification not sent for record: ${contact._id}`);
    }
  } catch (error) {
    whatsappNotification = "failed";
    console.error(`WhatsApp notification failed: ${error.message}`);
  }

  res.status(201).json({
    success: true,
    message: "Contact message saved successfully",
    data: contact,
    whatsappNotification,
  });
});
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: messages,
  });
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

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
