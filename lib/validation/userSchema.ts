// lib/validation/userSchema.ts
import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100).optional(),
    avatarColor: z.enum(["gray", "green", "blue", "amber", "rose"]).optional(),
  })
  .refine((data) => data.name || data.avatarColor, {
    message: "Must provide a name or avatarColor to update",
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;