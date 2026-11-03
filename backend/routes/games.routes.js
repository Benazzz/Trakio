import express from "express";
import * as gamesController from "../controllers/games.controller.js";
import roundsRouter from "./rounds.routes.js";
import authenticate from "../middleware/authenticate.js";
const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.get("/:id", authenticate, gamesController.getGame);
gamesRouter.post("/", authenticate, gamesController.createGame);
gamesRouter.put("/:id", authenticate, gamesController.updateGame);
gamesRouter.delete("/:id", authenticate, gamesController.deleteGame);

gamesRouter.use("/:gameId/rounds", roundsRouter);

export default gamesRouter;
