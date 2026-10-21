import * as gameService from "../services/games.service.js";
import { withGameLinks } from "../utils/links.js";
import parseId from "../utils/parseId.js";
import {
  createGameSchema,
  updateGameSchema,
} from "../validators/game.schema.js";

const GAME_STATUSES = ["lobby", "active", "finished"];

export const getAllGames = async (req, res) => {
  const page = parseId(req.query.page ?? "1");
  const limit = parseId(req.query.limit ?? "10");

  if (page === null || limit === null || limit > 50)
    return res
      .status(400)
      .json({ error: "page and limit must be positive integers, limit ≤ 50" });

  const status = req.query.status ?? null;
  if (status !== null && !GAME_STATUSES.includes(status))
    return res
      .status(400)
      .json({ error: "status must be one of: lobby, active, finished" });

  let isPublic = null;
  if (req.query.is_public === "true") isPublic = true;
  else if (req.query.is_public === "false") isPublic = false;
  else if (req.query.is_public !== undefined)
    return res.status(400).json({ error: "is_public must be true or false" });

  const offset = (page - 1) * limit;
  const { items, total } = await gameService.fetchGames(
    limit,
    offset,
    status,
    isPublic,
  );

  res.json({ data: items.map(withGameLinks), page, limit, total });
};

export const getGame = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid game id" });
  const game = await gameService.fetchGameDetails(id);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(withGameLinks(game));
};

export const createGame = async (req, res) => {
  const result = createGameSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });
  const createdGame = await gameService.createGame(result.data);
  res.status(201).json(withGameLinks(createdGame));
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
  res.status(200).json(withGameLinks(updatedGame));
};

export const deleteGame = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid game id" });
  const deletedCount = await gameService.deleteGame(id);
  if (deletedCount === 0)
    return res.status(404).json({ error: "Game not found" });
  res.status(204).end();
};
