require("dotenv/config");

const express = require("express");
const cors = require("cors");

const db = require("./db/db.config");
const mainRouter = require("./src/app/main.route");

<<<<<<< HEAD
const mainRouter = require("./src/app/main.route");

const logger = require("./src/middleware/logger");

const loggerSecond = require("./src/middleware/logger-second");

=======
const logger = require("./src/middleware/logger");
const loggerSecond = require("./src/middleware/logger-second");
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
const errorHandler = require("./src/middleware/error-handler");

const app = express();

const PORT = process.env.PORT || 3777;

// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = (
<<<<<<< HEAD
  process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174"
=======
  process.env.CORS_ORIGINS ||
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://full-chat-gpt-clone-hyra.vercel.app",
  ].join(",")
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

<<<<<<< HEAD
      // Disallowed origin: do not throw, simply omit the
      // CORS headers so the browser blocks the response.
      return callback(null, false);
    },
  }),
);
=======
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
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e

// ======================================================
// GLOBAL MIDDLEWARE
// ======================================================

app.disable("x-powered-by");

<<<<<<< HEAD
app.use(express.json({ limit: "1mb" }));
=======
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
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e

app.use(logger);
app.use(loggerSecond);

// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {
<<<<<<< HEAD
  res.send("GPT Clone API is running");
=======
  res.status(200).json({
    success: true,
    message: "GPT Clone API is running",
  });
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
});

// ======================================================
// ABOUT ROUTE
// ======================================================

app.get("/about", (req, res) => {
<<<<<<< HEAD
  res.send("GPT Clone API - ChatGPT Clone Project");
=======
  res.status(200).json({
    success: true,
    message: "GPT Clone API - ChatGPT Clone Project",
  });
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
});

// ======================================================
// DATABASE TEST
// ======================================================

app.get("/db-test", async (req, res, next) => {
  try {
    const [rows] = await db.execute("SELECT 1 AS result");

    res.status(200).json({
      success: true,
<<<<<<< HEAD
=======
      message: "Database connected successfully",
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
      data: rows,
    });
  } catch (error) {
    next(error);
  }
});
<<<<<<< HEAD

// ======================================================
// Gemini test
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
// API routes
// ======================================================

app.use("/api", mainRouter);

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
=======
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e

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
<<<<<<< HEAD
=======
    // Test database connection before starting server
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
    const connection = await db.getConnection();

    console.log("Database connected successfully");

    connection.release();

    app.listen(PORT, () => {
<<<<<<< HEAD
      console.log(`Server is running on http://localhost:${PORT}`);
=======
      console.log(`Server is running on port ${PORT}`);

      console.log(`Local API: http://localhost:${PORT}`);

      console.log("Allowed CORS origins:", allowedOrigins);
>>>>>>> 7071ca9c51adc486d6a0b5393902e873b1bf5b2e
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    process.exit(1);
  }
};

startServer();
