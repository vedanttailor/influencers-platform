/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useCampaignStore } from "@/lib/useCampaignStore";
import { useEffect } from "react";

export default function CampaignsPage() {
  const { campaigns, fetchCampaigns } = useCampaignStore() as {
    campaigns: any[];
    fetchCampaigns: () => void;
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>

      <div className="grid grid-cols-3 gap-6">
        {campaigns.map((c: any) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
          >
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-500">{c.client}</p>

            <div className="flex justify-between mt-4 text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {c.platform}
              </span>
              <span className="text-green-600 font-bold">
                ₹{c.budget}
              </span>
            </div>

            <Link
              href={`/Influencer/campaigns/${c.id}`}
              className="block mt-5 text-center bg-black text-white py-2 rounded-lg"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}