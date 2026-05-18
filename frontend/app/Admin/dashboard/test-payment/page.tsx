/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AdminPayoutButton from "@/components/AdminPayoutButton";

export default function TestPaymentPage() {

  // REAL CAMPAIGN ID

  const campaignId =
    "21ab13e1-07d1-45e6-bbc9-8b9799f12dd5";

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div
        className="
          max-w-xl
          mx-auto
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            mb-4
            text-gray-800
          "
        >
          Admin Test Payment
        </h1>

        <p
          className="
            text-gray-600
            mb-6
          "
        >
          Test influencer payout flow
        </p>

        <div
          className="
            border
            rounded-xl
            p-5
            bg-gray-50
          "
        >

          <p className="mb-2">
            <strong>Campaign ID:</strong>
          </p>

          <p
            className="
              text-sm
              break-all
              text-gray-700
              mb-6
            "
          >
            {campaignId}
          </p>

          <AdminPayoutButton
            campaignId={campaignId}
          />

        </div>

      </div>

    </div>
  );
}