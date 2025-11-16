const express = require("express");
const eventRouter = express.Router();

const {
  createEventRequestController,
  getEventRequestsController,
  approveEventController,
  getAllEventsController,
} = require("../controllers/eventController");

const { authenticate } = require("../utils/auth");
const { isAdmin } = require("../middlewares/roleMiddleware");

// Create event request (auth required)
eventRouter.post("/request", authenticate, createEventRequestController);

// Get all pending requests (admin only)
eventRouter.get("/requests", authenticate, isAdmin, getEventRequestsController);

// Approve request (admin only)
eventRouter.patch("/approve/:id", authenticate, isAdmin, approveEventController);

// Public list of events
eventRouter.get("/", getAllEventsController);

module.exports = eventRouter;
