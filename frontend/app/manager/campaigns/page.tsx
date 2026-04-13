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
      <h2 className="text-2xl font-bold mb-6">
        Campaign Management
      </h2>

      {/*Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{camp.campaign_name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Brand: {camp.brand_name || "-"}
            </p>

            <span
              className={`text-xs px-3 py-1 rounded-full
                ${
                  String(camp.status).toLowerCase() === "assigned"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {camp.status}
            </span>

            {camp.influencer_id && (
              <p className="text-sm mt-2 text-gray-600">
                Influencer: Assigned
              </p>
            )}

            <button
              onClick={() => setSelectedCampaign(camp)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Assign Influencer
            </button>
          </div>
        ))}
      </div>

      {/*Assign Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              Assign Influencer
            </h3>

            <p className="text-sm mb-3">
              Campaign:{" "}
              <span className="font-medium">
                {(selectedCampaign as any).campaign_name}
              </span>
            </p>

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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAssign}
                disabled={busyId === String((selectedCampaign as any).id)}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              >
                {busyId === String((selectedCampaign as any).id) ? "Assigning..." : "Assign"}
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