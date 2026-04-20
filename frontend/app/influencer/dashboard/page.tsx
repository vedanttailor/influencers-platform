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
      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome, {fullName}
      </h1>

      <p className="mt-2 text-sm text-gray-600">
        Manage your campaigns and track your performance in one place.
      </p>

      {/* 🔥 STATS CARDS */}
      <StatsCards />

      {/* 🔥 QUICK SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Active Campaigns</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {active.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Applied Campaigns</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {applied.length}
          </h2>
        </div>
      </div>

      {/* 🔥 CAMPAIGN SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Available Campaigns</h3>
          <AvailableCampaigns />
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
          <ActiveCampaigns />
        </div>
      </div>
    </div>
  );
}
