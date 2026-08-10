import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().trim().min(1, "Description is required"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    message: "Severity is required",
  }),
  serviceId: z.string().min(1, "Service is required"),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;