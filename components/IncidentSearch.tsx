"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function IncidentSearch({
  placeholderText,
  compact = false,
}: {
  placeholderText: string;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <ButtonGroup>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            className={compact ? "py-2" : "py-4"}
          />
          <Button
            type="submit"
            variant="outline"
            className={compact ? "py-2" : "py-4"}
          >
            Search
          </Button>
        </ButtonGroup>
      </Field>
    </form>
  );
}
