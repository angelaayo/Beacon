import { verifyToken } from "@/lib/auth/jwt";
import React from "react";
import {
  getIncidentStats,
  getTopIncidents,
} from "@/lib/queries/incedentQueries";
import { getRecentActivity } from "@/lib/queries/eventQueries";
import StatsCard from "@/components/StatsCard";
import IncidentActivity from "@/components/IncidentActivity";
import RecentActivity from "@/components/RecentActivity";
import Link from "next/link";
const dashboardPage = async () => {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const [stats, topIncidents, recentActivity] = await Promise.all([
    getIncidentStats(user.organizationId),
    getTopIncidents(user.organizationId),
    getRecentActivity(user.organizationId),
  ]);
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-jetbrains text-sm md:text-base">System Overview</h3>
      <div className="grid grid-cols-2  md:grid-cols-4 gap-3">
        <StatsCard
          label="Open Incidents"
          value={stats.totalOpen}
          color="black"
        />
        <StatsCard label="Critical" value={stats.critical} color="#BA1A1A" />
        <StatsCard label="High" value={stats.high} color="#F59E0B" />
        <StatsCard label="Medium" value={stats.medium} color="#3B82F6" />
      </div>
      <div className="flex justify-between font-jetbrains text-sm md:text-base">
        <span>Active Incidents</span>
        <Link href="/incidents" className=" border-b-3 border-b-black">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {topIncidents.map((incident) => (
          <IncidentActivity key={incident.id} incident={incident} />
        ))}
      </div>
      <div className="flex flex-col gap-7 px-4 border-l-5 ">
        {recentActivity.map((activity) => (
          <RecentActivity
            key={activity.id}
            activity={activity}
            date={new Date(activity.createdAt)}
          />
        ))}
      </div>
    </div>
  );
};

export default dashboardPage;
