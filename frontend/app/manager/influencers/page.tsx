/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  //  Modal state
  const [selectedInf, setSelectedInf] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get("/manager/influencers");
      setInfluencers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load influencers", e);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const displayInfluencers = useMemo(() => influencers, [influencers]);

  const handleApprove = async (userId: string) => {
    setBusyId(userId);
    try {
      await api.patch(`/manager/users/${userId}/action`, { action: "approve" });
      await load();
    } catch (e) {
      console.error("Approve failed", e);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setBusyId(userId);
    try {
      await api.patch(`/manager/users/${userId}/action`, { action: "reject" });
      await load();
    } catch (e) {
      console.error("Reject failed", e);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Influencers</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Influencer</th>
              <th className="text-left p-4">Platform</th>
              <th className="text-left p-4">Followers</th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayInfluencers.map((inf) => (
              <tr key={inf.user_id || inf.id} className="border-b hover:bg-gray-50 transition">

                <td className="p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 grid place-items-center text-xs text-gray-500">
                    N/A
                  </div>
                </td>

                <td className="p-4 font-medium">{inf.name}</td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {(inf.platforms && Array.isArray(inf.platforms) && inf.platforms[0]) || "-"}
                  </span>
                </td>

                <td className="p-4 text-gray-500">{inf.followers ?? "-"}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      String(inf.status).toLowerCase() === "active"
                        ? "bg-green-100 text-green-700"
                        : String(inf.status).toLowerCase() === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inf.status}
                  </span>
                </td>

                <td className="p-4 text-center space-x-2">

                  {/*  VIEW BUTTON */}
                  <button
                    onClick={() => {
                      setSelectedInf(inf);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    View
                  </button>

                  {String(inf.status).toLowerCase() !== "active" && (
                    <>
                      <button
                        onClick={() => handleApprove(inf.user_id)}
                        disabled={busyId === inf.user_id}
                        className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-3 py-1 rounded text-xs"
                      >
                        {busyId === inf.user_id ? "..." : "Approve"}
                      </button>

                      <button
                        onClick={() => handleReject(inf.user_id)}
                        disabled={busyId === inf.user_id}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-3 py-1 rounded text-xs"
                      >
                        {busyId === inf.user_id ? "..." : "Reject"}
                      </button>
                    </>
                  )}

                  {String(inf.status).toLowerCase() === "active" && (
                    <button
                      onClick={() => handleReject(inf.user_id)}
                      disabled={busyId === inf.user_id}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-3 py-1 rounded text-xs"
                    >
                      {busyId === inf.user_id ? "..." : "Reject"}
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* POPUP MODAL */}
      {isModalOpen && selectedInf && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="float-right text-lg"
            >
              ✖
            </button>

            <div className="text-center mb-4">
              <h2 className="font-bold text-lg">{selectedInf.name}</h2>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>Email:</strong> {selectedInf.email}</p>
              <p><strong>Category:</strong> {selectedInf.category || "-"}</p>
              <p><strong>Platforms:</strong> {(selectedInf.platforms || []).join(", ") || "-"}</p>
              <p><strong>Followers:</strong> {selectedInf.followers ?? "-"}</p>
              <p><strong>Engagement:</strong> {selectedInf.engagement_rate ?? "-"}</p>
              <p><strong>Active campaigns:</strong> {selectedInf.active_campaigns ?? "-"}</p>
              <p><strong>Status:</strong> {selectedInf.status}</p>
            </div>

          </div>
        </div>
      )}

      {!loading && displayInfluencers.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No influencers found.</p>
      )}

    </div>
  );
}