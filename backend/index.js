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


app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ ok: true, users });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.get('/get-all-events', async (req, res) => {
  try {
    const data = await prisma.eventRequest.findMany({
      include: {
        images: true
      }
    });

    return res.status(200).json(data);
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
