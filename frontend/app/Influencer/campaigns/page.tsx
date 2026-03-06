"use client";
import Link from "next/link";
import { useCampaignStore } from "@/lib/useCampaignStore";

export default function CampaignsPage() {
  const { campaigns } = useCampaignStore();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Campaigns
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white p-5 rounded shadow">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-500">{c.client}</p>
            <p className="mt-2">Platform: {c.platform}</p>
            <p>Budget: ₹{c.budget}</p>

            <Link
              href={`/influencer/campaigns/${c.id}`}
              className="inline-block mt-4 bg-black text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
