"use client";
import { useState, SubmitEventHandler } from "react";
import { getIncident } from "@/lib/queries/incedentQueries";
import { createMessage } from "@/lib/queries/messageQueries";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type Message = Awaited<ReturnType<typeof createMessage>>;

type Props = {
  incident: Incident;
  onMessageSent: (message: Message) => void;
};

const MessageInput = ({ incident, onMessageSent }: Props) => {
  const [msgContent, setMsgContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
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

      const newMessage: Message = await res.json();
      onMessageSent(newMessage);
      setMsgContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSendMessage} className="border">
        <textarea
          placeholder="New Message"
          value={msgContent}
          onChange={(e) => setMsgContent(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
