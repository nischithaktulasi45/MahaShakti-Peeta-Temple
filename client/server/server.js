const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const contactRoutes = require("./routes/contactRoutes");
const donationRoutes = require("./routes/donationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const videoRoutes = require("./routes/videoRoutes");
const eventRoutes = require("./routes/eventRoutes");

const errorHandler = require("./middleware/errorHandler");

const {
  createAdminIfNeeded,
} = require("./controllers/adminController");

const {
  seedDefaultContentIfNeeded,
} = require("./utils/storage");

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  process.env.CLIENT_URL,

  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins.
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow local development ports.
      if (
        /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|4173|3000|3001)$/.test(
          origin
        )
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    credentials: true,
  })
);

// =====================================================
// BODY PARSING
// =====================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Temple Website API is running...",
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/donations",
  donationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/gallery",
  galleryRoutes
);

app.use(
  "/api/progress-videos",
  videoRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

// =====================================================
// STATIC MEDIA
// =====================================================

app.use(
  "/images",
  express.static(
    path.join(
      __dirname,
      "..",
      "client",
      "public",
      "images"
    )
  )
);

app.use(
  "/image",
  express.static(
    path.join(
      __dirname,
      "..",
      "client",
      "public",
      "image"
    )
  )
);

app.use(
  "/progress",
  express.static(
    path.join(
      __dirname,
      "..",
      "client",
      "public",
      "progress"
    )
  )
);

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (error) {
      console.warn(
        "MongoDB unavailable, continuing with memory storage."
      );
    }
  } else {
    console.warn(
      "MONGODB_URI not set, continuing with memory storage."
    );
  }

  await createAdminIfNeeded();

  await seedDefaultContentIfNeeded();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
};

startServer();