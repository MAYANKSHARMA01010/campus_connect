const express = require("express");
const compression = require("compression");
const corsMiddleware = require("./config/cors.js");
const userRouter = require("./routes/userRoute");
const eventRouter = require("./routes/eventRoute.js");
const { prisma } = require("./config/database");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(corsMiddleware);
app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.use("/api/user", userRouter)
app.use("/api/events", eventRouter);


app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        username: true,
      },
      orderBy: { id: "desc" },
    });
    res.json({ ok: true, users });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.get('/get-all-events', async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

    const data = await prisma.eventRequest.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        date: true,
        category: true,
        location: true,
        status: true,
        images: {
          take: 1,
          orderBy: { id: "asc" },
          select: {
            id: true,
            url: true,
          },
        },
      }
    });

    return res.status(200).json({
      page,
      limit,
      data,
    });
  } 
  catch (err) {
    console.error("❌ Error fetching events:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
