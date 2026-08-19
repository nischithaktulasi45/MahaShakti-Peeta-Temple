const formatFieldLabel = (key) => {
  const map = {
    name: "Name",
    phone: "Phone",
    email: "Email",
    subject: "Subject",
    message: "Message",
    amount: "Amount",
    purpose: "Purpose",
    utrNumber: "UTR Number",
    paymentStatus: "Payment Status",
    address: "Address",
    service: "Service",
    event: "Event",
    enquiryType: "Enquiry Type",
  };

  if (map[key]) return map[key];

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatFieldValue = (value) => {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const shouldSkipField = (key) => {
  return [
    "__v",
    "whatsappNotificationSent",
    "whatsappNotificationSentAt",
    "whatsappMessageId",
    "updatedAt",
  ].includes(key);
};

const normalizeRecord = (data) => {
  if (data && typeof data.toObject === "function") {
    return data.toObject({ getters: true, virtuals: false });
  }

  if (data && typeof data === "object") {
    return { ...data };
  }

  return {};
};

const buildWhatsAppMessage = (record) => {
  const lines = [
    "🔔 NEW TEMPLE WEBSITE SUBMISSION",
    "━━━━━━━━━━━━━━━━━━",
  ];

  Object.entries(record).forEach(([key, value]) => {
    if (shouldSkipField(key)) return;

    if (key === "_id") {
      lines.push(`🆔 Record ID:\n${formatFieldValue(value)}`);
      return;
    }

    if (key === "createdAt") {
      const createdAt = value ? new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "";
      lines.push(`📅 Submitted:\n${createdAt}`);
      return;
    }

    const label = formatFieldLabel(key);
    const formatted = formatFieldValue(value);

    if (formatted) {
      lines.push(`• ${label}:\n${formatted}`);
    }
  });

  lines.push(
    "━━━━━━━━━━━━━━━━━━",
    "Mahashakti Peeta Temple",
    "New enquiry received from the website.",
  );

  return lines.join("\n\n");
};

const sendWhatsAppNotification = async (data) => {
  const record = normalizeRecord(data);
  if (!record || !Object.keys(record).length) {
    throw new Error("Cannot send WhatsApp notification for empty record.");
  }

  if (record.whatsappNotificationSent) {
    return {
      success: false,
      skipped: true,
      message: "WhatsApp notification already sent for this record.",
    };
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v17.0";

  if (!accessToken || !phoneNumberId || !recipientNumber) {
    throw new Error(
      "Missing WhatsApp Cloud API configuration. Please set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_RECIPIENT_NUMBER.",
    );
  }

  const messageBody = buildWhatsAppMessage(record);
  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const fetchFn = typeof fetch === "function" ? fetch : null;
  if (!fetchFn) {
    throw new Error(
      "Fetch API is not available in this Node.js runtime. Use Node 18+ or add a fetch polyfill.",
    );
  }

  const response = await fetchFn(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientNumber,
      type: "text",
      text: {
        preview_url: false,
        body: messageBody,
      },
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const apiError = responseData?.error?.message || response.statusText;
    throw new Error(`WhatsApp API error: ${apiError}`);
  }

  const messageId = responseData?.messages?.[0]?.id || null;

  return {
    success: true,
    messageId,
    responseData,
  };
};

module.exports = { sendWhatsAppNotification };
