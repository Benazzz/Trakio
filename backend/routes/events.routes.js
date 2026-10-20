import express from "express";
const eventsRouter = express.Router({ mergeParams: true });
import * as eventsController from "../controllers/events.controller.js";

eventsRouter.get("/", eventsController.getAllEvents);
eventsRouter.get("/:eventId", eventsController.getEvent);
eventsRouter.post("/", eventsController.createEvent);
eventsRouter.put("/:eventId", eventsController.updateEvent);
eventsRouter.delete("/:eventId", eventsController.deleteEvent);

export default eventsRouter;
