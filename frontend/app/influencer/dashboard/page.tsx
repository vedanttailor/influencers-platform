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
  const { campaigns } = useCampaignStore();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
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

  const available = campaigns.filter((c: any) => c.status === "available");
  const applied = campaigns.filter((c: any) => c.status === "applied");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {fullName}
        </h1>
        <p className="text-gray-500">
          Manage your campaigns and earnings
        </p>
      </div>

      <StatsCards />
      <AvailableCampaigns />
      <ActiveCampaigns />

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-semibold mb-2">Available Campaigns</h2>
          <p className="text-3xl font-bold">{available.length}</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-semibold mb-2">Applied Campaigns</h2>
          <p className="text-3xl font-bold">{applied.length}</p>
        </div>
      </div>
    </div>
  );
}