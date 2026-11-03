import express from "express";
import * as eventsController from "../controllers/events.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
const eventsRouter = express.Router({ mergeParams: true });
eventsRouter.use(authenticate);

eventsRouter.get("/", eventsController.getAllEvents);
eventsRouter.get("/:eventId", eventsController.getEvent);
eventsRouter.post("/", eventsController.createEvent);
eventsRouter.put("/:eventId", eventsController.updateEvent);
eventsRouter.delete("/:eventId", authorize("admin"), eventsController.deleteEvent);

export default eventsRouter;
