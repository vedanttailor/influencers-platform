/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import PaymentButton from "@/components/PaymentButton";

type CampaignStatus = "active" | "completed" | "pending";

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const data = await api.get(`/campaigns/${id}`);
      setCampaign(data);
    } catch (err) {
      console.error("Failed to fetch campaign", err);
    }
  };

  const deleteCampaign = async () => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await api.delete(`/campaigns/${id}`);
      window.location.href = "/client/campaigns";
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const completeCampaign = async () => {
    if (!confirm("Mark this campaign as completed?")) return;

    try {
      await api.patch(`/campaigns/${id}`, {
        status: "completed",
      });

      setCampaign((prev: any) => ({
        ...prev,
        status: "completed",
      }));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const badgeColor = (status: CampaignStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
  };

  if (!campaign) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Link href="/client/campaigns" className="text-sm text-gray-600">
        ← Back to Campaigns
      </Link>

      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={campaign.logo || "/avatar.png"}
            alt="logo"
            className="w-16 h-16 rounded-lg object-cover border"
          />

          <div>
            <h1 className="text-2xl font-semibold">{campaign.campaign_name}</h1>

            <span
              className={`px-3 py-1 text-sm rounded-full ${badgeColor(
                campaign.status,
              )}`}
            >
              {campaign.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <p>Type: {campaign.campaign_type}</p>
          <p>Category: {campaign.campaign_category}</p>
          <p>Platforms: {campaign.platforms?.join(", ") || "-"}</p>
          <p>Budget: ₹{campaign.budget}</p>
          <p>Start: {campaign.start_date}</p>
          <p>End: {campaign.end_date}</p>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Influencer Submitted Video
          </p>
          {campaign.post_url && typeof campaign.post_url === "object" ? (
            <div className="mt-3 space-y-4">
              {/* Instagram Links */}

              {Array.isArray(campaign.post_url.instagram) &&
                campaign.post_url.instagram.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-pink-600 mb-2">
                      Instagram Links
                    </h4>

                    {campaign.post_url.instagram.map(
                      (link: string, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="text-sm font-medium">
                            Link {index + 1}
                          </p>

                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline break-all text-sm"
                          >
                            {link}
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                )}

              {/* YouTube Links */}

              {Array.isArray(campaign.post_url.youtube) &&
                campaign.post_url.youtube.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">
                      YouTube Links
                    </h4>

                    {campaign.post_url.youtube.map(
                      (link: string, index: number) => (
                        <div key={index} className="mb-2">
                          <p className="text-sm font-medium">
                            Link {index + 1}
                          </p>

                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline break-all text-sm"
                          >
                            {link}
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                )}

              {!campaign.post_url.instagram?.length &&
                !campaign.post_url.youtube?.length && (
                  <p className="text-sm text-slate-500">
                    Not submitted yet by influencer.
                  </p>
                )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              Not submitted yet by influencer.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {/* SHOW PAYMENT BUTTON ONLY IF PAYMENT NOT DONE */}

          {campaign.status === "completed" && !campaign.is_paid && (
            <PaymentButton campaignId={campaign.id} />
          )}

          {/* COMPLETE BUTTON */}

          {campaign.status === "active" && (
            <button
              onClick={completeCampaign}
              className="
        px-4
        py-2
        border
        border-green-500
        text-green-600
        rounded-lg
      "
            >
              Complete
            </button>
          )}

          {/* DELETE BUTTON */}

        </div>
      </div>
    </div>
  );
}
