/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type CampaignStatus = "active" | "completed" | "pending";

interface Campaign {
  id: string;
  name: string;
  type: string;
  category: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: CampaignStatus;
  logo?: string;
}

export default function ClientCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<"all" | CampaignStatus>("all");

  // ✅ FETCH
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.get("/campaigns");

        const formatted = Array.isArray(data)
          ? data
              .map((c: any) => ({
                id: c.id,
                name: c.campaign_name,
                type: c.campaign_type,
                category: c.campaign_category,
                startDate: c.start_date,
                endDate: c.end_date,
                budget: Number(c.budget),
                status: c.status,
                logo: c.logo,
                createdAt: c.created_at,
              }))
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
          : [];

        setCampaigns(formatted);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns =
    filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  // ✅ DELETE
  const deleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await api.delete(`/campaigns/${id}`);

      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ COMPLETE
  const completeCampaign = async (id: string) => {
    if (!confirm("Mark this campaign as completed?")) return;

    try {
      await api.patch(`/campaigns/${id}`, {
        status: "completed",
      });

      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "completed" } : c)),
      );
    } catch (err) {
      console.error("Complete failed", err);
    }
  };

  const badgeColor = (status: CampaignStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* UI SAME */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Campaigns</h1>
        <Link
          href="/client/create-campaign"
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          + Create Campaign
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        {["all", "active", "completed", "pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg border ${
              filter === status ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white p-5 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={campaign.logo || "/avatar.png"}
                  className="w-12 h-12 rounded-lg object-cover border"
                />

                <div>
                  <h2 className="font-semibold text-lg">{campaign.name}</h2>
                  <p className="text-sm text-gray-500">
                    {campaign.type} • {campaign.category}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-sm rounded-full ${badgeColor(campaign.status)}`}
              >
                {campaign.status}
              </span>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>
                {campaign.startDate} → {campaign.endDate}
              </p>
              <p> Budget: ₹{campaign.budget.toLocaleString()}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Link
                href={`/client/edit-campaign/${campaign.id}`}
                className="text-sm px-4 py-1 border border-blue-400 text-blue-600 rounded-lg"
              >
                Edit
              </Link>

              <Link
                href={`/client/campaigns/${campaign.id}`}
                className="text-sm px-4 py-1 border rounded-lg"
              >
                View
              </Link>

              {campaign.status === "active" && (
                <button
                  onClick={() => completeCampaign(campaign.id)}
                  className="text-sm px-4 py-1 border border-green-500 text-green-600 rounded-lg"
                >
                  Complete
                </button>
              )}

              {campaign.status !== "active" && (
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  className="text-sm px-4 py-1 border border-red-400 text-red-600 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No campaigns found.</p>
      )}
    </div>
  );
}
