import * as eventService from "../services/events.service.js";
import * as roundService from "../services/rounds.service.js";
import * as gameService from "../services/games.service.js";
import parseId from "../utils/parseId.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../validators/event.shema.js";
import { withEventLinks } from "../utils/links.js";

export const getAllEvents = async (req, res) => {
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

  const events = await eventService.fetchEvents(roundId);
  res.json(events.map((e) => withEventLinks(e, gameId)));
};

export const getEvent = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const eventId = parseId(req.params.eventId);
  if (eventId === null)
    return res.status(400).json({ error: "Invalid event id" });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const round = await roundService.fetchRound(gameId, roundId);
  if (!round) return res.status(404).json({ error: "Round not found" });

  const event = await eventService.fetchEvent(roundId, eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  res.json(withEventLinks(event, gameId));
};

export const createEvent = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const result = createEventSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const round = await roundService.fetchRound(gameId, roundId);
  if (!round) return res.status(404).json({ error: "Round not found" });

  if (round.status !== "active")
    return res
      .status(422)
      .json({ error: "Events can only be added to an active round" });

  const createdEvent = await eventService.createEvent(roundId, result.data);
  res.status(201).json(withEventLinks(createdEvent, gameId));
};

export const updateEvent = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const eventId = parseId(req.params.eventId);
  if (eventId === null)
    return res.status(400).json({ error: "Invalid event id" });

  const result = updateEventSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const round = await roundService.fetchRound(gameId, roundId);
  if (!round) return res.status(404).json({ error: "Round not found" });

  const updatedEvent = await eventService.updateEvent(
    roundId,
    eventId,
    result.data,
  );
  if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

  res.json(withEventLinks(updatedEvent, gameId));
};

export const deleteEvent = async (req, res) => {
  const gameId = parseId(req.params.gameId);
  if (gameId === null)
    return res.status(400).json({ error: "Invalid game id" });

  const roundId = parseId(req.params.roundId);
  if (roundId === null)
    return res.status(400).json({ error: "Invalid round id" });

  const eventId = parseId(req.params.eventId);
  if (eventId === null)
    return res.status(400).json({ error: "Invalid event id" });

  const game = await gameService.fetchGame(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const round = await roundService.fetchRound(gameId, roundId);
  if (!round) return res.status(404).json({ error: "Round not found" });

  const deletedCount = await eventService.deleteEvent(roundId, eventId);
  if (deletedCount === 0)
    return res.status(404).json({ error: "Event not found" });

  res.status(204).end();
};
