/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);

  const [notifications, setNotifications] = useState<any[]>([]);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const fetchUser = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    setUser(data);
  };

  const fetchNotifications = async () => {
    const res = await fetch("http://127.0.0.1:8000/notifications", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    setNotifications(data.notifications || []);
  };

  const markAsRead = async (id: string) => {
    await fetch(`http://127.0.0.1:8000/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    fetchUser();

    fetchNotifications();
  }, []);

  return (
    <header className="shell-topbar">
      <div className="min-w-0" />

      <div className="flex items-center gap-2 sm:gap-4">
        {/* NOTIFICATION */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN */}

          {open && (
            <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <h3 className="mb-3 text-sm font-semibold">Notifications</h3>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500">No notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`mb-2 cursor-pointer rounded-xl p-3 transition ${
                        item.is_read ? "bg-slate-100" : "bg-blue-50"
                      }`}
                    >
                      <h4 className="text-sm font-semibold">{item.title}</h4>

                      <p className="text-xs text-slate-600">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}

        <button
          onClick={() => router.push("/Influencer/profile")}
          className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 py-1 pl-1 pr-3 transition hover:bg-slate-100"
        >
          <img
            src={user?.profile_img || "https://i.pravatar.cc/40"}
            alt=""
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
          />

          <div className="text-left">
            <p className="max-w-[160px] truncate text-sm font-medium text-slate-800">
              {user?.full_name || "Loading..."}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
