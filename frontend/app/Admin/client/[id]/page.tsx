import "../Admin.css";
// "use client";

import { useState } from "react";
import ClientHeader from "./ClientHeader";
import OverviewTab from "./tabs/OverviewTab";
import FinancialTab from "./tabs/FinancialTab";
import CampaignsTab from "./tabs/CampaignsTab";
import RiskTab from "./tabs/RiskTab";
import AdminActionsTab from "./tabs/AdminActionsTab";

const tabs = [
  "Overview",
  "Financials",
  "Campaigns",
  "Risks",
  "Admin Actions",
] as const;

export default function ClientDetailPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");

  return (
    <div className="p-6 space-y-6">
      <ClientHeader />

      
      <div className="flex gap-3 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      
      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Financials" && <FinancialTab />}
      {activeTab === "Campaigns" && <CampaignsTab />}
      {activeTab === "Risks" && <RiskTab />}
      {activeTab === "Admin Actions" && <AdminActionsTab />}
    </div>
  );
}
