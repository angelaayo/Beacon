"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createServiceSchema,
  CreateServiceInput,
} from "@/lib/validation/serviceSchema";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const NewServiceForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: { status: "OPERATIONAL" },
  });

  async function onSubmit(data: CreateServiceInput) {
    setServerError(null);
    try {
      setLoading(true);
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create service");
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-4"
    >
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          id="name"
          placeholder="Payment Service"
          data-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          placeholder="What does this service do?"
          {...register("description")}
        />
      </Field>

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Service"}
      </Button>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
    </form>
  );
};

export default NewServiceForm;
