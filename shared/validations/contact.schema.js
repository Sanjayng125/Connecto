import { z } from "zod";

export const respondToContactRequestSchema = z.object({
  action: z.enum(["accepted", "blocked"]),
});

export const updateContactSchema = z.object({
  nickname: z.string().min(1).max(50),
  isFavorite: z.boolean().optional(),
});
