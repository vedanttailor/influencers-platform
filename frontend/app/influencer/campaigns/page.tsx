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

  useEffect(() => {
  if (campaigns.length > 0) {
    console.log("First Campaign:", campaigns[0]);
  }
}, [campaigns]);

  const sortedCampaigns = [...campaigns].sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const filteredCampaigns =
    filter === "all"
      ? sortedCampaigns
      : sortedCampaigns.filter((c: any) => c.status === filter);

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

  // =========================
  // NEW CAMPAIGN CHECK
  // =========================
  const isNewCampaign = (date: string) => {
    if (!date) return false;

    const created = new Date(date).getTime();

    const now = new Date().getTime();

    const diffHours = (now - created) / (1000 * 60 * 60);

    // show NEW for 24 hours
    return diffHours <= 24;
  };

  return (
    <div className="w-full p-0 space-y-6">
      {/* HEADER */}
      <div className="px-6 pt-6">
        <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage all your influencer collaborations in one place.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap px-6">
        {["all", "active", "applied", "accepted", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === status
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border shadow-sm overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* TABLE HEADER */}
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Campaign
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Brand
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Platforms
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Budget
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Deadline
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {filteredCampaigns.map((c: any) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  {/* CAMPAIGN */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          alt="Campaign"
                          className="w-14 h-14 rounded-xl object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          No Logo
                        </div>
                      )}

                      <div>
                        {/* TITLE + NEW BADGE */}
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-gray-900">
                            {c.title || c.name || c.campaign_name}
                          </h2>

                          {isNewCampaign(c.created_at) && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* BRAND */}
                  <td className="px-6 py-5 text-gray-700">
                    {c.client || c.brand_name || "N/A"}
                  </td>

                  {/* PLATFORMS */}
                  <td className="px-6 py-5 text-gray-700">
                    {Array.isArray(c.platforms)
                      ? c.platforms.join(", ")
                      : c.platforms || c.platform || c.type || "N/A"}
                  </td>

                  {/* BUDGET */}
                  <td className="px-6 py-5 font-semibold text-gray-900">
                    ₹{Number(c.budget || 0).toLocaleString()}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                        c.status,
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* DEADLINE */}
                  <td className="px-6 py-5">
                    {c.endDate || c.end_date ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {new Date(c.endDate || c.end_date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>

                        <span className="text-xs text-gray-400">
                          Submission deadline
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No deadline</span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/Influencer/campaigns/${c.id}`}
                      className="inline-flex items-center px-4 py-2 rounded-xl border text-sm font-medium hover:bg-gray-100 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {filteredCampaigns.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-lg">No campaigns found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
