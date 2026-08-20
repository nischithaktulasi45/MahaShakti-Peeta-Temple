const dotenv = require("dotenv");

// =====================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

dotenv.config();

// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const cors = require("cors");
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
// EXPRESS APP
// =====================================================

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "https://maha-shakti-peeta-temple-client.vercel.app",
  "https://maha-shakti-peeta-temple-client-hi8qc4x35-nischitha.vercel.app",
  "https://maha-shakti-peeta-temple-2ssjo1qq0-nischitha.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/$/, "");

    // Allow your frontend domains
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments
    if (cleanOrigin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    console.log("CORS blocked:", origin);

    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,
};

app.use(cors(corsOptions));

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
// STATIC ASSETS (IMAGES, VIDEOS, PUBLIC FILES)
// =====================================================

const clientPublicPath = path.join(__dirname, "..", "client", "public");
app.use(express.static(clientPublicPath));
app.use("/image", express.static(path.join(clientPublicPath, "image")));
app.use("/images", express.static(path.join(clientPublicPath, "images")));
app.use("/progress", express.static(path.join(clientPublicPath, "progress")));

// =====================================================
// DATABASE INITIALIZATION
// =====================================================

let initializationPromise = null;

const initializeDatabase = async () => {
  // Prevent multiple simultaneous database connections
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Connect MongoDB
      await connectDB();

      console.log("MongoDB connected successfully.");

      // =================================================
      // CREATE / CHECK DEFAULT ADMIN
      // =================================================

      try {
        await createAdminIfNeeded();

        console.log("Admin initialization completed.");
      } catch (error) {
        console.error(
          "Admin initialization failed:",
          error?.message || error
        );
      }

      // =================================================
      // SEED DEFAULT CONTENT
      // =================================================

      try {
        await seedDefaultContentIfNeeded();

        console.log(
          "Default content initialization completed."
        );
      } catch (error) {
        console.error(
          "Default content initialization failed:",
          error?.message || error
        );
      }

      return true;
    } catch (error) {
      console.error(
        "MongoDB connection failed:",
        error?.message || error
      );

      // Allow another request to retry
      initializationPromise = null;

      throw error;
    }
  })();

  return initializationPromise;
};

// =====================================================
// ROOT / HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Temple Website API is running...",
  });
});

app.get("/health", async (req, res) => {
  try {
    await initializeDatabase();

    res.status(200).json({
      success: true,
      message: "Server is healthy",
      environment: process.env.NODE_ENV || "development",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check database error:", error);

    res.status(500).json({
      success: false,
      message: "Server is running but database is unavailable",
      environment: process.env.NODE_ENV || "development",
      database: "disconnected",
    });
  }
});

// =====================================================
// DATABASE MIDDLEWARE
// =====================================================

app.use("/api", async (req, res, next) => {
  try {
    await initializeDatabase();
  } catch (error) {
    // DB unavailable - log a warning but allow the request to continue.
    // Individual controllers will detect the disconnected state and use
    // in-memory fallback storage instead.
    console.warn(
      "MongoDB unavailable, controllers will use in-memory fallback:",
      error?.message || error
    );
  }

  next();
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/contact", contactRoutes);

app.use("/api/donations", donationRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/progress-videos", videoRoutes);

app.use("/api/events", eventRoutes);

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
// LOCAL DEVELOPMENT
// =====================================================

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);

        console.log(
          `Environment: ${
            process.env.NODE_ENV || "development"
          }`
        );
      });
    })
    .catch((error) => {
      console.error("Failed to initialize server:");
      console.error(error?.message || error);

      process.exit(1);
    });
}

// =====================================================
// VERCEL SERVERLESS EXPORT
// =====================================================

module.exports = app;