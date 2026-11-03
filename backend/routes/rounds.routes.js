import express from "express";
import * as roundsController from "../controllers/rounds.controller.js";
import eventsRouter from "./events.routes.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
const roundsRouter = express.Router({ mergeParams: true });
roundsRouter.use(authenticate);

roundsRouter.get("/", roundsController.getAllRounds);
roundsRouter.get("/:roundId", roundsController.getRound);
roundsRouter.post("/", roundsController.createRound);
roundsRouter.put("/:roundId", roundsController.updateRound);
roundsRouter.delete("/:roundId", authorize("admin"), roundsController.deleteRound);

roundsRouter.use("/:roundId/events", eventsRouter);

export default roundsRouter;
