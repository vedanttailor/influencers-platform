"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StatCard from "../campaigns/components/StatCard";
import EngagementChart from "../campaigns/components/EngagementChart";
import CampaignTable from "../campaigns/components/CampaignTable";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get("/campaigns/stats"); // ✅ FIXED

        setStats({
          total: data?.total ?? 0,
          active: data?.active ?? 0,
          completed: data?.completed ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Campaigns"
          value={loading ? "..." : stats.total.toString()}
          href="/client/campaigns"
        />

        <StatCard
          title="Active Campaigns"
          value={loading ? "..." : stats.active.toString()}
          href="/client/campaigns?status=active"
        />

        <StatCard
          title="Completed Campaigns"
          value={loading ? "..." : stats.completed.toString()}
          href="/client/campaigns?status=completed"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EngagementChart />
      </div>

      <CampaignTable />
    </div>
  );
}