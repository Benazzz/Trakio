import express from "express";
const roundsRouter = express.Router({ mergeParams: true });
import * as roundsController from "../controllers/rounds.controller.js";
import eventsRouter from "./events.routes.js";

roundsRouter.get("/", roundsController.getAllRounds);
roundsRouter.get("/:roundId", roundsController.getRound);
roundsRouter.post("/", roundsController.createRound);
roundsRouter.put("/:roundId", roundsController.updateRound);
roundsRouter.delete("/:roundId", roundsController.deleteRound);

roundsRouter.use("/:roundId/events", eventsRouter);

export default roundsRouter;
