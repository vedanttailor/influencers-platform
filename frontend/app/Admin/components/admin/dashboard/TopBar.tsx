/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
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
<<<<<<< HEAD
    <header className="flex items-center justify-between px-8 py-4 bg-white text-black shadow-sm">
=======
    <header className="flex items-center justify-between px-8 py-4 ">
>>>>>>> develop
      <h1 className="text-lg font-semibold"></h1>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-3">
          <img
            src={user?.profile_img || "https://i.pravatar.cc/40"}
            className="w-8 h-8 rounded-full object-cover"
          />

          <span className="text-sm">
            {user?.full_name || "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
}