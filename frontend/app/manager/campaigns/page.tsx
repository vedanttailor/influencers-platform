/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [influencer, setInfluencer] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [camps, infs] = await Promise.all([
        api.get("/manager/campaigns"),
        api.get("/manager/influencers"),
      ]);
      setCampaigns(Array.isArray(camps) ? camps : []);
      setInfluencers(Array.isArray(infs) ? infs : []);
    } catch (e) {
      console.error("Failed to load campaigns", e);
      setCampaigns([]);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const displayCampaigns = useMemo(() => campaigns, [campaigns]);

  const handleAssign = async () => {
    if (!influencer || !selectedCampaign) return;

    const campaignId = String((selectedCampaign as any).id);
    setBusyId(campaignId);
    try {
      await api.patch(`/manager/campaigns/${campaignId}/assign`, {
        influencer_user_id: influencer,
      });
      await load();
      setSelectedCampaign(null);
      setInfluencer("");
    } catch (e) {
      console.error("Assign failed", e);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Campaign Management</h2>

      {/*Campaign Cards */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-4">Logo</th>
              <th className="text-left p-4">Campaign</th>
              <th className="text-left p-4">Brand</th>
              <th className="text-left p-4">Budget</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Influencer</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayCampaigns.map((camp) => (
              <tr
                key={camp.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  {camp.logo ? (
                    <img
                      src={camp.logo}
                      alt={camp.campaign_name}
                      className="w-12 h-12 object-contain rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      N/A
                    </div>
                  )}
                </td>

                <td className="p-4 font-medium">{camp.campaign_name}</td>

                <td className="p-4">{camp.brand_name || "-"}</td>

                <td className="p-4">
                  ₹{Number(camp.budget || 0).toLocaleString()}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      camp.status?.toLowerCase() === "active"
                        ? "bg-green-100 text-green-700"
                        : camp.status?.toLowerCase() === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {camp.status}
                  </span>
                </td>

                <td className="p-4">
                  {camp.influencer_name || "Not Assigned"}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedCampaign(camp);
                      setInfluencer(camp.influencer_id || "");
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Assign Modal */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCampaign(null)}
              className="float-right text-xl font-bold"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-6">Campaign Details</h2>

            {(selectedCampaign as any).logo && (
              <div className="flex justify-center mb-6">
                <img
                  src={(selectedCampaign as any).logo}
                  alt="Campaign Logo"
                  className="w-28 h-28 object-contain border rounded-xl shadow-sm cursor-pointer hover:scale-105 transition"
                />
              </div>
            )}
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3 w-1/3">
                      Campaign Name
                    </td>
                    <td className="p-3">
                      {(selectedCampaign as any).campaign_name}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Brand Name</td>
                    <td className="p-3">
                      {(selectedCampaign as any).brand_name || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Budget</td>
                    <td className="p-3">
                      ₹
                      {Number(
                        (selectedCampaign as any).budget || 0,
                      ).toLocaleString()}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Status</td>
                    <td className="p-3">{(selectedCampaign as any).status}</td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Platforms</td>
                    <td className="p-3">
                      {((selectedCampaign as any).platforms || []).join(", ") ||
                        "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Start Date</td>
                    <td className="p-3">
                      {(selectedCampaign as any).start_date
                        ? new Date(
                            (selectedCampaign as any).start_date,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">End Date</td>
                    <td className="p-3">
                      {(selectedCampaign as any).end_date
                        ? new Date(
                            (selectedCampaign as any).end_date,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Description
                    </td>
                    <td className="p-3">
                      {(selectedCampaign as any).description || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Company URL
                    </td>
                    <td className="p-3">
                      {(selectedCampaign as any).company_url || "-"}
                    </td>
                  </tr>

                  <tr>
                    <td className="bg-gray-50 font-semibold p-3">
                      Assigned Influencer
                    </td>
                    <td className="p-3">
                      {influencers.find(
                        (i) =>
                          i.user_id === (selectedCampaign as any).influencer_id,
                      )?.name || "Not Assigned"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold mb-3">Assign Influencer</h3>

              <select
                value={influencer}
                onChange={(e) => setInfluencer(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              >
                <option value="">Select Influencer</option>

                {influencers.map((inf) => (
                  <option key={inf.user_id} value={inf.user_id}>
                    {inf.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssign}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Assign Influencer
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && displayCampaigns.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No campaigns found.</p>
      )}
    </div>
  );
}
