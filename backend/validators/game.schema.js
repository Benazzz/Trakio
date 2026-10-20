import { z } from "zod";

export const createGameSchema = z.object({
  name: z.string().trim().min(1).max(100),
  created_by: z.int().positive(),
  zone_id: z.int().positive(),
  is_public: z.boolean().default(false),
  max_players: z.int().min(2).max(20),
  head_start_min: z.int().positive(),
});

export const updateGameSchema = z.object({
  name: z.string().trim().min(1).max(100),
  is_public: z.boolean(),
  is_locked: z.boolean(),
  max_players: z.int().min(2).max(20),
  head_start_min: z.int().positive(),
});
