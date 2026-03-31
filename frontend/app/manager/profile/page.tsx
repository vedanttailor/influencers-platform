/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerProfile() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // ✅ added
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState("/avatar.png");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        console.log("USER DATA:", data); // ✅ debug

        setUser(data);
        setName(data.full_name);
        setEmail(data.email); // ✅ set email
        setAvatar(data.profile_img || "/avatar.png");
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const handleSave = async () => {
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
          full_name: name,
          email: email, 
          profile_img: imageUrl,
        }),
      });

      setUser({
        ...user,
        full_name: name,
        email: email, 
        profile_img: imageUrl,
      });

      alert("Profile updated successfully ");
    } catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Manager Profile</h1>

      <div className="bg-white p-8 rounded-xl shadow space-y-6">

        <div className="flex items-center gap-6">
          <img
            src={avatar}
            className="w-24 h-24 rounded-full object-cover border"
          />

          <label className="cursor-pointer">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
            <span className="bg-indigo-600 text-white px-4 py-2 rounded">
              Change Photo
            </span>
          </label>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            User ID: {user?.id || user?._id || user?.user_id || "Not Available"}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}