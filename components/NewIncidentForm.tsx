"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createIncidentSchema,
  CreateIncidentInput,
} from "@/lib/validation/incidentSchema";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import IncidentActivity from "./IncidentActivity";

type Service = { id: string; name: string; status: string };

const SEVERITY_OPTIONS = [
  { value: "CRITICAL", label: "Critical", swatch: "bg-severity-critical" },
  { value: "HIGH", label: "High", swatch: "bg-severity-high" },
  { value: "MEDIUM", label: "Medium", swatch: "bg-severity-medium" },
  { value: "LOW", label: "Low", swatch: "bg-severity-low" },
] as const;

const NewIncidentForm = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateIncidentInput>({
    resolver: zodResolver(createIncidentSchema),
  });

  const severity = watch("severity");
  const serviceId = watch("serviceId");

  async function onSubmit(data: CreateIncidentInput) {
    setServerError(null);
    try {
      setLoading(true);
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "applications/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create incident");
      }
      const incident = await res.json();
      router.push(`/incidents/${incident.id}`);
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
      className="flex flex-col gap-5 max-w-xl"
    >
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          placeholder="Database connection pool exhausted"
          data-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          placeholder="What's happening, what you've observed so far..."
          rows={4}
          data-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </Field>

      <Field>
        <FieldLabel>Service</FieldLabel>
        <Select
          value={serviceId}
          onValueChange={(v) => setValue("serviceId", v)}
        >
          <SelectTrigger data-invalid={!!errors.serviceId}>
            <SelectValue placeholder="Select the affected service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceId && (
          <p className="text-sm text-destructive">{errors.serviceId.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel>Severity</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("severity", opt.value)}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                severity === opt.value
                  ? "border-foreground bg-muted"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span className={cn("size-2 rounded-full", opt.swatch)} />
              {opt.label}
            </button>
          ))}
        </div>
        {errors.severity && (
          <p className="text-sm text-destructive">{errors.severity.message}</p>
        )}
      </Field>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Incident"}
      </Button>
    </form>
  );
};

export default NewIncidentForm;
