/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  return (
    <header className="shell-topbar">
      <div className="min-w-0" />

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 py-1 pl-1 pr-3">
          <img
            src={user?.profile_img || "https://i.pravatar.cc/40"}
            alt=""
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
          />

          <span className="max-w-[160px] truncate text-sm font-medium text-slate-800">
            {user?.full_name || "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
}