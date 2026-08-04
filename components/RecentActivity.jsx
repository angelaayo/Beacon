import React from "react";
import { formatDistanceToNow } from "date-fns";
const RecentActivity = ({ activity, date }) => {
  const dateResult = formatDistanceToNow(date, { addSuffix: true });
  return (
    <div>
      <h3 className="font-hanken text-lg">
        <span className="font-semibold">{activity.user.name}</span> <span> </span>
        <span>{activity.description}</span>
      </h3>
      <span className="text-xs md:text-sm font-jetbrains">{dateResult}</span>
    </div>
  );
};

export default RecentActivity;
