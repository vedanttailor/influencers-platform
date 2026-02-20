/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { campaigns } from "@/lib/mockData";
import { currentInfluencer } from "@/lib/user";

export default function Topbar() {
  const newCampaigns = campaigns.filter(c => c.status === "new");
  const [open, setOpen] = useState(false);

  return (
    <div className="h-14 bg-white border-b px-6 flex justify-between items-center">
      
      {/* Left */}
      <p className="font-semibold"></p>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative text-lg"
          >
            🔔
            {newCampaigns.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {newCampaigns.length}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded border">
              {newCampaigns.length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No new campaigns
                </p>
              )}

              {newCampaigns.map(c => (
                <Link
                  key={c.id}
                  href={`/campaigns/${c.id}`}
                  className="block px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  <p className="font-medium">
                    New campaign assigned
                  </p>
                  <p className="text-gray-500">
                    {c.title}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src={currentInfluencer.profileImg}
            className="w-9 h-9 rounded-full border"
          />
          <div className="text-sm leading-tight">
            <p className="font-medium">
              {currentInfluencer.name}
            </p>
            <p className="text-gray-500 text-xs">
              {currentInfluencer.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
