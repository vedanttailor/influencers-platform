"use client";

import { useState } from "react";

import CampaignsTab from "./tabs/CampaignsTab";
import FinancialTab from "./tabs/FinancialTab";
import Link from "next/link";

export default function InfluencerDetailPage() {
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <Link
          href="/Admin/influencers"
          className="text-sm text-gray-600 mb-4 inline-block"
        >
          ← Back to Influencers
        </Link>

        <h1 className="text-2xl font-bold">Influencer Details</h1>

        <p className="text-gray-500 text-sm mt-1">
          Manage influencer campaigns and payouts
        </p>
      </div>

      {/* TABS */}

      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`pb-2 px-1 ${
            activeTab === "campaigns"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Campaigns
        </button>

        <button
          onClick={() => setActiveTab("financial")}
          className={`pb-2 px-1 ${
            activeTab === "financial"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          Financial
        </button>
      </div>

      {/* TAB CONTENT */}

      {activeTab === "campaigns" && <CampaignsTab />}

      {activeTab === "financial" && <FinancialTab />}
    </div>
  );
}
