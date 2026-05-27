/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function CampaignDetail() {

  const params = useParams();

const id =
  typeof params?.id === "string"
    ? params.id
    : Array.isArray(params?.id)
    ? params.id[0]
    : "";

  const router = useRouter();

  const [campaign, setCampaign] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [previewImage, setPreviewImage] =
    useState<string | null>(null);

  const [localStatus, setLocalStatus] =
    useState<string | null>(null);

  const [postLinks, setPostLinks] =
    useState({
      instagram: [""],
      youtube: [""],
    });

  // =========================
  // FETCH CAMPAIGN
  // =========================

  useEffect(() => {

    if (id && id !== "undefined") {
  fetchCampaign();
}

  }, [id]);

  const fetchCampaign = async () => {

    try {

      setLoading(true);

      const res = await api.get(
  `/campaigns/${String(id).trim()}`
);

      console.log("CAMPAIGN RESPONSE:", res.data);

      setCampaign(res.data);

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Failed to load campaign"
      );

      setCampaign(null);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // APPLY CAMPAIGN
  // =========================

  const applyCampaign = async () => {

    try {

      await api.post(
        "/influencer/apply",
        {
          campaign_id: id,
        }
      );

      setLocalStatus("applied");

      toast.success(
        "Applied Successfully"
      );

      fetchCampaign();

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Apply failed"
      );
    }
  };

  // =========================
  // SUBMIT LINKS
  // =========================

  const submitLinks = async () => {

    try {

      const instagramLink =
        postLinks.instagram
          .filter(
            (link) =>
              link.trim() !== ""
          )
          .join(",");

      const youtubeLink =
        postLinks.youtube
          .filter(
            (link) =>
              link.trim() !== ""
          )
          .join(",");

      if (
        !instagramLink &&
        !youtubeLink
      ) {

        toast.error(
          "Please enter at least one link"
        );

        return;
      }

      await api.patch(
        `/influencer/submit/${id}`,
        {
          instagram_url:
            instagramLink,

          youtube_url:
            youtubeLink,
        }
      );

      toast.success(
        "Links submitted successfully"
      );

      setLocalStatus("completed");

      fetchCampaign();

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Submit failed"
      );
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    value: any
  ) => {

    if (!value) return "-";

    const d = new Date(value);

    if (isNaN(d.getTime()))
      return "-";

    return d.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const status = String(
    localStatus ||
    campaign?.status ||
    ""
  ).toLowerCase();

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">
          Loading...
        </p>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!campaign) {

    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-semibold">
          Campaign not found
        </p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}

        <div className="relative bg-gradient-to-r from-black to-gray-800 h-44">

          <button
            onClick={() =>
              router.push(
                "/Influencer/campaigns"
              )
            }
            className="absolute top-4 left-4 text-white"
          >
            ← Back
          </button>

          <div className="absolute -bottom-14 left-8">

            <img
              src={
                campaign.logo ||
                "/avatar.png"
              }
              alt="brand"
              onClick={() =>
                setPreviewImage(
                  campaign.logo ||
                  "/avatar.png"
                )
              }
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg cursor-pointer"
            />
          </div>
        </div>

        {/* CONTENT */}

        <div className="pt-20 px-8 pb-8">

          {/* TITLE */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>

              <h1 className="text-3xl font-bold">
                {campaign.campaign_name}
              </h1>

              <p className="text-gray-500 mt-1">
                {campaign.brand_name}
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
              {status || "active"}
            </span>
          </div>

          {/* DETAILS */}

          <div className="grid md:grid-cols-2 gap-5 mt-8">

            {/* LEFT */}

            <div className="border rounded-2xl p-5">

              <h2 className="font-bold text-lg mb-4">
                Campaign Details
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between border-b pb-2">

                  <span className="font-semibold">
                    Platform
                  </span>

                  <span className="text-right">
                    {Array.isArray(
                      campaign.platforms
                    )
                      ? campaign.platforms.join(", ")
                      : "-"}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">

                  <span className="font-semibold">
                    Budget
                  </span>

                  <span>
                    ₹
                    {Number(
                      campaign.budget || 0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">

                  <span className="font-semibold">
                    Deadline
                  </span>

                  <span>
                    {formatDate(
                      campaign.end_date
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="border rounded-2xl p-5">

              <h2 className="font-bold text-lg mb-4">
                Brand Information
              </h2>

              <div className="space-y-4">

                <div className="border-b pb-2">

                  <span className="font-semibold">
                    Description
                  </span>

                  <p className="mt-1 text-gray-600">
                    {campaign.description}
                  </p>
                </div>

                <div className="border-b pb-2">

                  <span className="font-semibold">
                    Website
                  </span>

                  <a
                    href={
                      campaign.company_url?.startsWith("http")
                        ? campaign.company_url
                        : `https://${campaign.company_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline mt-1 break-all"
                  >
                    {campaign.company_url}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* APPLY BUTTON */}

          {status === "active" && (

            <button
              onClick={applyCampaign}
              className="mt-8 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
            >
              Apply Now
            </button>
          )}

          {/* APPLIED */}

          {status === "applied" && (

            <div className="mt-8 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
              Waiting for client approval
            </div>
          )}

          {/* ACCEPTED */}

          {status === "accepted" && (

            <div className="space-y-6 mt-8">

              {campaign.platforms?.includes(
                "Instagram"
              ) && (

                <div>

                  <h3 className="font-semibold mb-3">
                    Instagram Reel Links
                  </h3>

                  {postLinks.instagram.map(
                    (link, index) => (

                      <input
                        key={index}
                        type="text"
                        placeholder={`Instagram Reel URL ${index + 1}`}
                        value={link}
                        onChange={(e) => {

                          const updated = [
                            ...postLinks.instagram,
                          ];

                          updated[index] =
                            e.target.value;

                          setPostLinks(
                            (prev) => ({
                              ...prev,
                              instagram:
                                updated,
                            })
                          );
                        }}
                        className="border w-full p-3 rounded-xl mb-3"
                      />
                    )
                  )}

                  <button
                    onClick={() =>
                      setPostLinks(
                        (prev) => ({
                          ...prev,
                          instagram: [
                            ...prev.instagram,
                            "",
                          ],
                        })
                      )
                    }
                    className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg"
                  >
                    + Add Instagram Link
                  </button>
                </div>
              )}

              {campaign.platforms?.includes(
                "YouTube"
              ) && (

                <div>

                  <h3 className="font-semibold mb-3">
                    YouTube Video Links
                  </h3>

                  {postLinks.youtube.map(
                    (link, index) => (

                      <input
                        key={index}
                        type="text"
                        placeholder={`YouTube URL ${index + 1}`}
                        value={link}
                        onChange={(e) => {

                          const updated = [
                            ...postLinks.youtube,
                          ];

                          updated[index] =
                            e.target.value;

                          setPostLinks(
                            (prev) => ({
                              ...prev,
                              youtube:
                                updated,
                            })
                          );
                        }}
                        className="border w-full p-3 rounded-xl mb-3"
                      />
                    )
                  )}

                  <button
                    onClick={() =>
                      setPostLinks(
                        (prev) => ({
                          ...prev,
                          youtube: [
                            ...prev.youtube,
                            "",
                          ],
                        })
                      )
                    }
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg"
                  >
                    + Add YouTube Link
                  </button>
                </div>
              )}

              <button
                onClick={submitLinks}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                Submit Video URLs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* IMAGE PREVIEW */}

      {previewImage && (

        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() =>
            setPreviewImage(null)
          }
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