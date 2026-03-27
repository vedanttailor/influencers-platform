/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "../components/UserContext";

export default function ProfilePage() {
  const { user, updateUser } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        updateUser({
          name: data.full_name,
          email: data.email,
          avatar: data.profile_img,
        });
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

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
    updateUser({ avatar: "" });
  };

  const handleSaveProfile = async () => {
    try {
      let imageUrl = user?.avatar;

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
          profile_img: imageUrl || null,
        }),
      });

      alert("Profile updated successfully ");
    } catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    updateUser({
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
            src={user?.avatar || "https://i.pravatar.cc/150"}
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

          {user?.avatar && (
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

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
          Change Password
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
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
          onClick={handleSaveProfile || handlePasswordChange}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}