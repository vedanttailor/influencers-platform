"use client";

import { useEffect, useState, useRef } from "react";
import { FiBell, FiHelpCircle } from "react-icons/fi";
import { getAdmin } from "@/app/Admin/store/adminStore";

export default function Topbar() {
  const [admin, setAdmin] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const ref = useRef(null);

  // Dummy notifications (replace with API later)
  const notifications = [
    "New user registered",
    "New campaign created",
    "Influencer request pending",
  ];

  useEffect(() => {
    setAdmin(getAdmin());
  }, []);

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

  if (!admin) return null;

  return (
    <div className="h-16 bg-white shadow px-6 flex justify-end items-center gap-5 relative">

      <FiHelpCircle className="text-xl text-gray-600 cursor-pointer" />

      {/*  Bell with dropdown */}
      <div className="relative" ref={ref}>
        <FiBell
          className="text-xl text-gray-600 cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        />

        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          {notifications.length}
        </span>

        {/*  Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
            <h3 className="text-sm font-semibold mb-3">Notifications</h3>

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
              <p className="text-sm text-gray-500">No notifications</p>
            )}
          </div>
        )}
      </div>

      <span>{admin.name}</span>

      <div className="flex items-center gap-3">
        <img
          src={admin.image || "/avatar.png"}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
}