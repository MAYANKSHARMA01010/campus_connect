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
} = require("../controllers/eventController");
const { authenticate } = require("../utils/auth");
const { isAdmin } = require("../middlewares/adminMiddleware");

eventRouter.get("/admin", authenticate, isAdmin, getAdminEventsController);
eventRouter.patch("/admin/:id/status", authenticate, isAdmin, updateEventStatusController);
eventRouter.delete("/admin/:id", authenticate, isAdmin, deleteEventController);

eventRouter.post("/request", authenticate, createEventController);
eventRouter.get("/search", searchEventsController);
eventRouter.get("/home", getAllEventsForHomeSecreenController);
eventRouter.get("/", getAllEventsController);
eventRouter.get("/:id", getEventByIdController);

module.exports = eventRouter;
