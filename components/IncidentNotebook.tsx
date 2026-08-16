"use client";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { io, Socket } from "socket.io-client";
import { Avatar } from "@/components/Avatar";
import { verifyToken } from "@/lib/auth/jwt";

type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;

type PresenceState = {
  id: string;
  name: string;
  avatarColor: string;
  typing: boolean;
};

export default function IncidentNotebook({ incidentId, user }: { incidentId: string; user: User }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [peers, setPeers] = useState<PresenceState[]>([]);

  const ydocRef = useRef<Y.Doc | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("notes");
    const awareness = new Awareness(ydoc);
    ydocRef.current = ydoc;
    ytextRef.current = ytext;
    awarenessRef.current = awareness;

    awareness.setLocalState({ id: user.id, name: user.name, avatarColor: user.avatarColor, typing: false });

    async function init() {
      const res = await fetch(`/api/incidents/${incidentId}/notes`);
      const { content } = await res.json();
      if (content) {
        const update = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
        Y.applyUpdate(ydoc, update);
      }
      setText(ytext.toString());
      setLoading(false);
    }
    init();

    const socket = io();
    socketRef.current = socket;
    socket.emit("joinIncident", incidentId);

    socket.on("docUpdate", (update: number[]) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    socket.on("awarenessUpdate", (states: PresenceState[]) => {
      setPeers(states.filter((s) => s.id !== user.id));
    });

    function handleDocUpdate(update: Uint8Array, origin: unknown) {
      setText(ytext.toString());
      if (origin === "local") {
        socket.emit("docUpdate", { incidentId, update: Array.from(update) });
      }
    }
    ydoc.on("update", handleDocUpdate);

    function broadcastAwareness() {
      const states = Array.from(awareness.getStates().values()) as PresenceState[];
      socket.emit("awarenessUpdate", { incidentId, states });
    }
    awareness.on("change", broadcastAwareness);
    broadcastAwareness();

    const saveInterval = setInterval(async () => {
      setSaveStatus("saving");
      const state = Y.encodeStateAsUpdate(ydoc);
      const base64 = btoa(String.fromCharCode(...state));
      await fetch(`/api/incidents/${incidentId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: base64 }),
      });
      setSaveStatus("saved");
    }, 5000);

    return () => {
      ydoc.off("update", handleDocUpdate);
      awareness.off("change", broadcastAwareness);
      awareness.destroy();
      socket.emit("leaveIncident", incidentId);
      socket.disconnect();
      clearInterval(saveInterval);
      ydoc.destroy();
    };
  }, [incidentId, user.id, user.name, user.avatarColor]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const ytext = ytextRef.current;
    const ydoc = ydocRef.current;
    const awareness = awarenessRef.current;
    if (!ytext || !ydoc || !awareness) return;

    const newValue = e.target.value;
    const oldValue = ytext.toString();

    ydoc.transact(() => {
      let start = 0;
      while (start < oldValue.length && start < newValue.length && oldValue[start] === newValue[start]) start++;
      let oldEnd = oldValue.length;
      let newEnd = newValue.length;
      while (oldEnd > start && newEnd > start && oldValue[oldEnd - 1] === newValue[newEnd - 1]) {
        oldEnd--;
        newEnd--;
      }
      if (oldEnd > start) ytext.delete(start, oldEnd - start);
      if (newEnd > start) ytext.insert(start, newValue.slice(start, newEnd));
    }, "local");

    setText(newValue);

    // typing indicator: flip on, auto-flip off after a pause
    awareness.setLocalState({ id: user.id, name: user.name, avatarColor: user.avatarColor, typing: true });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      awareness.setLocalState({ id: user.id, name: user.name, avatarColor: user.avatarColor, typing: false });
    }, 1500);
  }

  const typingPeers = peers.filter((p) => p.typing);

  if (loading) return <p className="text-sm text-muted-foreground py-4">Loading notes...</p>;

  return (
    <div className="border rounded-lg bg-card flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h3 className="text-sm font-semibold">Shared Notes</h3>
          <p className="text-xs text-muted-foreground">
            {typingPeers.length > 0
              ? `${typingPeers.map((p) => p.name).join(", ")} typing...`
              : saveStatus === "saving"
                ? "Saving..."
                : "Saved"}
          </p>
        </div>
        {peers.length > 0 && (
          <div className="flex -space-x-2">
            {peers.map((p) => (
              <div key={p.id} className="ring-2 ring-card rounded-full">
                <Avatar name={p.name} color={p.avatarColor} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Shared notes for this incident — everyone sees changes live..."
        className="w-full min-h-[300px] resize-y bg-transparent p-4 text-sm font-mono focus:outline-none"
      />
    </div>
  );
}