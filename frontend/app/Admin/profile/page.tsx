/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("/avatar.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        console.log("ADMIN DATA:", data);

        setAdmin(data);
        setName(data.full_name);
        setEmail(data.email);
        setPhoto(data.profile_img || "no image");
      } catch (err) {
        console.error("Failed to fetch admin", err);
      }
    };

    fetchAdmin();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;

    setSelectedFile(img);
    setPhoto(URL.createObjectURL(img));
  };

  const handleSave = async () => {
    try {
      let imageUrl = photo;

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

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (!admin) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>

        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-slate-50 p-1">
              <img
                src={photo}
                className="h-28 w-28 rounded-xl object-cover ring-2 ring-white shadow-sm"
              />
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-800">{name}</p>
              <p className="text-sm text-gray-500">{email}</p>
              <p className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-lg inline-block mt-1">
                User ID: {admin?.id || admin?._id || admin?.user_id || "Not Available"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Update Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            {photo && photo !== "/avatar.png" && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPhoto("/avatar.png");
                }}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Save Profile
          </button>
        </div>
    </div>
  );
}