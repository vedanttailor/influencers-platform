"use client";
import { useState } from "react";

export default function InfluencersPage() {

  const [influencers, setInfluencers] = useState([
    {
      id: 1,
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      platform: "Instagram",
      followers: "120K",
      email: "john@gmail.com",
      contact: "+91 9876543210",
      status: "Pending",
    },
    {
      id: 2,
      name: "Emma Watson",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      platform: "YouTube",
      followers: "300K",
      email: "emma@gmail.com",
      contact: "+91 9123456780",
      status: "Approved",
    },
  ]);

  //  Modal state
  const [selectedInf, setSelectedInf] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApprove = (id: number) => {
    setInfluencers((prev) =>
      prev.map((inf) =>
        inf.id === id ? { ...inf, status: "Approved" } : inf
      )
    );
  };

  const handleReject = (id: number) => {
    setInfluencers((prev) =>
      prev.map((inf) =>
        inf.id === id ? { ...inf, status: "Rejected" } : inf
      )
    );
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
            {influencers.map((inf) => (
              <tr key={inf.id} className="border-b hover:bg-gray-50 transition">

                <td className="p-4">
                  <img
                    src={inf.image}
                    alt={inf.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="p-4 font-medium">{inf.name}</td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {inf.platform}
                  </span>
                </td>

                <td className="p-4 text-gray-500">{inf.followers}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      inf.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : inf.status === "Rejected"
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

                  {inf.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(inf.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(inf.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {inf.status === "Approved" && (
                    <button
                      onClick={() => handleReject(inf.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  )}

                  {inf.status === "Rejected" && (
                    <button
                      onClick={() => handleApprove(inf.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Approve
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
              <img
                src={selectedInf.image}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <h2 className="font-bold text-lg">{selectedInf.name}</h2>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>Email:</strong> {selectedInf.email}</p>
              <p><strong>Contact:</strong> {selectedInf.contact}</p>
              <p><strong>Platform:</strong> {selectedInf.platform}</p>
              <p><strong>Followers:</strong> {selectedInf.followers}</p>
              <p><strong>Status:</strong> {selectedInf.status}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}