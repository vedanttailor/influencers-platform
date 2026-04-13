"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import StatCard from "../components/StatCard";
import DashboardCharts from "../components/DashboardCharts";

type Stats = {
  clients: number;
  influencers: number;
  campaigns: number;
  pending_approvals: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await api.get("/manager/stats");
        setStats(data);
      } catch (e) {
        console.error("Failed to fetch manager stats", e);
        setStats({ clients: 0, influencers: 0, campaigns: 0, pending_approvals: 0 });
      }
    };
    run();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Quick access to clients, influencers, and campaigns.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/manager/clients">
          <StatCard title="Clients" value={String(stats?.clients ?? "...")} />
        </Link>

        <Link href="/manager/influencers">
          <StatCard title="Influencers" value={String(stats?.influencers ?? "...")} />
        </Link>

        <Link href="/manager/campaigns">
          <StatCard title="Campaigns" value={String(stats?.campaigns ?? "...")} />
        </Link>

        <StatCard title="Pending Approvals" value={String(stats?.pending_approvals ?? "...")} />
      </div>

      {/* Charts */}
      <DashboardCharts />
    </div>
  );
}
