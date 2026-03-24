"use client";

import { useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Sale",
      client: "Nike",
      status: "Available",
    },
    {
      id: 2,
      name: "Winter Launch",
      client: "Adidas",
      status: "Available",
    },
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [influencer, setInfluencer] = useState("");

  const handleAssign = () => {
    if (!influencer) return;

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === selectedCampaign.id
          ? { ...c, influencer, status: "Assigned" }
          : c
      )
    );

    setSelectedCampaign(null);
    setInfluencer("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Campaign Management
      </h2>

      {/*Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{camp.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Client: {camp.client}
            </p>

            <span
              className={`text-xs px-3 py-1 rounded-full
                ${
                  camp.status === "Assigned"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {camp.status}
            </span>

            {camp.influencer && (
              <p className="text-sm mt-2 text-gray-600">
                Influencer: {camp.influencer}
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
                {selectedCampaign.name}
              </span>
            </p>

            <select
              value={influencer}
              onChange={(e) => setInfluencer(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select Influencer</option>
              <option>John Doe</option>
              <option>Emma Watson</option>
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
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}