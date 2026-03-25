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
      alert("Something went wrong ❌");
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
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Profile Photo</h2>

        <div className="flex items-center gap-6">
          <img
            src={user?.avatar || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />

          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {user?.avatar && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-500 text-sm underline"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Basic Information</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              type="text"
              value={user.name || ""}
              onChange={(e) =>
                updateUser({ name: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
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
              className="w-full border p-2 rounded-lg"
            />
          </div>
        </div>
      </div>

      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">Change Password</h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handlePasswordChange}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Update Password
        </button>
      </div>

      
      <div className="flex justify-between items-center">
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>

        <button
          onClick={handleSaveProfile}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}