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

eventRouter.post("/request", authenticate, createEventRequestController);
eventRouter.get("/requests", authenticate, isAdmin, getEventRequestsController);
eventRouter.patch("/approve/:id", authenticate, isAdmin, approveEventController);
eventRouter.get("/", getAllEventsController);

module.exports = eventRouter;
