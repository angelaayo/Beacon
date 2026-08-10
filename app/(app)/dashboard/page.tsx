import { verifyToken } from "@/lib/auth/jwt";
import {
  getIncidentStats,
  getTopIncidents,
} from "@/lib/queries/incedentQueries";
import { getRecentActivity } from "@/lib/queries/eventQueries";
import StatsCard from "@/components/StatsCard";
import IncidentActivity from "@/components/IncidentActivity";
import RecentActivity from "@/components/RecentActivity";
import Link from "next/link";

const DashboardPage = async () => {
  const user = await verifyToken();
  const [stats, topIncidents, recentActivity] = await Promise.all([
    getIncidentStats(user!.organizationId),
    getTopIncidents(user!.organizationId),
    getRecentActivity(user!.organizationId),
  ]);

  return (
    <div className="flex flex-col gap-4 px-2 py-4">
      <h3 className="font-jetbrains text-sm md:text-base text-muted-foreground">
        System Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard label="Open Incidents" value={stats.totalOpen} />
        <StatsCard
          label="Critical"
          value={stats.critical}
          severity="critical"
        />
        <StatsCard label="High" value={stats.high} severity="high" />
        <StatsCard label="Unassigned" value={stats.unassigned} />
      </div>

      <div className="flex justify-between items-center font-jetbrains text-sm md:text-base mt-2">
        <span className="font-semibold">Active Incidents</span>
        <Link
          href="/incidents"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {topIncidents.map((incident) => (
          <IncidentActivity key={incident.id} incident={incident} />
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 border-l-2 border-border mt-2">
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

export default DashboardPage;
