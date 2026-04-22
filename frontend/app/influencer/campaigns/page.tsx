/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useCampaignStore } from "@/lib/useCampaignStore";
import { useState, useEffect } from "react";

export default function CampaignsPage() {
  const { campaigns, fetchCampaigns } = useCampaignStore() as {
    campaigns: any[];
    fetchCampaigns: () => void;
  };

  const [filter, setFilter] = useState<"all" | string>("all");

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const filteredCampaigns = filter === "all" 
    ? campaigns 
    : campaigns.filter((c: any) => c.status === filter);

  const badgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "applied":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Campaigns</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "active", "applied", "accepted", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg border ${
              filter === status 
                ? "bg-black text-white" 
                : "bg-white text-black hover:bg-gray-50"
            } transition-colors`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((c: any) => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {c.logo ? (
                  <img
                    src={c.logo}
                    className="w-12 h-12 rounded-lg object-cover border"
                    alt="Campaign logo"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">No logo</span>
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-lg line-clamp-1">{c.title || c.name}</h2>
                  <p className="text-sm text-gray-500">{c.client || c.brand_name}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${badgeColor(c.status)}`}>
                {c.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
Platform: {Array.isArray(c.platforms) ? c.platforms.join(', ') : c.platforms || c.platform || c.type || "N/A"}
              <p>Budget: ₹{Number(c.budget || 0).toLocaleString()}</p>
              {c.startDate && c.endDate && (
                <p>{new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href={`/Influencer/campaigns/${c.id}`}
                className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No campaigns match this filter</p>
        </div>
      )}
    </div>
  );
}
