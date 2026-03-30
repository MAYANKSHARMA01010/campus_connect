const express = require("express");
const eventRouter = express.Router();
const rateLimit = require("express-rate-limit");

const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  getAllEventsForHomeSecreenController,
  searchEventsController,
  getAdminEventsController,
  updateEventStatusController,
  deleteEventController,
  getMyEventsController,
  deleteMyEventController,
} = require("../controllers/eventController");

const { authenticate } = require("../utils/auth");
const { isAdmin } = require("../middlewares/adminMiddleware");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

/* ================= ADMIN ROUTES ================= */
eventRouter.get("/admin", apiLimiter, authenticate, isAdmin, getAdminEventsController);
eventRouter.patch("/admin/:id/status", apiLimiter, authenticate, isAdmin, updateEventStatusController);
eventRouter.delete("/admin/:id", apiLimiter, authenticate, isAdmin, deleteEventController);

/* ================= USER ROUTES ================= */
eventRouter.get("/me", apiLimiter, authenticate, getMyEventsController);
eventRouter.delete("/me/:id", apiLimiter, authenticate, deleteMyEventController);

/* ================= PUBLIC ROUTES ================= */
eventRouter.post("/request", apiLimiter, authenticate, createEventController);
eventRouter.get("/search", apiLimiter, searchEventsController);
eventRouter.get("/home", apiLimiter, getAllEventsForHomeSecreenController);
eventRouter.get("/", apiLimiter, getAllEventsController);

/* ================= SINGLE EVENT (KEEP LAST) ================= */
eventRouter.get("/:id", apiLimiter, getEventByIdController);

module.exports = eventRouter;
