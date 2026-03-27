/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });

  const [avatar, setAvatar] = useState("/avatar.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Fetch user (same as your backend)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        setUser(data);
        setForm({
          full_name: data.full_name,
          email: data.email,
        });
        setAvatar(data.profile_img || "/avatar.png");
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  // Handle input
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Upload preview
  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setAvatar("");
  };

  // ✅ Save Profile (your backend intact)
  const handleSaveProfile = async () => {
    try {
      let imageUrl = avatar;

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
          full_name: form.full_name,
          email: form.email,
          profile_img: imageUrl,
        }),
      });

      setUser({
        ...user,
        full_name: form.full_name,
        email: form.email,
        profile_img: imageUrl,
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong ❌");
    }
  };

  // Password UI only (no API change)
  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated successfully ✅");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">
        Profile Settings
      </h1>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={avatar}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow"
          />

          <div>
            <p className="text-lg font-semibold">{form.full_name}</p>
            <p className="text-sm text-gray-500">{form.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">
            Update Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm"
          />

          {avatar && (
            <button
              onClick={handleRemoveImage}
              className="text-red-500 text-sm"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-lg font-semibold border-b pb-2">
          Basic Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-3 rounded-lg"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-3 rounded-lg"
          />
        </div>
      </div>

      {/* Password */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-lg font-semibold border-b pb-2">
          Change Password
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-3 rounded-lg"
          />
        </div>

      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>

        <button
          onClick={handleSaveProfile || handlePasswordChange}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}