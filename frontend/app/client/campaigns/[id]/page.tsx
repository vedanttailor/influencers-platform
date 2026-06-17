/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import PaymentButton from "@/components/PaymentButton";

type CampaignStatus = "active" | "completed" | "pending";

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const data = await api.get(`/campaigns/${id}`);

      console.log("FULL DATA =", data);
      console.log("POST_URL =", data.post_url);
      console.log("TYPE =", typeof data.post_url);

      setCampaign(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCampaign = async () => {
    const result = await Swal.fire({
      title: "Delete Campaign?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/campaigns/${id}`);

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Campaign deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/client/campaigns");
    } catch (err) {
      console.error("Delete failed", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete campaign.",
      });
    }
  };

  const completeCampaign = async () => {
    const result = await Swal.fire({
      title: "Complete Campaign?",
      text: "This will mark the campaign as completed.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Complete",
      confirmButtonColor: "#16a34a",
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`/campaigns/${id}`, {
        status: "completed",
      });

      setCampaign((prev: any) => ({
        ...prev,
        status: "completed",
      }));

      await Swal.fire({
        icon: "success",
        title: "Campaign Completed",
        text: "Campaign has been marked as completed.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Update failed", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update campaign.",
      });
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
          <p>Budget: ₹{Number(campaign.budget || 0).toLocaleString("en-IN")}</p>
          <p>
            Start:{" "}
            {campaign.start_date
              ? new Date(campaign.start_date).toLocaleDateString("en-IN")
              : "-"}
          </p>

          <p>
            End:{" "}
            {campaign.end_date
              ? new Date(campaign.end_date).toLocaleDateString("en-IN")
              : "-"}
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {/* Normalize post_url */}

          {(() => {
            let postUrl: any = campaign.post_url;

            if (typeof postUrl === "string") {
              try {
                postUrl = JSON.parse(postUrl);
              } catch {
                postUrl = {};
              }
            }

            const youtubeLinks = Array.isArray(postUrl?.youtube)
              ? postUrl.youtube
              : postUrl?.youtube
                ? [postUrl.youtube]
                : [];

            const instagramLinks = Array.isArray(postUrl?.instagram)
              ? postUrl.instagram
              : postUrl?.instagram
                ? [postUrl.instagram]
                : [];

            return (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Influencer Submitted Video
                </p>

                {youtubeLinks.length > 0 || instagramLinks.length > 0 ? (
                  <div className="mt-3 space-y-5">
                    {/* Instagram */}

                    {instagramLinks.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-pink-600 mb-2">
                          Instagram Links
                        </h4>

                        {instagramLinks.map((link: string, index: number) => (
                          <div key={index} className="mb-2">
                            <p className="text-sm font-medium">
                              Link {index + 1}
                            </p>

                            <a
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="
                        text-blue-600
                        underline
                        break-all
                        text-sm
                      "
                            >
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Youtube */}

                    {youtubeLinks.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">
                          YouTube Links
                        </h4>

                        {youtubeLinks.map((link: string, index: number) => (
                          <div key={index} className="mb-2">
                            <p className="text-sm font-medium">
                              Link {index + 1}
                            </p>

                            <a
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="
                        text-blue-600
                        underline
                        break-all
                        text-sm
                      "
                            >
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Not submitted yet by influencer.
                  </p>
                )}
              </div>
            );
          })()}
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
          <button
            onClick={deleteCampaign}
            className="
              px-4
              py-2
              border
              border-red-500
              text-red-600
              rounded-lg
              hover:bg-red-50
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
