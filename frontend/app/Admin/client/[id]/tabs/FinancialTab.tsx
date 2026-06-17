/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FinancialTab() {

  const params = useParams();

  const clientId = params.id;

  const [financials, setFinancials] = useState<any>(null);

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/admin/client/${clientId}/financials`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setFinancials(data);

    } catch (err) {

      console.error("Failed to fetch financials", err);
    }
  };

  if (!financials) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (

    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">

      <h2 className="font-semibold">
        Financial Overview
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <p>
          <b>Total Spend:</b>
          ₹{financials.total_spend}
        </p>

        <p>
          <b>Average Budget:</b>
          ₹{financials.avg_budget}
        </p>

        <p>
          <b>Highest Budget:</b>
          ₹{financials.highest_budget}
        </p>

        <p>
          <b>Total Campaigns:</b>
          {financials.total_campaigns}
        </p>

      </div>

      <div className="mt-4">

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
          Active Client
        </span>

      </div>

    </div>
  );
}