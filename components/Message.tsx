import { Message as PrismaMessage } from "@/app/generated/prisma/client";
import React from "react";
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble";
import {
  Message as ChatMessage,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { verifyToken } from "@/lib/auth/jwt";
import { getIncident } from "@/lib/queries/incedentQueries";
type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;

type Props = {
  message: Incident["messages"][number];
  user: User;
};
const MessageCard = ({ message, user }: Props) => {
  return (
    <ChatMessage
      align={message.userId === user.id ? "end" : "start"}
      className=""
    >
      <MessageContent>
        <MessageHeader>{message.user.name}</MessageHeader>
        <Bubble className="bg-[#F5F3F4] w-fit p-2">
          <BubbleContent className="text-sm">{message.content}</BubbleContent>
        </Bubble>
      </MessageContent>
    </ChatMessage>
  );
};

export default MessageCard;
