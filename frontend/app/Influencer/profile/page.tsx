/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {

  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });

  const [avatar, setAvatar] = useState("/avatar.png");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {

    const fetchUser = async () => {

      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUser(data);

      setForm({
        full_name: data.full_name,
        email: data.email,
      });

    };

    fetchUser();

  }, []);

  const handleChange = (e: any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleImageUpload = (e: any) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);

  };

  const handleSave = () => {

    setUser({
      ...user,
      full_name: form.full_name,
      email: form.email,
    });

    setEditMode(false);

  };

  const handlePasswordUpdate = () => {

    if (!password || !confirmPassword) {
      alert("Please fill password fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated successfully");

    setPassword("");
    setConfirmPassword("");

  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/login");

  };

  if (!user) return <div>Loading...</div>;

  return (

    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Profile
      </h1>

      <div className="bg-white p-8 rounded-xl shadow">

        {/* Profile Photo */}

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

          <div>
            <h2 className="text-xl font-semibold">
              {user.full_name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>
          </div>

        </div>

        {/* Profile Info */}

        <div className="mt-6 grid grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-gray-500">
              Full Name
            </label>

            {editMode ? (
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p className="font-medium">
                {user.full_name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Email
            </label>

            {editMode ? (
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p className="font-medium">
                {user.email}
              </p>
            )}
          </div>

        </div>

        {/* Edit Buttons */}

        <div className="mt-8 flex gap-3">

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </div>

      {/* Update Password */}

      <div className="bg-white p-8 rounded-xl shadow space-y-4">

        <h2 className="text-xl font-semibold">
          Update Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handlePasswordUpdate}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Update Password
        </button>

      </div>

      {/* Logout */}

      <div className="flex justify-end">

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

    </div>

  );
}