require("dotenv").config();
const { sendAlert } = require("../utils/alerts");

const DEFAULT_BASE_URL = (process.env.BACKEND_SERVER_URL || process.env.BACKEND_LOCAL_URL || "http://localhost:5001").replace(/\/+$/, "");
const MONITOR_BASE_URL = (process.env.MONITOR_TARGET_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
const CHECK_INTERVAL_MS = Math.max(Number(process.env.HEALTH_CHECK_INTERVAL_MS) || 30000, 15000);
const CHECK_TIMEOUT_MS = Math.max(Number(process.env.HEALTH_CHECK_TIMEOUT_MS) || 5000, 1000);

const ENDPOINTS = ["/health", "/health/db"];

function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

async function checkEndpoint(path) {
  const startedAt = Date.now();
  const url = `${MONITOR_BASE_URL}${path}`;

  try {
    const response = await fetchWithTimeout(url, CHECK_TIMEOUT_MS);
    const latencyMs = Date.now() - startedAt;

    if (!response.ok) {
      await sendAlert("Health monitor: endpoint failure", {
        url,
        status: response.status,
        latencyMs,
      });
      return;
    }

    if (latencyMs > CHECK_TIMEOUT_MS) {
      await sendAlert("Health monitor: slow health check", {
        url,
        latencyMs,
        timeoutMs: CHECK_TIMEOUT_MS,
      });
    }
  } catch (err) {
    await sendAlert("Health monitor: request error", {
      url,
      reason: err?.message || "Unknown monitor error",
      timeoutMs: CHECK_TIMEOUT_MS,
    });
  }
}

async function runOnce() {
  await Promise.all(ENDPOINTS.map((path) => checkEndpoint(path)));
}

async function startMonitor() {
  await runOnce();

  setInterval(() => {
    runOnce().catch((err) => {
      console.error("[monitor] unexpected run failure", err?.message || err);
    });
  }, CHECK_INTERVAL_MS);
}

startMonitor().catch(async (err) => {
  await sendAlert("Health monitor: crashed", {
    reason: err?.message || "Monitor crashed",
  });
  process.exit(1);
});