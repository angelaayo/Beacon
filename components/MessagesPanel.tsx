"use client";
import { useEffect, useState } from "react";
import MessageCard from "@/components/Message";
import MessageInput from "./MessageInput";
import { getIncident } from "@/lib/queries/incedentQueries";
import { verifyToken } from "@/lib/auth/jwt";
import { io, Socket } from "socket.io-client";

let socket: Socket;

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type Message = Incident["messages"][number];

const MessagesPanel = ({ incident, user }: { incident: Incident; user: User }) => {
  const [messages, setMessages] = useState<Message[]>(incident.messages);

  useEffect(() => {
    socket = io();
    socket.emit("joinIncident", incident.id);
    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leaveIncident", incident.id);
      socket.disconnect();
    };
  }, [incident.id]);

  return (
    <div className="border rounded-lg bg-card flex flex-col">
      <h3 className="text-sm font-semibold px-4 py-3 border-b">
        Messages <span className="text-muted-foreground font-normal">({messages.length})</span>
      </h3>

      <div className="flex flex-col gap-4 px-4 py-3 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No messages yet — be the first to say something.
          </p>
        ) : (
          messages.map((message) => <MessageCard key={message.id} message={message} user={user} />)
        )}
      </div>

      <div className="border-t px-4 py-3">
        <MessageInput incident={incident} />
      </div>
    </div>
  );
};

export default MessagesPanel;