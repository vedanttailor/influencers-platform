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
      <h1 className="text-3xl font-bold">Welcome, {fullName}</h1>

      <StatsCards />
      <AvailableCampaigns />
      <ActiveCampaigns />

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <h2>Active Campaigns</h2>
          <p className="text-2xl">{active.length}</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2>Applied Campaigns</h2>
          <p className="text-2xl">{applied.length}</p>
        </div>
      </div>
    </div>
  );
}