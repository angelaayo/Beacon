"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { io, Socket } from "socket.io-client";

export default function IncidentNotebook({
  incidentId,
}: {
  incidentId: string;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const ydocRef = useRef<Y.Doc | null>(null);
  const ytextRef = useRef<Y.Text | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const applyingRemoteRef = useRef(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("notes");
    ydocRef.current = ydoc;
    ytextRef.current = ytext;

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
      applyingRemoteRef.current = true;
      Y.applyUpdate(ydoc, new Uint8Array(update));
      applyingRemoteRef.current = false;
    });

    function handleDocUpdate(update: Uint8Array, origin: unknown) {
      setText(ytext.toString());
      if (origin === "local") {
        socket.emit("docUpdate", { incidentId, update: Array.from(update) });
      }
    }
    ydoc.on("update", handleDocUpdate);

    const saveInterval = setInterval(async () => {
      const state = Y.encodeStateAsUpdate(ydoc);
      const base64 = btoa(String.fromCharCode(...state));
      await fetch(`/api/incidents/${incidentId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "applications/json" },
        body: JSON.stringify({ content: base64 }),
      });
    }, 5000);
    return () => {
      ydoc.off("update", handleDocUpdate);
      socket.emit("leaveIncident", incidentId);
      socket.disconnect();
      clearInterval(saveInterval);
      ydoc.destroy();
    };
  }, [incidentId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const ytext = ytextRef.current;
    const ydoc = ydocRef.current;
    if (!ytext || !ydoc) return;

    const newValue = e.target.value;
    const oldValue = ytext.toString();

    ydoc.transact(() => {
      let start = 0;
      while (
        start < oldValue.length &&
        start < newValue.length &&
        oldValue[start] === newValue[start]
      ) {
        start++;
      }
      let oldEnd = oldValue.length;
      let newEnd = newValue.length;
      while (
        oldEnd > start &&
        newEnd > start &&
        oldValue[oldEnd - 1] === newValue[newEnd - 1]
      ) {
        oldEnd--;
        newEnd--;
      }
      if (oldEnd > start) ytext.delete(start, oldEnd - start);
      if (newEnd > start) ytext.insert(start, newValue.slice(start, newEnd));
    }, "local");
    setText(newValue);
  }
  if (loading)
    return (
      <p className="text-sm text-muted-foreground py-4">Loading notes...</p>
    );

  return (
    <textarea
      value={text}
      onChange={handleChange}
      placeholder="Shared notes for this incident — everyone sees changes live..."
      className="w-full min-h-[300px] resize-y rounded-lg border bg-card p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}
