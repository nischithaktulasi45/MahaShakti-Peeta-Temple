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
  process.env.CLIENT_URL,

  // Production frontend
  "https://maha-shakti-peeta-temple-client.vercel.app",

  // Main frontend if deployed directly
  "https://maha-shakti-peeta-temple.vercel.app",

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

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without Origin
    if (!origin) {
      return callback(null, true);
    }

    // Explicitly allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel deployments
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Allow localhost / 127.0.0.1
    if (
      /^https?:\/\/(localhost|127\.0\.0\.1):(5173|5174|4173|3000|3001)$/.test(
        origin
      )
    ) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

// IMPORTANT: only ONE CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options("*", cors(corsOptions));

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

    next();
  } catch (error) {
    console.error(
      "Database middleware error:",
      error?.message || error
    );

    res.status(503).json({
      success: false,
      message:
        "Database connection unavailable. Please try again later.",
    });
  }
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