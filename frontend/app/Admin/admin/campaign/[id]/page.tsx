"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

interface CampaignDetails {
  id: number;
  name: string;
  client: string;
  brand: string;
  platform: string;
  influencers: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: "active" | "completed" | "pending";
  description: string;
}

const mockCampaigns: CampaignDetails[] = [
  {
    id: 101,
    name: "Campaign 001",
    client: "Client A",
    brand: "Brand Alpha",
    platform: "Instagram",
    influencers: 10,
    startDate: "2025-06-01",
    endDate: "2025-06-20",
    budget: 50000,
    spent: 32000,
    impressions: 120000,
    clicks: 5600,
    conversions: 430,
    status: "active",
    description:
      "Influencer-based product awareness campaign across Instagram.",
  },
  {
    id: 102,
    name: "Campaign 002",
    client: "Client A",
    brand: "Brand Beta",
    platform: "YouTube",
    influencers: 6,
    startDate: "2025-04-01",
    endDate: "2025-04-15",
    budget: 30000,
    spent: 30000,
    impressions: 90000,
    clicks: 4100,
    conversions: 250,
    status: "completed",
    description:
      "Video based promotion campaign focused on installs.",
  },
];

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const campaign = mockCampaigns.find(
    (c) => c.id === Number(id)
  );

  if (!campaign)
    return <p className="p-10 text-gray-500">Campaign not found.</p>;

  const badgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      

      <div className="bg-white shadow rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold">
              {campaign.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {campaign.client} • {campaign.brand}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm ${badgeColor(
              campaign.status
            )}`}
          >
            {campaign.status}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Views", value: campaign.impressions },
            { label: "Likes", value: campaign.clicks },
            { label: "Comments", value: campaign.conversions },
            { label: "Influencers", value: campaign.influencers },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gray-50 p-4 rounded-lg text-center"
            >
              <p className="text-xl font-bold">
                {item.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><strong>Platform:</strong> {campaign.platform}</p>
          <p><strong>Start:</strong> {campaign.startDate}</p>
          <p><strong>End:</strong> {campaign.endDate}</p>
          <p><strong>Budget:</strong> ₹{campaign.budget.toLocaleString()}</p>
          <p><strong>Spent:</strong> ₹{campaign.spent.toLocaleString()}</p>
          <p><strong>Description:</strong> {campaign.description}</p>
        </div>
      </div>
      <Link
        href="/admin/client"
        className="text-sm text-gray-600 mb-4 inline-block"
      >
         Back to Clients
      </Link>
    </div>
  );
}
