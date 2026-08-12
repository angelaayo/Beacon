"use client";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginInput } from "@/lib/validation/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const inputStyle = "py-5 bg-background border-2 border-primary";

const LogInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: LoginInput) {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Login failed");
      }
      router.push("/dashboard");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 text-base sm:text-lg md:text-xl lg:text-2xl font-hanken font-semibold">
      <div className="flex flex-col items-center">
        <h1>Welcome Back</h1>
        <Link
          href="/signup"
          className="text-sm text-muted-foreground underline"
        >
          Don&apos;t have a Beacon profile? Sign Up
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup className="font-jetbrains">
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email" className="lg:text-sm">
                Email
              </FieldLabel>
              <Input
                {...register("email")}
                placeholder="Enter Your Email"
                type="email"
                className={cn(inputStyle, errors.email ? "border-red-500" : "")}
              />
              <FieldError className="text-sm font-bold">
                {errors.email && <p>{errors.email.message}</p>}
              </FieldError>
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password" className="lg:text-sm">
                Password
              </FieldLabel>
              <Input
                {...register("password")}
                placeholder="Enter Your Password"
                type="password"
                className={cn(
                  inputStyle,
                  errors.password ? "border-red-500" : "",
                )}
              />
              <FieldError className="text-sm font-bold">
                {errors.password && <p>{errors.password.message}</p>}
              </FieldError>
            </Field>
          </FieldGroup>
          <button
            type="submit"
            disabled={loading}
            className="border p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </FieldSet>
      </form>
      {serverError && <p className="text-destructive text-sm">{serverError}</p>}
    </div>
  );
};

export default LogInForm;
