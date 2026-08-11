import { formatDistanceToNow } from "date-fns";
import { getRecentActivity } from "@/lib/queries/eventQueries";

type Activity = Awaited<ReturnType<typeof getRecentActivity>>[number];
type Props = {
  activity: Activity,
  date: Date,
};
const RecentActivity = ({ activity, date }: Props) => {
  const dateResult = formatDistanceToNow(date, { addSuffix: true });
  return (
    <div>
      <h3 className="font-hanken text-lg">
        <span className="font-semibold">{activity.user?.name}</span>{" "}
        <span> </span>
        <span>{activity.description}</span>
      </h3>
      <span className="text-xs md:text-sm font-jetbrains">{dateResult}</span>
    </div>
  );
};

export default RecentActivity;
