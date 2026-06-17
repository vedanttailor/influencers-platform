"use client";

import { useCampaignStore } from "@/lib/useCampaignStore";

export default function StatsCards() {
  const { campaigns } = useCampaignStore();

  const active = campaigns.filter(
    (c) => c.status === "accepted"
  ).length;

  const completed = campaigns.filter(
    (c) => c.status === "completed"
  ).length;

  const applied = campaigns.filter(
    (c) => c.status === "applied"
  ).length;

  const earnings = campaigns
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + c.budget, 0);

  const stats = [
    {
      label: "Active Campaigns",
      value: active,
      color: "text-green-600",
    },
    {
      label: "Completed",
      value: completed,
      color: "text-indigo-600",
    },
    {
      label: "Applied Campaigns",
      value: applied,
      color: "text-blue-600",
    },
    {
      label: "Total Earnings",
      value: `₹${earnings}`,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-lg transition"
        >
          <p className="text-sm text-gray-500">
            {s.label}
          </p>

          <h2 className={`text-3xl font-bold mt-3 ${s.color}`}>
            {s.value}
          </h2>
        </div>
      ))}
    </div>
  );
}