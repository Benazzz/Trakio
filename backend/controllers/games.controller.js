import * as gameService from "../services/games.service.js";
import parseId from "../utils/parseId.js";
import {
  createGameSchema,
  updateGameSchema,
} from "../validators/game.schema.js";

export const getAllGames = async (req, res) => {
  const games = await gameService.fetchGames();
  res.json(games);
};

export const getGame = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid game id" });
  const game = await gameService.fetchGame(id);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
};

export const createGame = async (req, res) => {
  const result = createGameSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });
  const createdGame = await gameService.createGame(result.data);
  res.status(201).json(createdGame);
};

export const updateGame = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid game id" });
  const result = updateGameSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });
  const updatedGame = await gameService.updateGame(id, result.data);
  if (!updatedGame) return res.status(404).json({ error: "Game not found" });
  res.status(200).json(updatedGame);
};

export const deleteGame = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid game id" });
  const deletedCount = await gameService.deleteGame(id);
  if (deletedCount === 0)
    return res.status(404).json({ error: "Game not found" });
  res.status(204).end();
};
