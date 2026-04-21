/* eslint-disable @next/next/no-img-element */
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore and apply to the latest campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c: any) => (
          <div
            key={c.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {c.logo ? (
                <img
                  src={c.logo}
                  alt="campaign"
                  className="h-50 w-60 object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm">No Image</div>
              )}
            </div>

            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {c.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">{c.client}</p>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                  {c.platform}
                </span>

                <span className="text-green-600 font-bold text-base">
                  ₹{c.budget}
                </span>
              </div>

              <Link
                href={`/Influencer/campaigns/${c.id}`}
                className="block mt-5 text-center bg-gray-900 hover:bg-black text-white py-2 rounded-lg transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
