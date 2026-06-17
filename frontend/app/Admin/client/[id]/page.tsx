"use client";
import { useState } from "react";
import ClientHeader from "./ClientHeader";
import { ClientProvider } from "./ClientContext";
import OverviewTab from "./tabs/OverviewTab";
import FinancialTab from "./tabs/FinancialTab";
import CampaignsTab from "./tabs/CampaignsTab";

const tabs = [
  "Overview",
  "Financials",
  "Campaigns",
] as const;

export default function ClientDetailPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");

  return (
    <ClientProvider>
      <div className="p-6 space-y-6">
        <ClientHeader />

        <div className="flex gap-3 border-b">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Financials" && <FinancialTab />}
        {activeTab === "Campaigns" && <CampaignsTab />}
      </div>
    </ClientProvider>
  );
}