/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Bell, HelpCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left */}
      <h1 className="font-semibold text-lg">
        Influencer Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-6">

        <HelpCircle size={20} className="text-gray-500 cursor-pointer" />
        <Bell size={20} className="text-gray-500 cursor-pointer" />

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">
            Influencer
          </span>
        </div>

      </div>

    </header>
  );
}