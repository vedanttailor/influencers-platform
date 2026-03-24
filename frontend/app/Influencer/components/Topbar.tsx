"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, HelpCircle } from "lucide-react";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const ref = useRef(null);

  //  Dummy notifications (replace with API later)
  const notifications = [
    "New campaign invitation",
    "Client approved your proposal",
    "Payment credited",
  ];

  //  Close when clicking outside
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
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left */}
      <h1 className="font-semibold text-lg">
        
      </h1>

      {/* Right */}
      <div className="flex items-center gap-6">

        <HelpCircle size={20} className="text-gray-500 cursor-pointer" />

        {/* Bell */}
        <div className="relative" ref={ref}>
          <Bell
            size={20}
            className="text-gray-500 cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />

          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>

          {/*Dropdown */}
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

        {/*Profile */}
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