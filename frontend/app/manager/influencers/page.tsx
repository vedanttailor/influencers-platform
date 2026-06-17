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
  const [showImagePreview, setShowImagePreview] = useState(false);

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
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayInfluencers.map((inf) => (
              <tr
                key={inf.user_id || inf.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  {inf.profile_img ? (
                    <img
                      src={inf.profile_img}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 grid place-items-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </td>

                <td className="p-4 font-medium">{inf.name}</td>

                <td className="p-4 text-gray-500">{inf.email}</td>

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

      {/* VIEW INFLUENCER MODAL */}
      {isModalOpen && selectedInf && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => {
            setIsModalOpen(false);
            setShowImagePreview(false);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setShowImagePreview(false);
              }}
              className="float-right text-xl font-bold text-gray-600 hover:text-red-500"
            >
              ✖
            </button>

            <div className="text-center mb-6">
              {selectedInf.profile_img && (
                <img
                  src={selectedInf.profile_img}
                  alt={selectedInf.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImagePreview(true);
                  }}
                  className="w-24 h-24 mx-auto mb-3 object-cover border rounded-full cursor-pointer hover:scale-110 transition duration-300"
                />
              )}

              <h2 className="text-xl font-bold">{selectedInf.name}</h2>
              <p className="text-gray-500">Influencer Information</p>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3 w-1/3">Name</td>
                    <td className="p-3">{selectedInf.name}</td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Email</td>
                    <td className="p-3">{selectedInf.email}</td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Contact Number
                    </td>
                    <td className="p-3">
                      {selectedInf.phone || selectedInf.mobile || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Category</td>
                    <td className="p-3">{selectedInf.category || "-"}</td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Platforms</td>
                    <td className="p-3">
                      {(selectedInf.platforms || []).join(", ") || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Followers</td>
                    <td className="p-3">
                      {selectedInf.followers?.toLocaleString() || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Engagement Rate
                    </td>
                    <td className="p-3">
                      {selectedInf.engagement_rate ?? "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Active Campaigns
                    </td>
                    <td className="p-3">{selectedInf.active_campaigns ?? 0}</td>
                  </tr>

                  <tr>
                    <td className="bg-gray-50 font-semibold p-3">Status</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedInf.status === "active"
                            ? "bg-green-100 text-green-700"
                            : selectedInf.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedInf.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showImagePreview && selectedInf?.profile_img && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999]"
          onClick={() => setShowImagePreview(false)}
        >
          <button
            className="absolute top-5 right-5 text-white text-4xl font-bold"
            onClick={(e) => {
              e.stopPropagation();
              setShowImagePreview(false);
            }}
          >
            ✕
          </button>

          <img
            src={selectedInf.profile_img}
            alt={selectedInf.name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
      {!loading && displayInfluencers.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No influencers found.</p>
      )}
    </div>
  );
}
