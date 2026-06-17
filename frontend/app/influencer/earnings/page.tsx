/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useCampaignStore } from "@/lib/useCampaignStore";

type CampaignEarning = {
  id: string | number;
  campaign_name: string;
  brand_name: string;
  budget: number;
  status: string;
};

type Earnings = {
  total_earning: number;
  pending_earning: number;
  completed_campaigns: number;
  campaigns: CampaignEarning[];
};

type CampaignStore = {
  earnings?: Earnings;
  fetchEarnings: () => void;
};

export default function EarningsPage() {
  const { earnings, fetchEarnings } = useCampaignStore() as CampaignStore;

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (!earnings) {
    return <p className="text-center mt-10">Loading earnings...</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-gray-500">
          Track your campaign earnings
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Earned</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{earnings.total_earning}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Pending Earnings</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{earnings.pending_earning}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">
            Completed Campaigns
          </h3>
          <p className="text-3xl font-bold">
            {earnings.completed_campaigns}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-5 border-b font-semibold">
          Campaign Earnings
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Campaign</th>
              <th className="p-4 text-left">Brand</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {earnings.campaigns.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-4 font-medium">
                  {c.campaign_name}
                </td>

                <td className="p-4">
                  {c.brand_name}
                </td>

                <td className="p-4 font-semibold">
                  ₹{c.budget}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      c.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}