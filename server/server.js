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

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();

// =====================================================
// EXPRESS APP
// =====================================================

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
  "http://localhost:4173",
  "http://localhost:3000",
  "http://localhost:3001",

  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header.
      // Example: server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins.
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow local development.
      if (
        /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|4173|3000|3001)$/.test(
          origin
        )
      ) {
        return callback(null, true);
      }

      console.warn(`CORS blocked for origin: ${origin}`);

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

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// ROOT / HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Temple Website API is running...",
  });
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    environment: process.env.NODE_ENV || "development",
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

// Client images
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

// Client image folder
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

// Progress videos
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
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// DATABASE / INITIALIZATION
// =====================================================

const initializeServer = async () => {
  // Connect to MongoDB if configured.
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();

      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.warn(
        "MongoDB unavailable, continuing with memory storage."
      );

      console.warn(
        error?.message || error
      );
    }
  } else {
    console.warn(
      "MONGODB_URI not set, continuing with memory storage."
    );
  }

  // Create default admin if needed.
  try {
    await createAdminIfNeeded();
  } catch (error) {
    console.warn(
      "Could not create/check default admin."
    );

    console.warn(
      error?.message || error
    );
  }

  // Seed default content if needed.
  try {
    await seedDefaultContentIfNeeded();
  } catch (error) {
    console.warn(
      "Could not seed default content."
    );

    console.warn(
      error?.message || error
    );
  }
};

// =====================================================
// LOCAL DEVELOPMENT SERVER
// =====================================================

// When running:
// npm start
//
// Node starts the normal Express server.
//
// When Vercel imports this file:
// server/api/index.js
//
// require.main !== module,
// so app.listen() will NOT execute.

if (require.main === module) {
  initializeServer()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `Server running on port ${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error(
        "Failed to initialize server:"
      );

      console.error(error);

      process.exit(1);
    });
}

// =====================================================
// VERCEL SERVERLESS EXPORT
// =====================================================

module.exports = app;