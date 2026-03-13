/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { FiBell, FiHelpCircle } from "react-icons/fi";
import { getAdmin } from "@/app/Admin/store/adminStore";

export default function Topbar() {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    setAdmin(getAdmin());
  }, []);

  if (!admin) return null;

  return (
    <div className="h-16 bg-white shadow px-6 flex justify-end items-center gap-5">
      <FiHelpCircle className="text-xl text-gray-600 cursor-pointer" />
      <FiBell className="text-xl text-gray-600 cursor-pointer" />

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
