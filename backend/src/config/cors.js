const cors = require("cors");

// Define allowed origins. Prefer configuration via environment variable:
// CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

module.exports = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., same-origin, curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0) {
      // If no origins are configured, deny cross-origin requests by default
      return callback(new Error("CORS: Origin not allowed"), false);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS: Origin not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
