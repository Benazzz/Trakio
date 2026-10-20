import parseId from "../utils/parseId.js";
import * as roundService from "../services/rounds.service.js";
import * as gameService from "../services/games.service.js";
import { updateRoundSchema } from "../validators/rounds.schema.js";

export const getAllRounds = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const rounds = await roundService.fetchRounds(gameId);
  res.json(rounds);
};

export const getRound = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const round = await roundService.fetchRound(gameId, roundId);
  if (!round) return res.status(404).json({ error: "Round not found" });

  res.json(round);
};

export const createRound = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  if (game.status === "finished")
    return res
      .status(422)
      .json({ error: "Cannot add a round to a finished game" });

  const createdRound = await roundService.createRound(gameId);
  res.status(201).json(createdRound);
};

export const updateRound = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const result = updateRoundSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const updatedRound = await roundService.updateRound(
    gameId,
    roundId,
    result.data,
  );
  if (!updatedRound) return res.status(404).json({ error: "Round not found" });
  res.status(200).json(updatedRound);
};

export const deleteRound = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const deletedCount = await roundService.deleteRound(gameId, roundId);
  if (deletedCount === 0)
    return res.status(404).json({ error: "Round not found" });
  res.status(204).end();
};
