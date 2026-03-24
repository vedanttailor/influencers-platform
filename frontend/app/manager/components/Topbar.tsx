"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, HelpCircle } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const ref = useRef(null);

  // 🔔 Dummy notifications (replace with API later)
  const notifications = [
    "New influencer assigned",
    "Campaign updated by admin",
    "Client message received",
  ];

  // ✅ Close dropdown when clicking outside
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
    <header className="bg-white p-4 flex justify-between items-center shadow">

      <h1 className="text-xl font-semibold"></h1>

      <div className="flex items-center gap-4">

        <HelpCircle className="cursor-pointer" />

        {/* 🔔 Bell with dropdown */}
        <div className="relative" ref={ref}>
          <Bell
            className="cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {/* 🔴 Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>

          {/* 📩 Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-sm font-semibold mb-3">
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

        <ProfileDropdown />

      </div>
    </header>
  );
}