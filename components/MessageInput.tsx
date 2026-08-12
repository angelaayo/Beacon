"use client";
import { useState } from "react";
import type { SubmitEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { getIncident } from "@/lib/queries/incedentQueries";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;

const MessageInput = ({ incident }: { incident: Incident }) => {
  const [msgContent, setMsgContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!msgContent.trim()) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/incidents/${incident.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: msgContent }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to send message");
      }
      setMsgContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
      <div className="flex gap-2 items-end">
        <textarea
          placeholder="Send a message..."
          value={msgContent}
          onChange={(e) => setMsgContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={loading || !msgContent.trim()} size="sm">
          {loading ? "..." : "Send"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
};

export default MessageInput;