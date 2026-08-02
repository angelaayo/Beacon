import { z } from "zod";
export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    companyName: z.string().trim().optional(),
    companyCode: z.string().trim().optional(),
    isJoining: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (
      data.isJoining &&
      (!data.companyCode || data.companyCode.trim().length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Company code is required",
        path: ["companyCode"],
      });
    }
    if (
      !data.isJoining &&
      (!data.companyName || data.companyName.trim().length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Company name is required",
        path: ["companyName"],
      });
    }
  });
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
