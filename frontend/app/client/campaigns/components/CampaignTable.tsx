/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CampaignTable() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/campaigns");

        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getColor = (status: string) => {
    if (status === "active") return "bg-green-500";
    if (status === "completed") return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Campaigns</h3>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500">
            <th>Campaign</th>
            <th>Status</th>
            <th>Platforms</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="py-3">{c.campaign_name}</td>

              <td>
                <span className={`px-3 py-1 rounded text-white ${getColor(c.status)}`}>
                  {c.status}
                </span>
              </td>

              <td>{c.platforms?.join(", ") || "-"}</td>

              <td>
                <Link
                  href={`/client/campaigns/${c.id}`}
                  className="text-blue-600"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}