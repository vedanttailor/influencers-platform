"use client";

import StatCard from "../components/admin/dashboard/StatCard";
import UsersTable from "../components/admin/dashboard/UsersTable";
import CampaignTable from "../components/admin/dashboard/CampaignTable";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    users: number;
    influencers: number;
    managers: number;
    clients: number;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await api.get("/admin/stats");
        setStats({
          users: Number(data?.users ?? 0),
          influencers: Number(data?.influencers ?? 0),
          clients: Number(data?.clients ?? 0),
          managers: Number(data?.managers ?? 0),
        });
      } catch (e) {
        console.error("Failed to fetch admin stats", e);
        setStats({ users: 0, influencers: 0, managers: 0, clients: 0 });
      }
    };

    run();
  }, []);

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of users and campaign activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats ? String(stats.users) : "..."}
          />
          <StatCard
            title="Influencers"
            value={stats ? String(stats.influencers) : "..."}
          />
          <StatCard
            title="Managers"
            value={stats ? String(stats.managers) : "..."}
          />
          <StatCard
            title="Clients"
            value={stats ? String(stats.clients) : "..."}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UsersTable />
          <CampaignTable />
        </div>
      </div>
  );
}
