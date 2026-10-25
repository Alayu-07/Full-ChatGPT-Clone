require("dotenv/config");

const express = require("express");
const cors = require("cors");

const db = require("./db/db.config");
const mainRouter = require("./src/app/main.route");

const logger = require("./src/middleware/logger");
const loggerSecond = require("./src/middleware/logger-second");
const errorHandler = require("./src/middleware/error-handler");

const app = express();

const PORT = process.env.PORT || 3777;

// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://full-chat-gpt-clone-hyra.vercel.app",
  ].join(",")
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    // Example: Postman, curl, server-to-server
    if (!origin) {
      return callback(null, true);
    }

    // Allow approved frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("Blocked by CORS:", origin);

    return callback(null, false);
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: true,
};

// CORS MUST be before API routes
app.use(cors(corsOptions));

// ======================================================
// GLOBAL MIDDLEWARE
// ======================================================

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(logger);
app.use(loggerSecond);

// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GPT Clone API is running",
  });
});

// ======================================================
// ABOUT ROUTE
// ======================================================

app.get("/about", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GPT Clone API - ChatGPT Clone Project",
  });
});

// ======================================================
// DATABASE TEST
// ======================================================

app.get("/db-test", async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT 1 AS result");

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
});

// ======================================================
// GEMINI TEST
// ======================================================

app.get("/gemini-test", async (req, res, next) => {
  try {
    const { geminiClient, geminiModel } = require("./src/utils/gemini");

    console.log("Gemini model:", geminiModel);

    const response = await geminiClient.models.generateContent({
      model: geminiModel,
      contents: "Say hello in one sentence.",
    });

    const answer =
      typeof response.text === "function" ? response.text() : response.text;

    res.status(200).json({
      success: true,
      model: geminiModel,
      answer,
    });
  } catch (error) {
    next(error);
  }
});

// ======================================================
// MAIN API ROUTES
// ======================================================

app.use("/api", mainRouter);

// ======================================================
// 404 - ROUTE NOT FOUND
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(errorHandler);

// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
  try {
    // Test database connection before starting server
    const connection = await db.getConnection();

    console.log("Database connected successfully");

    connection.release();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);

      console.log(`Local API: http://localhost:${PORT}`);

      console.log("Allowed CORS origins:", allowedOrigins);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    process.exit(1);
  }
};

startServer();
