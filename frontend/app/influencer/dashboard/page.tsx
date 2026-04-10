/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCampaignStore } from "@/lib/useCampaignStore";
import StatsCards from "./components/StatsCards";
import AvailableCampaigns from "./components/AvailableCampaigns";
import ActiveCampaigns from "./components/ActiveCampaigns";

export default function InfluencerDashboard() {
  return (
    <ProtectedRoute allowed={["influencer"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { campaigns, fetchCampaigns } = useCampaignStore() as {
    campaigns: any[];
    fetchCampaigns: () => void;
  };
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    fetchCampaigns();

    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setFullName(data.full_name);
    };

    fetchUser();
  }, []);

  const active = campaigns.filter((c: any) => c.status === "accepted");
  const applied = campaigns.filter((c: any) => c.status === "applied");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Welcome, {fullName}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Explore available campaigns and track your active work.
        </p>
      </div>

      <StatsCards />
      <AvailableCampaigns />
      <ActiveCampaigns />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900">Active campaigns</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {active.length}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900">Applied campaigns</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {applied.length}
          </p>
        </div>
      </div>
    </div>
  );
}