"use client";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema, SignupInput } from "@/lib/validation/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
const inputStyle = "py-5 bg-[#FFFFFF] border-2 border-[#657D6A]";
const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: SignupInput) {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "applications/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Signup failed");
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
    <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-hanken font-semibold">
      <h1 className="text-center">Create Your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup className="font-jetbrains">
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email" className="lg:text-sm">Work Email</FieldLabel>
              <Input
                {...register("email")}
                placeholder="Enter Your Email"
                type="email"
                className={cn(inputStyle, errors.email ? "border-red-500" : "")}
              ></Input>
              <FieldError className="text-sm font-bold">
                {errors.email && <p>{errors.email.message}</p>}
              </FieldError>
            </Field>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name"  className="lg:text-sm">Full Name</FieldLabel>
              <Input
                {...register("name")}
                placeholder="Enter A Display Name"
                type="text"
                className={cn(inputStyle, errors.name ? "border-red-500" : "")}
              ></Input>
              <FieldError className="text-sm font-bold">
                {errors.name && <p>{errors.name.message}</p>}
              </FieldError>
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password" className="flex justify-between lg:text-sm">
                <span>Password</span>
                <span>Min-8-Characters</span>
              </FieldLabel>
              <Input
                {...register("password")}
                placeholder="Enter A Password"
                type="password"
                className={cn(
                  inputStyle,
                  errors.password ? "border-red-500" : "",
                )}
              ></Input>
              <FieldError className="text-sm font-bold">
                {errors.password && <p>{errors.password.message}</p>}
              </FieldError>
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword" className="lg:text-sm">
                Re-Enter Password
              </FieldLabel>
              <Input
                {...register("confirmPassword")}
                placeholder="Re-Enter Your Password"
                type="password"
                className={cn(
                  inputStyle,
                  errors.confirmPassword ? "border-red-500" : "",
                )}
              ></Input>
              <FieldError className="text-sm font-bold">
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
              </FieldError>
            </Field>
          </FieldGroup>
          <button
            type="submit"
            disabled={loading}
            className="border p-2 rounded-md bg-[#1A3021] text-white"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </FieldSet>
      </form>
      {serverError && <p className="text-red-500">{serverError}</p>}
    </div>
  );
};

export default SignUpForm;
