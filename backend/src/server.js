const express = require("express");
const compression = require("compression");
const corsMiddleware = require("./config/cors.js");
const userRouter = require("./routes/userRoute");
const eventRouter = require("./routes/eventRoute.js");
const { prisma } = require("./config/database");
const { sendAlert, maskDbUrl } = require("./utils/alerts");
const { runWithRequestContext } = require("./utils/requestContext");
const { startHomeSectionsScheduler } = require("./services/homeSectionsCache");
const { executeDbCall } = require("./utils/dbGuard");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

function getDbMode() {
  if (process.env.DIRECT_URL) return "DIRECT_URL";
  if (process.env.DATABASE_URL?.startsWith("prisma+postgres://")) return "ACCELERATE";
  return "DATABASE_URL";
}

async function validateStartupOrExit() {
  const missingEnv = ["SERVER_PORT", "JWT_SECRET"].filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    await sendAlert("Startup blocked: missing env", { missingEnv });
    throw new Error(`Missing required env vars: ${missingEnv.join(", ")}`);
  }

  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    await sendAlert("Startup blocked: missing DB URL", { dbMode: getDbMode() });
    throw new Error("Missing database credentials: set DIRECT_URL or DATABASE_URL");
  }

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    await sendAlert("Startup blocked: DB auth/connect failure", {
      dbMode: getDbMode(),
      dbUrl: maskDbUrl(dbUrl),
      reason: err?.message || "Database startup check failed",
    });
    throw err;
  }
}

app.use(corsMiddleware);
app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  const requestSummary = {
    endpoint: `${req.method} ${req.originalUrl}`,
    params: {
      query: req.query || {},
      body: req.body || {},
      params: req.params || {},
    },
  };

  runWithRequestContext(requestSummary, () => next());
});

app.use((req, res, next) => {
  if (req.method === "GET" && req.path.startsWith("/api/events")) {
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  }
  next();
});

app.use("/api/user", userRouter)
app.use("/api/events", eventRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "campus-connect-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/db", async (req, res) => {
  try {
    await executeDbCall("health.db", () => prisma.$queryRaw`SELECT 1`, 3000);
    return res.status(200).json({
      ok: true,
      database: "reachable",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      ok: false,
      database: "unreachable",
      reason: err?.message || "Database check failed",
      timestamp: new Date().toISOString(),
    });
  }
});


app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});


async function startServer() {
  try {
    await validateStartupOrExit();
    await startHomeSectionsScheduler(prisma);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup validation failed:", err?.message || err);
    process.exit(1);
  }
}

startServer();
