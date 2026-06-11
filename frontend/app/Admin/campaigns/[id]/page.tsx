/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await api.get(`/admin/campaigns/${id}`);
        setCampaign(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading campaign...</div>;
  }

  if (!campaign) {
    return <div className="p-6">Campaign not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/Admin/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
        >
          ← Back to Users
        </Link>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaign Details</h1>
      </div>

      {/* Campaign Logo */}
      {campaign.logo && (
        <div className="mb-8 flex justify-center">
          <img
            src={campaign.logo}
            alt={campaign.campaign_name}
            className="h-64 w-64 rounded-2xl border border-slate-200 bg-white p-2 object-contain shadow-lg"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold w-64">
                Campaign Name
              </td>
              <td className="p-3">{campaign.campaign_name || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Brand Name</td>
              <td className="p-3">{campaign.brand_name || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Campaign Type</td>
              <td className="p-3">{campaign.campaign_type || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">
                Campaign Category
              </td>
              <td className="p-3">{campaign.campaign_category || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">
                Campaign Objective
              </td>
              <td className="p-3">{campaign.campaign_objective || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Description</td>
              <td className="p-3 whitespace-pre-wrap">
                {campaign.description || "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Budget</td>
              <td className="p-3">₹{campaign.budget || 0}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Platforms</td>
              <td className="p-3">
                {campaign.platforms?.length
                  ? campaign.platforms.join(", ")
                  : "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Status</td>
              <td className="p-3">{campaign.status || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Company URL</td>
              <td className="p-3 break-all">
                {campaign.company_url ? (
                  <a
                    href={
                      campaign.company_url.startsWith("http")
                        ? campaign.company_url
                        : `https://${campaign.company_url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {campaign.company_url}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Start Date</td>
              <td className="p-3">
                {campaign.start_date
                  ? new Date(campaign.start_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">End Date</td>
              <td className="p-3">
                {campaign.end_date
                  ? new Date(campaign.end_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Created At</td>
              <td className="p-3">
                {campaign.created_at
                  ? new Date(campaign.created_at).toLocaleString()
                  : "-"}
              </td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Client</td>
              <td className="p-3">{campaign.client?.name || "-"}</td>
            </tr>

            <tr className="border-b">
              <td className="bg-gray-50 p-3 font-semibold">Influencer</td>
              <td className="p-3">
                {campaign.influencer?.name || "Not Assigned"}
              </td>
            </tr>

            <tr>
              <td className="bg-gray-50 p-3 font-semibold">Manager</td>
              <td className="p-3">
                {campaign.manager?.name || "Not Assigned"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}