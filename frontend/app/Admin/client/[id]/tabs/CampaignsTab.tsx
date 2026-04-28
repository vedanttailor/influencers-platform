/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

export default function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/influencer/my-campaigns",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Campaign History</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Campaign",
                "Brand",
                "Platforms",
                "Budget",
                "Status",
                "Post Link",
              ].map((h) => (
                <th key={h} className="p-3 text-left border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.campaign_name}</td>
                  <td className="p-3">{c.brand_name}</td>
                  <td className="p-3">
                    {Array.isArray(c.platforms)
                      ? c.platforms.join(", ")
                      : c.platforms}
                  </td>
                  <td className="p-3">₹{c.budget}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : c.status === "active"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {c.post_url ? (
                      <a
                        href={
                          c.post_url?.instagram ||
                          c.post_url?.youtube ||
                          "#"
                        }
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}