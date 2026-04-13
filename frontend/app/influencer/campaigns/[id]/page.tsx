/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
import { useCampaignStore } from "@/lib/useCampaignStore";
import { useState, useEffect } from "react";

export default function CampaignDetail() {
  const { id }: any = useParams();
  const { campaigns, apply, submitLink, fetchCampaigns } =
    useCampaignStore() as {
      campaigns: any[];
      apply: (id: string) => void;
      submitLink: (id: string, link: string) => void;
      fetchCampaigns: () => void;
    };

  const [postLink, setPostLink] = useState("");

  useEffect(() => {
    if (!campaigns.length) fetchCampaigns();
  }, []);

  const campaign = campaigns.find((c: any) => c.id == id);
  const status = String(campaign?.status || "").toLowerCase();
  const canSubmitLink = ["accepted", "assigned", "applied", "active"].includes(status);

  const formatDate = (value: any) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  };

  if (!campaign) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold">{campaign.title}</h1>
      <p className="text-gray-500">{campaign.client}</p>

      <div className="mt-4 space-y-2 text-sm">
        <p><b>Platform:</b> {campaign.platform || "-"}</p>
        <p><b>Budget:</b> ₹{Number(campaign.budget || 0).toLocaleString()}</p>
        <p><b>Deadline:</b> {formatDate(campaign.endDate)}</p>
        <p><b>Status:</b> {campaign.status || "-"}</p>
      </div>

      <div className="mt-6">
        {campaign.status === "active" && (
          <button
            onClick={() => apply(campaign.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Now
          </button>
        )}

        {status === "applied" && (
          <p className="text-yellow-600 font-semibold">
            Waiting for approval
          </p>
        )}

        {canSubmitLink && (
          <div>
            <input
              placeholder="Paste posted video URL (YouTube/Instagram)"
              value={postLink}
              onChange={(e) => setPostLink(e.target.value)}
              className="border w-full p-2 rounded mb-2"
            />
            <button
              onClick={() => {
                const value = postLink.trim();
                if (!value) {
                  alert("Please enter the posted video URL.");
                  return;
                }
                submitLink(campaign.id, value);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Video URL
            </button>
          </div>
        )}

        {status === "completed" && (
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">Completed</p>
            {campaign.post_url ? (
              <a
                href={campaign.post_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-blue-600 underline"
              >
                View submitted video link
              </a>
            ) : (
              <p className="text-sm text-gray-500">Video URL not submitted yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}