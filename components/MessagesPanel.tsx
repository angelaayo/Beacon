// components/MessagesPanel.tsx
"use client";
import { useState } from "react";
import MessageCard from "@/components/Message";
import MessageInput from "./MessageInput";
import { getIncident } from "@/lib/queries/incedentQueries";
import { verifyToken } from "@/lib/auth/jwt";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type Message = Incident["messages"][number];

type Props = {
  incident: Incident;
  user: User;
};

const MessagesPanel = ({ incident, user }: Props) => {
  const [messages, setMessages] = useState<Message[]>(incident.messages);

  function handleMessageSent(newMessage: Message) {
    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <div className="border-2 pb-4 flex flex-col gap-2">
      <h3 className="text-sm text-gray-600 font-bold p-4 border-b-2 border-b-[]">
        MESSAGES ({messages.length})
      </h3>
      <div className="flex flex-col gap-4 px-2">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} user={user} />
        ))}
      </div>
      <div>
        <MessageInput incident={incident} onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
};

export default MessagesPanel;