import { z } from "zod";

export const updateRoundSchema = z.object({
  status: z.enum(["pending", "active", "finished"]),
  started_at: z.iso.datetime().nullable(),
  ended_at:  z.iso.datetime().nullable(),
  found_by: z.int().positive().nullable()
});
