import { z } from "zod";

export const createEventSchema = z.object({
  template_id: z.int().positive(),
  created_by: z.int().positive(),
});

export const updateEventSchema = z.object({
  status: z.enum(["pending", "answered", "completed"]),
  answer: z.string().trim().min(1).max(500).nullable(),
  resolved_by: z.int().positive().nullable(),
  resolved_at: z.iso.datetime().nullable(),
});
