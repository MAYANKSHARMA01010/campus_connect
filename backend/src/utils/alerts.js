function maskDbUrl(url = "") {
  if (!url || typeof url !== "string") return "<missing>";
  return url.replace(/:\/\/([^:@/]+):([^@/]+)@/, "://$1:****@");
}

async function sendAlert(title, details = {}) {
  const payload = {
    title,
    service: "campus-connect-backend",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    ...details,
  };

  console.error("[ALERT]", JSON.stringify(payload));

  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[ALERT_WEBHOOK_FAILED]", err?.message || err);
  }
}

module.exports = {
  sendAlert,
  maskDbUrl,
};