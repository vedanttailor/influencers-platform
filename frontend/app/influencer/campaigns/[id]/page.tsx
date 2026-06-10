/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCampaignStore } from "@/lib/useCampaignStore";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function CampaignDetail() {
  const { id }: any = useParams();

  const router = useRouter();

  const { campaigns, apply, submitLink, fetchCampaigns } =
    useCampaignStore() as {
      campaigns: any[];
      apply: (id: string) => void;
      submitLink: (id: string, link: any) => void;
      fetchCampaigns: () => void;
    };

  const [postLinks, setPostLinks] = useState({
    instagram: [""],
    youtube: [""],
  });

  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!campaigns.length) {
      fetchCampaigns();
    }
  }, []);

  const campaign = campaigns.find((c: any) => String(c.id) === String(id));

  useEffect(() => {
  if (campaign?.post_url) {
    setPostLinks({
      instagram:
        campaign.post_url.instagram?.length > 0
          ? campaign.post_url.instagram
          : [""],

      youtube:
        campaign.post_url.youtube?.length > 0
          ? campaign.post_url.youtube
          : [""],
    });
  }
}, [campaign]);

  const status = String(localStatus || campaign?.status || "").toLowerCase();

  const canSubmitLink = [
    "accepted",
    "assigned",
    "applied",
    "active",
    "completed",
  ].includes(status);

  const formatDate = (value: any) => {
    if (!value) return "-";

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-black to-gray-800 h-44">
          <button
            onClick={() => router.push("/Influencer/campaigns")}
            className="absolute top-4 left-4 text-white hover:underline"
          >
            ← Back
          </button>

          {/* LOGO */}
          <div className="absolute -bottom-14 left-8">
            <img
              src={campaign.logo || "/avatar.png"}
              alt="brand"
              onClick={() => setPreviewImage(campaign.logo || "/avatar.png")}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg cursor-pointer hover:scale-105 transition"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-20 px-8 pb-8">
          {/* TITLE */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {campaign.title ||
                  campaign.campaign_name ||
                  "Untitled Campaign"}
              </h1>

              <p className="text-gray-500 mt-1">
                {campaign.client || campaign.brand_name || "Brand"}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                status === "completed"
                  ? "bg-green-100 text-green-700"
                  : status === "applied"
                    ? "bg-yellow-100 text-yellow-700"
                    : status === "accepted"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
              }`}
            >
              {status || "-"}
            </span>
          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {/* LEFT */}
            <div className="border rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-4">Campaign Details</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Platform</span>

                  <span>
                    {Array.isArray(campaign.platforms)
                      ? campaign.platforms.join(", ")
                      : campaign.platform || "-"}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Budget</span>

                  <span>₹{Number(campaign.budget || 0).toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Deadline</span>

                  <span>
                    {formatDate(campaign.endDate || campaign.end_date)}
                  </span>
                </div>

              </div>
            </div>

            {/* RIGHT */}
            <div className="border rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-4">Brand Information</h2>

              <div className="space-y-3 text-sm">
                <div className="border-b pb-2">
                  <span className="font-semibold">Description</span>

                  <p className="text-gray-600 mt-1">
                    {campaign.description || "-"}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <span className="font-semibold">Website</span>

                  <a
                    href={
                      campaign.company_url
                        ? campaign.company_url.startsWith("http")
                          ? campaign.company_url
                          : `https://${campaign.company_url}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline mt-1"
                  >
                    {campaign.company_url || "N/A"}
                  </a>
                </div>

                {campaign.client_email && (
                  <div className="border-b pb-2">
                    <span className="font-semibold">Client Email</span>

                    <p className="mt-1">{campaign.client_email}</p>
                  </div>
                )}

                {campaign.client_phone && (
                  <div className="border-b pb-2">
                    <span className="font-semibold">Client Mobile</span>

                    <p className="mt-1">{campaign.client_phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8">
            {status === "active" && (
              <button
                onClick={() => {
                  apply(campaign.id);

                  setLocalStatus("applied");

                  toast.success("Applied Successfully");
                }}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
              >
                Apply Now
              </button>
            )}

            {status === "applied" && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
                Waiting for client approval
              </div>
            )}

            {canSubmitLink && (
              <div className="space-y-6 mt-4">
                {/* INSTAGRAM URLS */}
                {(Array.isArray(campaign.platforms)
                  ? campaign.platforms
                  : [campaign.platform]
                ).includes("Instagram") && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">
                      Instagram Reel URLs
                    </h3>

                    {postLinks.instagram.map((link: string, index: number) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder={`Instagram URL ${index + 1}`}
                          value={link}
                          onChange={(e) => {
                            const updated = [...postLinks.instagram];

                            updated[index] = e.target.value;

                            setPostLinks((prev: any) => ({
                              ...prev,
                              instagram: updated,
                            }));
                          }}
                          className="border w-full p-3 rounded-xl"
                        />

                        {index > 0 && (
                          <button
                            onClick={() => {
                              const updated = postLinks.instagram.filter(
                                (_: any, i: number) => i !== index,
                              );

                              setPostLinks((prev: any) => ({
                                ...prev,
                                instagram: updated,
                              }));
                            }}
                            className="bg-red-500 text-white px-4 rounded-xl"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        setPostLinks((prev: any) => ({
                          ...prev,
                          instagram: [...prev.instagram, ""],
                        }))
                      }
                      className="bg-pink-100 text-pink-700 px-4 py-2 rounded-xl"
                    >
                      + Add Instagram URL
                    </button>
                  </div>
                )}

                {/* YOUTUBE URLS */}
                {(Array.isArray(campaign.platforms)
                  ? campaign.platforms
                  : [campaign.platform]
                ).includes("YouTube") && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">
                      YouTube Video URLs
                    </h3>

                    {postLinks.youtube.map((link: string, index: number) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder={`YouTube URL ${index + 1}`}
                          value={link}
                          onChange={(e) => {
                            const updated = [...postLinks.youtube];

                            updated[index] = e.target.value;

                            setPostLinks((prev: any) => ({
                              ...prev,
                              youtube: updated,
                            }));
                          }}
                          className="border w-full p-3 rounded-xl"
                        />

                        {index > 0 && (
                          <button
                            onClick={() => {
                              const updated = postLinks.youtube.filter(
                                (_: any, i: number) => i !== index,
                              );

                              setPostLinks((prev: any) => ({
                                ...prev,
                                youtube: updated,
                              }));
                            }}
                            className="bg-red-500 text-white px-4 rounded-xl"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        setPostLinks((prev: any) => ({
                          ...prev,
                          youtube: [...prev.youtube, ""],
                        }))
                      }
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-xl"
                    >
                      + Add YouTube URL
                    </button>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  onClick={async () => {
                    try {
                      const instagramLinks = postLinks.instagram.filter(
                        (link) => link.trim() !== "",
                      );

                      const youtubeLinks = postLinks.youtube.filter(
                        (link) => link.trim() !== "",
                      );

                      if (
                        instagramLinks.length === 0 &&
                        youtubeLinks.length === 0
                      ) {
                        toast.error("Please enter at least one URL");
                        return;
                      }

                      const response = await api.patch(
                        `/influencer/submit/${id}`,
                        {
                          instagram_url: instagramLinks,
                          youtube_url: youtubeLinks,
                        },
                      );

                      console.log("Submit Response:", response);

                      toast.success("Links updated successfully");

                      await fetchCampaigns();
                    } catch (error: any) {
                      console.error(error);
                      toast.error(error.message || "Submit failed");
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
                >
                   {status === "completed"
                    ? "Update Video URLs"
                    : "Submit Video URLs"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[95%] max-h-[95%] rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
