/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

type ResponseType = {
  id: number;
  influencer: string;
  platforms: string[];
  campaign: string;
  deliverables: string;
  price: string;
  status: "Pending" | "Negotiation" | "Approved" | "Rejected";
};

export default function InfluencerResponsesPage() {
  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [selected, setSelected] = useState<ResponseType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const data = await api.get("/clients/responses"); // ✅ FIXED

      const list = Array.isArray(data)
        ? data
        : data?.data || data?.responses || [];

      const formatted = list.map((item: any) => ({
        id: item.id,
        influencer: item.influencer || "Unknown",
        platforms: item.platforms || [],
        campaign: item.campaign || "",
        deliverables: item.deliverables || "",
        price: item.price ? `₹${item.price}` : "—",
        status: item.status || "Pending",
      }));

      setResponses(formatted);
    } catch (err) {
      console.error("Failed to fetch responses", err);
    } finally {
      setLoading(false);
    }
  };
  const approveInfluencer = async (id: number) => {
    try {
      await api.patch(`/clients/responses/${id}`, { status: "Approved" }); // ✅ FIXED

      setResponses((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "Approved" } : res,
        ),
      );
    } catch (err) {
      console.error("Approve failed", err);
      alert("Failed to approve influencer");
    }
  };

  const rejectInfluencer = async (id: number) => {
  if (!confirm("Are you sure?")) return;

  try {
    await api.patch(`/clients/responses/${id}`, { status: "Rejected" }); // ✅ FIXED

    setResponses((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, status: "Rejected" } : res
      )
    );
  } catch (err) {
    console.error("Reject failed", err);
    alert("Failed to reject influencer");
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
              <th className="p-4">Deliverables</th>
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
                  <td className="p-4">{res.deliverables}</td>
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

      {/* MODAL (UNCHANGED) */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">Influencer Details</h2>

            <p>
              <b>Name:</b> {selected.influencer}
            </p>
            <p>
              <b>Platforms:</b> {selected.platforms.join(", ")}
            </p>
            <p>
              <b>Campaign:</b> {selected.campaign}
            </p>
            <p>
              <b>Deliverables:</b> {selected.deliverables}
            </p>
            <p>
              <b>Price:</b> {selected.price}
            </p>
            <p>
              <b>Status:</b> {selected.status}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}