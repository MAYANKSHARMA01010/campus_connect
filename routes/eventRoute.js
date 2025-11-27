const express = require("express");
const eventRouter = express.Router();

const {
    authenticate
} = require("../utils/auth");

const {
    createEventController,
    getAllEventsController,
    getEventByIdController,
    getAllEventsForHomeSecreenController,
} = require("../controllers/eventController");


eventRouter.post("/request", authenticate, createEventController);
eventRouter.get("/", getAllEventsController);
eventRouter.get("/home", getAllEventsForHomeSecreenController)
eventRouter.get("/:id", getEventByIdController);

module.exports = eventRouter;
