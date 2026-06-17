/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get("/manager/clients");
      console.log("CLIENT DATA:", data);
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load clients", e);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const displayClients = useMemo(() => clients, [clients]);

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
      <h2 className="text-2xl font-bold mb-6">Clients</h2>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-4">Logo</th>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-center p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayClients.map((client) => (
              <tr
                key={client.user_id || client.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-10 h-10 object-contain rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 grid place-items-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </td>

                <td className="p-4 font-medium">{client.name}</td>

                <td className="p-4 text-gray-500">{client.email}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      String(client.status).toLowerCase() === "active"
                        ? "bg-green-100 text-green-700"
                        : String(client.status).toLowerCase() === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>

                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    View
                  </button>

                  {String(client.status).toLowerCase() !== "active" && (
                    <>
                      <button
                        onClick={() => handleApprove(client.user_id)}
                        disabled={busyId === client.user_id}
                        className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-3 py-1 rounded text-xs"
                      >
                        {busyId === client.user_id ? "..." : "Approve"}
                      </button>

                      <button
                        onClick={() => handleReject(client.user_id)}
                        disabled={busyId === client.user_id}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-3 py-1 rounded text-xs"
                      >
                        {busyId === client.user_id ? "..." : "Reject"}
                      </button>
                    </>
                  )}

                  {String(client.status).toLowerCase() === "active" && (
                    <button
                      onClick={() => handleReject(client.user_id)}
                      disabled={busyId === client.user_id}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-3 py-1 rounded text-xs"
                    >
                      {busyId === client.user_id ? "..." : "Reject"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedClient && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="float-right text-xl font-bold text-gray-600 hover:text-red-500"
            >
              ✖
            </button>

            <div className="text-center mb-6">
              {selectedClient.logo && (
                <img
                  src={selectedClient.logo}
                  alt={selectedClient.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImagePreview(true);
                  }}
                  className="w-24 h-24 mx-auto mb-3 object-contain border rounded-lg cursor-pointer hover:scale-110 transition duration-300"
                />
              )}

              <h2 className="text-xl font-bold">{selectedClient.name}</h2>

              <p className="text-gray-500">Client Information</p>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3 w-1/3">Name</td>
                    <td className="p-3">{selectedClient.name}</td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">Email</td>
                    <td className="p-3">{selectedClient.email}</td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Contact Number
                    </td>
                    <td className="p-3">
                      {selectedClient.phone || selectedClient.mobile || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Company Name
                    </td>
                    <td className="p-3">
                      {selectedClient.company_name || "-"}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Total Campaigns
                    </td>
                    <td className="p-3">
                      {selectedClient.total_campaigns ?? 0}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Active Campaigns
                    </td>
                    <td className="p-3">
                      {selectedClient.active_campaigns ?? 0}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="bg-gray-50 font-semibold p-3">
                      Total Spend
                    </td>
                    <td className="p-3">
                      ₹
                      {Number(selectedClient.total_spend || 0).toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td className="bg-gray-50 font-semibold p-3">Status</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedClient.status === "active"
                            ? "bg-green-100 text-green-700"
                            : selectedClient.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {selectedClient.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {showImagePreview && selectedClient?.logo && (
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
      src={selectedClient.logo}
      alt={selectedClient.name}
      onClick={(e) => e.stopPropagation()}
      className="max-w-[95vw] max-h-[95vh] object-contain rounded-xl shadow-2xl"
    />
  </div>
)}
      {!loading && displayClients.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No clients found.</p>
      )}
    </div>
  );
}
