/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
import { useCampaignStore } from "@/lib/useCampaignStore";
import { useState } from "react";

export default function CampaignDetail() {
  const { id }: any = useParams();
  const { campaigns, apply, submitLink } = useCampaignStore();

  const campaign = campaigns.find((c: any) => c.id == id);
  const [postLink, setPostLink] = useState("");

  if (!campaign) return <p>Not found</p>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-2">
        {campaign.title}
      </h1>

      <p className="text-gray-500">{campaign.client}</p>

      <div className="mt-4 space-y-2">
        <p><b>Platform:</b> {campaign.platform}</p>
        <p><b>Budget:</b> ₹{campaign.budget}</p>
        <p><b>Description:</b> {campaign.description}</p>
        <p><b>Guidelines:</b> {campaign.guidelines}</p>
        <p><b>Hashtags:</b> {campaign.hashtags.join(", ")}</p>
        <p><b>Deadline:</b> {campaign.endDate}</p>
      </div>

      <div className="mt-6">
        {campaign.status === "available" && (
          <button
            onClick={() => apply(campaign.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Now
          </button>
        )}

        {campaign.status === "applied" && (
          <p className="text-yellow-600 font-semibold">
            Waiting for admin approval
          </p>
        )}

        {campaign.status === "accepted" && (
          <div>
            <input
              placeholder="Paste your post link"
              value={postLink}
              onChange={e => setPostLink(e.target.value)}
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
            Campaign completed
          </p>
        )}
      </div>
    </div>
  );
}
