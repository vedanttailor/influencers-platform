/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPayoutButton from "@/components/AdminPayoutButton";
import toast from "react-hot-toast";

export default function FinancialTab() {
  const params = useParams();

  const influencerId = params.id;

  const [campaigns, setCampaigns] = useState<any[]>([]);

  const [financials, setFinancials] = useState<any>(null);

  useEffect(() => {
    fetchCampaigns();

    fetchFinancials();
  }, []);

  const fetchCampaigns = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/admin/influencer/${influencerId}/campaigns`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const data = await res.json();

    setCampaigns(data.campaigns || data);
  };

  const fetchFinancials = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/admin/influencer/${influencerId}/financials`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    const data = await res.json();

    setFinancials(data);
  };

  const handlePay = async (campaignId: string) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/payout/pay-influencer/${campaignId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Payment successful");
      } else {
        toast.error(data.detail || "Payment failed");
      }

      fetchCampaigns();

      fetchFinancials();
    } catch (err) {
      console.error(err);

      toast.error("Payment failed");
    }
  };

  if (!financials) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">Earnings Overview</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <b>Total Earned:</b>₹{financials.total_earned}
          </p>

          <p>
            <b>Pending Amount:</b>₹{financials.pending_amount}
          </p>

          <p>
            <b>Paid Campaigns:</b>
            {financials.paid_campaigns}
          </p>

          <p>
            <b>Total Campaigns:</b>
            {financials.total_campaigns}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-semibold mb-4">Payout Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                {["Campaign", "Amount", "Status", "Transaction", "Action"].map(
                  (h) => (
                    <th key={h} className="p-3 text-left border">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="p-3">{c.campaign_name}</td>

                  <td className="p-3">₹{c.budget}</td>

                  <td className="p-3">
                    {c.payout_status === "paid" ? (
                      <span className="text-green-600 font-medium">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-3">{c.transaction_id || "—"}</td>

                  <td className="p-3">
                    {c.payout_status === "paid" ? (
                      <span className="text-green-600 font-medium">
                        Completed
                      </span>
                    ) : (
                      <AdminPayoutButton campaignId={c.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
