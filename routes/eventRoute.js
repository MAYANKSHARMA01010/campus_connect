const express = require("express");
const eventRouter = express.Router();

const { authenticate } = require("../utils/auth");
const {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  getAllEventsForHomeSecreenController,
  searchEventsController,
} = require("../controllers/eventController");

eventRouter.post("/request", authenticate, createEventController);
eventRouter.get("/search", searchEventsController);
eventRouter.get("/home", getAllEventsForHomeSecreenController);
eventRouter.get("/", getAllEventsController);
eventRouter.get("/:id", getEventByIdController);

module.exports = eventRouter;
