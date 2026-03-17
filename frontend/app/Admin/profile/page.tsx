/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getAdmin, saveAdmin } from "../store/adminStore";

export default function AdminProfile() {
  const [admin, setAdmin] = useState<any>(null);

  // form states (must always exist)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role] = useState("Super Admin");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [photo, setPhoto] = useState("/avatar.png");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // load admin safely
  useEffect(() => {
    const data = getAdmin();
    setAdmin(data);
    setName(data.name);
    setEmail(data.email);
    setPhoto(data.image || "/avatar.  png");
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(img);
  };

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      setShowError(true);
      return;
    }

    saveAdmin({ name, email, image: photo });
    setShowSuccess(true);
  };

  if (!admin) return null;

  return (
    <>
      <div className="max-w-3xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>

        {/* Image */}
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

        {/* Form */}
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

        {/* Password */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">New Password</label>
            <input
              type="password"
              className="border rounded p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Confirm Password</label>
            <input
              type="password"
              className="border rounded p-2 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Modal */}
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

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-80 text-center">
            <h2 className="text-lg font-bold mb-2 text-red-600">
              Password Mismatch
            </h2>
            <p className="text-gray-600 mb-4">
              Password and Confirm Password must match.
            </p>
            <button
              onClick={() => setShowError(false)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
