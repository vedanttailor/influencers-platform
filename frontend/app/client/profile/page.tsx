/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "../campaigns/components/UserContext";

export default function ProfilePage() {
  const { user, updateUser } = useUser();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) return <p className="p-6">Loading...</p>;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    updateUser({
      avatar: URL.createObjectURL(file), 
    });
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    updateUser({ avatar: "/avatar.png" });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      let imageUrl = user.avatar;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch(
          "http://127.0.0.1:8000/auth/upload-profile-image",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        imageUrl = data.image_url;
      }

      await fetch("http://127.0.0.1:8000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          full_name: user.name,
          email: user.email,
          profile_img: imageUrl,
        }),
      });

      updateUser({
        avatar: imageUrl || "/avatar.png",
      });

      alert("Profile updated successfully ");
    } catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong ");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    updateUser({
      id: "",
      name: "",
      email: "",
      avatar: "",
    });

    window.location.href = "/login";
  };
  
  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    alert("Password updated successfully");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Profile Settings
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-5">
          <img
            src={user.avatar || "/avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow"
          />

          <div>
            <p className="text-lg font-semibold text-gray-800">
              {user.name}
            </p>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>

            <p className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-lg inline-block mt-1">
              User ID: {user.id || "Not Available"}
            </p>
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">
            Update Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />

          {user.avatar && user.avatar !== "/avatar.png" && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-red-500 text-sm hover:underline"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Basic Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              type="text"
              value={user.name || ""}
              onChange={(e) =>
                updateUser({ name: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              type="email"
              value={user.email || ""}
              onChange={(e) =>
                updateUser({ email: e.target.value })
              }
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

        </div>
      </div>
              
      <div className="flex justify-between items-center">
        
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

        <button
          onClick={handleSaveProfile}
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </div>
    </div>
  );
}