import { z } from "zod";

export const updateAvatarSchema = z.object({
  avatarColor: z.enum(["gray", "green", "blue", "amber", "rose"]),
});

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;