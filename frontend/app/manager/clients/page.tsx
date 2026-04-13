/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get("/manager/clients");
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
              <tr key={client.user_id || client.id} className="border-b hover:bg-gray-50 transition">

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
              {selectedClient.logo ? (
                <img
                  src={selectedClient.logo}
                  alt={selectedClient.name}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
              ) : null}
              <h2 className="font-bold text-lg">{selectedClient.name}</h2>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>Email:</strong> {selectedClient.email}</p>
              <p><strong>Company:</strong> {selectedClient.company_name || "-"}</p>
              <p><strong>Total campaigns:</strong> {selectedClient.total_campaigns ?? "-"}</p>
              <p><strong>Active campaigns:</strong> {selectedClient.active_campaigns ?? "-"}</p>
              <p><strong>Total spend:</strong> ₹{Number(selectedClient.total_spend || 0).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedClient.status}</p>
            </div>

          </div>
        </div>
      )}

      {!loading && displayClients.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No clients found.</p>
      )}

    </div>
  );
}