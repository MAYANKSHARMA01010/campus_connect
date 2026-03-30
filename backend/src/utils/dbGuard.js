const { sendAlert } = require("./alerts");

const DB_CALL_TIMEOUT_MS = Math.max(Number(process.env.DB_CALL_TIMEOUT_MS) || 7000, 1000);
const DB_BREAKER_FAILURE_THRESHOLD = Math.max(Number(process.env.DB_BREAKER_FAILURE_THRESHOLD) || 5, 2);
const DB_BREAKER_COOLDOWN_MS = Math.max(Number(process.env.DB_BREAKER_COOLDOWN_MS) || 30000, 5000);

const breakerState = {
  consecutiveFailures: 0,
  openedAt: null,
};

function createDbGuardError(message, code, statusCode, extra = {}) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  Object.assign(error, extra);
  return error;
}

function isCircuitOpen() {
  if (!breakerState.openedAt) return false;
  const elapsed = Date.now() - breakerState.openedAt;
  if (elapsed >= DB_BREAKER_COOLDOWN_MS) {
    breakerState.openedAt = null;
    breakerState.consecutiveFailures = 0;
    return false;
  }
  return true;
}

function shouldCountFailure(error) {
  const code = String(error?.code || "");
  if (/^P20\d{2}$/.test(code)) return false;
  return true;
}

async function onFailure(error, operation) {
  if (!shouldCountFailure(error)) return;

  breakerState.consecutiveFailures += 1;
  if (breakerState.consecutiveFailures < DB_BREAKER_FAILURE_THRESHOLD) return;
  if (breakerState.openedAt) return;

  breakerState.openedAt = Date.now();
  await sendAlert("DB circuit breaker opened", {
    operation,
    consecutiveFailures: breakerState.consecutiveFailures,
    cooldownMs: DB_BREAKER_COOLDOWN_MS,
    reason: error?.message || "Unknown DB failure",
  });
}

function onSuccess() {
  breakerState.consecutiveFailures = 0;
  breakerState.openedAt = null;
}

function timeoutPromise(operation, timeoutMs) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        createDbGuardError(
          `DB call timed out for ${operation} after ${timeoutMs}ms`,
          "DB_TIMEOUT",
          504,
          { operation }
        )
      );
    }, timeoutMs);
  });
}

async function executeDbCall(operation, queryFn, timeoutMs = DB_CALL_TIMEOUT_MS) {
  if (isCircuitOpen()) {
    throw createDbGuardError(
      "DB circuit breaker is open. Requests are temporarily blocked.",
      "DB_CIRCUIT_OPEN",
      503,
      { operation }
    );
  }

  try {
    const result = await Promise.race([
      Promise.resolve().then(() => queryFn()),
      timeoutPromise(operation, timeoutMs),
    ]);
    onSuccess();
    return result;
  } catch (error) {
    await onFailure(error, operation);

    if (error?.code === "DB_TIMEOUT") {
      throw error;
    }

    const prismaCode = String(error?.code || "");
    if (/^P10\d{2}$/.test(prismaCode)) {
      throw createDbGuardError(error.message || "Database unavailable", "DB_UNAVAILABLE", 503, {
        operation,
        cause: error,
      });
    }

    throw error;
  }
}

function isDbGuardError(error) {
  return Boolean(error?.code === "DB_TIMEOUT" || error?.code === "DB_CIRCUIT_OPEN" || error?.code === "DB_UNAVAILABLE");
}

module.exports = {
  executeDbCall,
  isDbGuardError,
};