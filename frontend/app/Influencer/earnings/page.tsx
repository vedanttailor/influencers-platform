/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCampaignStore } from "@/lib/useCampaignStore";

export default function EarningsPage() {
  const { campaigns } = useCampaignStore();

  const completed = campaigns.filter((c: any) => c.status === "completed");
  const active = campaigns.filter((c: any) => c.status === "active");

  const totalEarnings = completed.reduce(
    (sum: number, c: any) => sum + (c.payment || 0),
    0
  );

  const pendingEarnings = active.reduce(
    (sum: number, c: any) => sum + (c.payment || 0),
    0
  );

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="text-gray-500">
          Track your campaign earnings
        </p>
      </div>

      
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Earned</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{totalEarnings}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Pending Earnings</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{pendingEarnings}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Completed Campaigns</h3>
          <p className="text-3xl font-bold">
            {completed.length}
          </p>
        </div>

      </div>

     

      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b font-semibold">
          Campaign Earnings
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Campaign</th>
              <th className="text-left p-4">Brand</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>

            {campaigns.map((c: any) => (
              <tr key={c.id} className="border-t">

                <td className="p-4 font-medium">
                  {c.title}
                </td>

                <td className="p-4">
                  {c.brand || "Brand"}
                </td>

                <td className="p-4 font-semibold">
                  ₹{c.payment || 0}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs
                      ${
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