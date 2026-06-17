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
  const { fetchCampaigns } = useCampaignStore() as {
    fetchCampaigns: () => void;
  };

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    fetchCampaigns();

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setFullName(data.full_name || "Influencer");
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r  text-black">

        <p className="mt-3 text-back">
          Manage collaborations, track earnings, and grow your influencer career.
        </p>
      </div>

      {/* STATS */}
      <StatsCards />

      {/* AVAILABLE CAMPAIGNS */}
      <div className="bg-white rounded-3xl shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Campaigns
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Discover campaigns that match your audience and niche.
          </p>
        </div>

        <AvailableCampaigns />
      </div>

      {/* ACTIVE CAMPAIGNS */}
      <div className="bg-white rounded-3xl shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            My Active Campaigns
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Monitor your accepted and ongoing brand collaborations.
          </p>
        </div>

        <ActiveCampaigns />
      </div>
    </div>
  );
}