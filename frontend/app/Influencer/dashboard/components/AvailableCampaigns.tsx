"use client";
import { useCampaignStore } from "@/lib/useCampaignStore";
import Link from "next/link";

export default function AvailableCampaigns() {
  const { campaigns } = useCampaignStore();
  const available = campaigns.filter(c => c.status === "available");

  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Available Campaigns
      </h2>

      <div className="space-y-4">
        {available.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <p className="font-medium">{c.client}</p>
              <p className="text-sm text-gray-500">
                {c.title} • {c.platform}
              </p>
              <p className="text-xs text-gray-400">
                Deadline: {c.endDate}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">₹{c.budget}</p>
              <Link
                href={`/influencer/campaigns/${c.id}`}
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-1.5 rounded text-sm"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
