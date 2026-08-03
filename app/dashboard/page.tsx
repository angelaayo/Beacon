import { verifyToken } from "@/lib/auth/jwt";
import React from "react";
import {
  getIncidentStats,
  getTopIncidents,
} from "@/lib/queries/incedentQueries";
import { getRecentActivity } from "@/lib/queries/eventQueries";
import StatsCard from "@/components/StatsCard";
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
    <div>
      <h1>Welcome to the dashboard page</h1>
      <div className="grid ">
        <StatsCard label="Open" value={stats.totalOpen} />
        <StatsCard label="Critical" value={stats.critical} color="red" />
        <StatsCard label="High" value={stats.high} />
        <StatsCard label="Med" value={stats.medium} />
      </div>
    </div>
  );
};

export default dashboardPage;
 