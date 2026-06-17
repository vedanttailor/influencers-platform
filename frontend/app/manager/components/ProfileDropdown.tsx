/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { LogOut, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfileDropdown() {

  const router = useRouter();

  const [name, setName] = useState("Manav");
  const [avatar, setAvatar] = useState(
    "https://i.pravatar.cc/150?img=12"
  );

  const [show, setShow] = useState(false);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/login");

  };

  return (

    <div className="relative">

      {/* PROFILE BUTTON */}
      <div
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 cursor-pointer"
      >

        <img
          src={avatar}
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="font-semibold">
          {name}
        </span>

      </div>

      {/* DROPDOWN */}
      {show && (

        <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-xl p-4 z-50">

          <h3 className="font-semibold mb-3">
            Profile Settings
          </h3>

          {/* Update Name */}
          <div className="mb-3">

            <label className="text-sm text-gray-600">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />

          </div>

          {/* Upload Photo */}
          <div className="mb-4">

            <label className="text-sm text-gray-600 flex items-center gap-1">
              <Upload size={16} /> Upload Photo
            </label>

            <input
              type="file"
              onChange={handleImageUpload}
              className="mt-1 text-sm"
            />

          </div>

          {/* Save Profile */}
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg mb-3 hover:bg-indigo-700"
          >
            Save Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
          >
            <LogOut size={16} /> Logout
          </button>

        </div>

      )}

    </div>
  );
}