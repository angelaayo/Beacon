import { formatDistanceToNow } from "date-fns";

type Event = {
  id: string;
  description: string;
  createdAt: Date;
  user: {
    name: string;
  } | null;
};

const IncidentEventHistory = ({ events }: { events: Event[] }) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm text-muted-foreground font-semibold">
          ACTIVITY HISTORY
        </h2>

        <span className="text-xs text-muted-foreground">
          {events.length} events
        </span>
      </div>

      <div className="bg-card border rounded-lg p-3 max-h-72 overflow-y-auto">
        <div className="flex flex-col">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="flex gap-3 py-3">
              <div className="flex flex-col items-center">
                <div className="size-2 rounded-full bg-primary mt-1.5" />

                {index !== sortedEvents.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">
                    {event.user?.name ?? "System"}
                  </span>{" "}
                  {event.description}
                </p>

                <p className="text-xs text-muted-foreground font-jetbrains mt-1">
                  {formatDistanceToNow(new Date(event.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IncidentEventHistory;
