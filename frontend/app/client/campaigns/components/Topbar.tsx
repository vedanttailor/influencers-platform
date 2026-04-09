/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Bell } from "lucide-react";
import { useUser } from "../components/UserContext";

export default function Topbar() {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white text-black shadow-sm">
      <h1 className="text-lg font-semibold"></h1>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "/avatar.png"}
            className="w-8 h-8 rounded-full object-cover"
          />

          <span className="text-sm">
            {user?.name || "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
}