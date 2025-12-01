const express = require("express");
const eventRouter = express.Router();

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

/* ================= ADMIN ROUTES ================= */
eventRouter.get("/admin", authenticate, isAdmin, getAdminEventsController);
eventRouter.patch("/admin/:id/status", authenticate, isAdmin, updateEventStatusController);
eventRouter.delete("/admin/:id", authenticate, isAdmin, deleteEventController);

/* ================= USER ROUTES ================= */
eventRouter.get("/me", authenticate, getMyEventsController);
eventRouter.delete("/me/:id", authenticate, deleteMyEventController);

/* ================= PUBLIC ROUTES ================= */
eventRouter.post("/request", authenticate, createEventController);
eventRouter.get("/search", searchEventsController);
eventRouter.get("/home", getAllEventsForHomeSecreenController);
eventRouter.get("/", getAllEventsController);

/* ================= SINGLE EVENT (KEEP LAST) ================= */
eventRouter.get("/:id", getEventByIdController);

module.exports = eventRouter;
