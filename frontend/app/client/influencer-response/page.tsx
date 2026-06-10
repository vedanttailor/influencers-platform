/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

type ResponseType = {
  id: number;
  influencer: string;
  platforms: string[];
  campaign: string;
  price: string;
  status: "Pending" | "Negotiation" | "Approved" | "Rejected";

  influencer_email?: string;
  influencer_phone?: string;
  profile_url?: string;
  followers_count?: string;
  profile_img?: string;
  instagram_url?: string;
  youtube_url?: string;
};

export default function InfluencerResponsesPage() {
  const [responses, setResponses] = useState<ResponseType[]>([]);

  const [selected, setSelected] = useState<ResponseType | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const data = await api.get("/clients/responses");

      const list = Array.isArray(data)
        ? data
        : data?.data || data?.responses || [];

      const formatted = list.map((item: any) => ({
        id: item.id,

        influencer: item.influencer || "Unknown",

        platforms: item.platforms || [],

        campaign: item.campaign || "",

        price: item.price ? `₹${item.price}` : "—",

        status: item.status || "Pending",

        influencer_email: item.influencer_email || "",

        influencer_phone: item.influencer_phone || "",

        profile_url: item.profile_url || "",

        followers_count: item.followers_count || "",

        profile_img: item.profile_img || "",
        instagram_url: item.instagram_url || "",
        youtube_url: item.youtube_url || "",
      }));

      setResponses(formatted);
    } catch (err) {
      console.error("Failed to fetch responses", err);
    } finally {
      setLoading(false);
    }
  };

  // APPROVE
  const approveInfluencer = async (id: number) => {
    try {
      await api.patch(`/clients/responses/${id}`, {
        status: "Approved",
      });

      setResponses((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "Approved" } : res,
        ),
      );

      toast.success("Influencer approved");
    } catch (err) {
      console.error("Approve failed", err);

      toast.error("Failed to approve influencer");
    }
  };

  // REJECT
  const rejectInfluencer = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await api.patch(`/clients/responses/${id}`, {
        status: "Rejected",
      });

      setResponses((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "Rejected" } : res,
        ),
      );

      toast.success("Influencer rejected");
    } catch (err) {
      console.error("Reject failed", err);

      toast.error("Failed to reject influencer");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Influencer Responses</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Influencer</th>

              <th className="p-4">Platforms</th>

              <th className="p-4">Campaign</th>

              <th className="p-4">Price</th>

              <th className="p-4">Status</th>

              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {responses.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No responses found
                </td>
              </tr>
            ) : (
              responses.map((res) => (
                <tr key={res.id} className="border-t">
                  <td className="p-4 font-medium">{res.influencer}</td>

                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      {res.platforms.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">{res.campaign}</td>

                  <td className="p-4 font-medium">{res.price}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        res.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : res.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : res.status === "Negotiation"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2 w-[120px]">
                      <button
                        onClick={() => setSelected(res)}
                        className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100"
                      >
                        View
                      </button>

                      <button
                        disabled={res.status === "Approved"}
                        onClick={() => approveInfluencer(res.id)}
                        className={`px-3 py-1.5 text-sm rounded-md ${
                          res.status === "Approved"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                      >
                        Approve
                      </button>

                      <button
                        disabled={res.status === "Rejected"}
                        onClick={() => rejectInfluencer(res.id)}
                        className={`px-3 py-1.5 text-sm rounded-md ${
                          res.status === "Rejected"
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border border-red-300 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* PROFILE IMAGE */}
            <div className="flex justify-center mb-4">
              <img
                src={selected.profile_img || "/avatar.png"}
                alt="profile"
                onClick={() =>
                  setPreviewImage(selected.profile_img || "/avatar.png")
                }
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 cursor-pointer hover:scale-105 transition duration-300"
              />
            </div>

            {/* NAME */}
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold">{selected.influencer}</h2>

              <p className="text-gray-500 text-sm">Influencer Profile</p>
            </div>

            {/* DETAILS */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Email</span>

                <span className="text-gray-600 text-right">
                  {selected.influencer_email || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Phone</span>

                <span className="text-gray-600">
                  {selected.influencer_phone || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Instagram</span>

                {selected.instagram_url ? (
                  <a
                    href={
                      selected.instagram_url.startsWith("http")
                        ? selected.instagram_url
                        : `https://${selected.instagram_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span className="text-gray-400">Not Added</span>
                )}
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">YouTube</span>

                {selected.youtube_url ? (
                  <a
                    href={
                      selected.youtube_url.startsWith("http")
                        ? selected.youtube_url
                        : `https://${selected.youtube_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 underline"
                  >
                    View Channel
                  </a>
                ) : (
                  <span className="text-gray-400">Not Added</span>
                )}
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Campaign</span>

                <span className="text-gray-600 text-right">
                  {selected.campaign}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Platforms</span>

                <span className="text-gray-600 text-right">
                  {selected.platforms.join(", ")}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Price</span>

                <span className="text-gray-600">{selected.price}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Status</span>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selected.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : selected.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              {/* PROFILE LINK */}
              {selected.profile_url && (
                <a
                  href={selected.profile_url}
                  target="_blank"
                  className="block w-full text-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Social Profile
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* BIG IMAGE PREVIEW */}
      {/* ========================= */}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[95%] max-h-[95%] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
