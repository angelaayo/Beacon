import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  description: z.string().trim().min(1, "Description is required"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    message: "Severity is required",
  }),
  serviceId: z.string().min(1, "Service is required"),
});


export const updateIncidentSchema = z
  .object({
    status: z
      .enum(["OPEN", "INVESTIGATING", "MITIGATING", "RESOLVED"])
      .optional(),
    severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  })
  .refine((data) => data.status || data.severity, {
    message: "Must provide a status or severity to update",
  });

export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>;
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
