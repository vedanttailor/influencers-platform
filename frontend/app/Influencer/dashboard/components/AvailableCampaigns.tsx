/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCampaignStore } from "@/lib/useCampaignStore";
import Link from "next/link";

export default function AvailableCampaigns() {
  const { campaigns } = useCampaignStore() as { campaigns: any[] };

  const available = campaigns.filter((c: any) => c.status === "active");

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-semibold mb-4">Available Campaigns</h2>

      {available.map((c: any) => (
        <div key={c.id} className="flex justify-between mb-3">
          <div>
            <p>{c.title}</p>
            <p className="text-sm text-gray-500">{c.client}</p>
          </div>

          <Link href={`/Influencer/campaigns/${c.id}`}>
            View
          </Link>
        </div>
      ))}
    </div>
  );
}