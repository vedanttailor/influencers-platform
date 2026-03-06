/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-950">

      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-6">

        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">Manav Tailor</span>
        </div>

      </div>
    </header>
  );
}