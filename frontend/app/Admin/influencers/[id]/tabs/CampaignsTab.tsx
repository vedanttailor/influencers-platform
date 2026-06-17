/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CampaignsTab() {
  const params = useParams();

  const influencerId = params.id;

  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/admin/influencer-campaigns/${influencerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      console.log(data);

      setCampaigns(data.campaigns || data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-semibold mb-4">Assigned Campaigns</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 border text-left">Campaign</th>
              <th className="p-3 border text-left">Client</th>
              <th className="p-3 border text-left">Budget</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Post URL</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((c) => {
                let postUrl = c.post_url;

                // Parse JSON string

                if (
                  typeof postUrl === "string" &&
                  (postUrl.startsWith("{") || postUrl.startsWith("["))
                ) {
                  try {
                    postUrl = JSON.parse(postUrl);
                  } catch (err) {
                    console.log(err);
                  }
                }

                return (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">{c.campaign_name}</td>

                    <td className="p-3">{c.client_name}</td>

                    <td className="p-3">₹{c.budget}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          c.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : c.status === "active"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {!postUrl ? (
                        <span className="text-gray-400">—</span>
                      ) : typeof postUrl === "string" ? (
                        <a
                          href={postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Post
                        </a>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {postUrl.instagram &&
                            (Array.isArray(postUrl.instagram) ? (
                              postUrl.instagram.map(
                                (link: string, index: number) => (
                                  <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-600 underline"
                                  >
                                    Instagram Post {index + 1}
                                  </a>
                                ),
                              )
                            ) : (
                              <a
                                href={postUrl.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 underline"
                              >
                                Instagram Post
                              </a>
                            ))}

                          {postUrl.youtube &&
                            (Array.isArray(postUrl.youtube) ? (
                              postUrl.youtube.map(
                                (link: string, index: number) => (
                                  <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-600 underline"
                                  >
                                    YouTube Video {index + 1}
                                  </a>
                                ),
                              )
                            ) : (
                              <a
                                href={postUrl.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 underline"
                              >
                                YouTube Video
                              </a>
                            ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
