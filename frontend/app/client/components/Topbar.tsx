"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const ref = useRef(null);

  const notifications = [
    "New campaign assigned",
    "Influencer accepted your request",
    "Payment received",
  ];

  //  Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 relative">

      <h1 className="text-lg font-semibold"></h1>

      <div className="flex items-center gap-6">

        {/*  Bell */}
        <div className="relative" ref={ref}>
          <Bell
            className="cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {/*  Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>

          {/*  Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-sm font-semibold mb-2">
                Notifications
              </h3>

              {notifications.length > 0 ? (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((note, index) => (
                    <li
                      key={index}
                      className="text-sm p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No notifications
                </p>
              )}
            </div>
          )}
        </div>

        {/*  Profile */}
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