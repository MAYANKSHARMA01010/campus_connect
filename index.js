const express = require("express");
const corsMiddleware = require("./config/cors.js");
const userRouter = require("./routes/userRoute");
const eventRouter = require("./routes/eventRoute.js");
const { prisma } = require("./config/database");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(corsMiddleware);
app.use(express.json());

app.use("/api/user", userRouter)
app.use("/api/events", eventRouter);

// DB testing Route
app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ ok: true, users });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Backend test Route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
