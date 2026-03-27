/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCampaignStore } from "@/lib/useCampaignStore";

export default function ActiveCampaigns() {
  const { campaigns } = useCampaignStore();
  const active = campaigns.filter(
    c => c.status === "applied" || c.status === "accepted"
  );

  const statusColor: any = {
    applied: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h2 className="text-lg font-semibold mb-4">
        My Campaigns
      </h2>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Brand</th>
            <th>Campaign</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>
          {active.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3 font-medium">{c.client}</td>
              <td>{c.title}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${statusColor[c.status]}`}
                >
                  {c.status}
                </span>
              </td>
              <td>{c.endDate}</td>
              <td>₹{c.budget}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
