/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role] = useState("Super Admin");
  const [photo, setPhoto] = useState("/avatar.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

      setShowSuccess(true);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (!admin) return null;

  return (
    <>
      <div className="max-w-3xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>

        <div className="flex items-center gap-6 mb-6">
          <img
            src={photo}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
            <span className="px-4 py-2 bg-blue-600 text-white rounded">
              Change Photo
            </span>
          </label>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            User ID: {admin?.id || admin?._id || admin?.user_id || "Not Available"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Full Name</label>
            <input
              className="border rounded p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              className="border rounded p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Role</label>
            <input
              className="border rounded p-2 w-full bg-gray-100"
              value={role}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-80 text-center">
            <h2 className="text-lg font-bold mb-2">Profile Updated</h2>
            <p className="text-gray-600 mb-4">
              Your profile has been updated successfully.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}