import { formatDistanceToNowStrict } from "date-fns";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { getIncident } from "@/lib/queries/incedentQueries";
import { verifyToken } from "@/lib/auth/jwt";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;

type Props = {
  message: Incident["messages"][number];
  user: User;
};

const MessageCard = ({ message, user }: Props) => {
  const isOwn = message.userId === user.id;

  return (
    <div className={cn("flex gap-2 items-end", isOwn && "flex-row-reverse")}>
      <Avatar name={message.user.name} color={message.user.avatarColor} size="sm" />
      <div className={cn("flex flex-col gap-1 max-w-[75%]", isOwn && "items-end")}>
        <div className="flex items-baseline gap-2">
          {!isOwn && <span className="text-xs font-medium">{message.user.name}</span>}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNowStrict(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm",
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;