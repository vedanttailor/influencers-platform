"use client";
import { useCampaignStore } from "@/lib/useCampaignStore";

export default function StatsCards() {
  const { campaigns } = useCampaignStore();

  const active = campaigns.filter(c => c.status === "accepted").length;
  const completed = campaigns.filter(c => c.status === "completed").length;
  const pending = campaigns.filter(c => c.status === "applied").length;

  const earnings = campaigns
    .filter(c => c.status === "completed")
    .reduce((sum, c) => sum + c.budget, 0);

  const stats = [
    { label: "Active Campaigns", value: active },
    { label: "Completed", value: completed },
    { label: "Pending Review", value: pending },
    { label: "Total Earnings", value: `₹${earnings}` },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl p-5 shadow border"
        >
          <p className="text-sm text-gray-500">{s.label}</p>
          <p className="text-2xl font-bold mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
