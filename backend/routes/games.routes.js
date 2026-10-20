import express from "express";
import * as gamesController from "../controllers/games.controller.js";
import roundsRouter from "./rounds.routes.js";
const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.get("/:id", gamesController.getGame);
gamesRouter.post("/", gamesController.createGame);
gamesRouter.put("/:id", gamesController.updateGame);
gamesRouter.delete("/:id", gamesController.deleteGame);

gamesRouter.use("/:gameId/rounds", roundsRouter);

export default gamesRouter;
