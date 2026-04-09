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

  if (!campaign) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold">{campaign.title}</h1>
      <p className="text-gray-500">{campaign.client}</p>

      <div className="mt-4 space-y-2 text-sm">
        <p><b>Platform:</b> {campaign.platform}</p>
        <p><b>Budget:</b> ₹{campaign.budget}</p>
        <p><b>Deadline:</b> {campaign.endDate}</p>
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

        {campaign.status === "applied" && (
          <p className="text-yellow-600 font-semibold">
            Waiting for approval
          </p>
        )}

        {campaign.status === "accepted" && (
          <div>
            <input
              placeholder="Paste post link"
              value={postLink}
              onChange={(e) => setPostLink(e.target.value)}
              className="border w-full p-2 rounded mb-2"
            />
            <button
              onClick={() => submitLink(campaign.id, postLink)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Link
            </button>
          </div>
        )}

        {campaign.status === "completed" && (
          <p className="text-green-600 font-semibold">
            Completed
          </p>
        )}
      </div>
    </div>
  );
}