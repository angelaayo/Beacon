import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().max(500).optional(),
  status: z.enum(["OPERATIONAL", "DEGRADED", "DOWN"]),
});

export type CreateServiceInput = z.input<typeof createServiceSchema>;   // for the form itself