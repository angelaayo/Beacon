import { z } from "zod";

export const createAssignmentSchema = z.object({
  userId: z.string().min(1),
  responsibility: z.string().trim().min(1).max(200).default("Assisting with this incident"),
});

export type CreateAssignmentInput = z.input<typeof createAssignmentSchema>;