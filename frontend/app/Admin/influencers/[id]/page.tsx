"use client";

import InfluencerHeader from "./InfluencerHeader";
import OverviewTab from "./tabs/OverviewTab";
import PlatformsTab from "./tabs/PlatformsTab";
import CampaignPerformanceTab from "./tabs/CampaignPerformanceTab";
import TrustComplianceTab from "./tabs/TrustComplianceTab";
import RatingsTab from "./tabs/RatingsTab";
import AdminActionsTab from "./tabs/AdminActionsTab";

export default function InfluencerDetailPage() {
  return (
    <div className="p-6 space-y-6">
      <InfluencerHeader />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <OverviewTab />
          <PlatformsTab />
          <CampaignPerformanceTab />
          <RatingsTab />
        </div>

        <div className="col-span-4 space-y-6">
          <TrustComplianceTab />
          <AdminActionsTab />
        </div>
      </div>
    </div>
  );
}
