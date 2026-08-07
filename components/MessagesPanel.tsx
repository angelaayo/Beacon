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

type Props = {
  incident: Incident;
  user: User;
};

const MessagesPanel = ({ incident, user }: Props) => {
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

  // function handleMessageSent(newMessage: Message) {
  //   setMessages((prev) => [...prev, newMessage]);
  // }

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
        <MessageInput incident={incident}/>
      </div>
    </div>
  );
};

export default MessagesPanel;
