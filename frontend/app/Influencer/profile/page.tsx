/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });

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

  const handleSave = () => {
    setUser({
      ...user,
      full_name: form.full_name,
      email: form.email,
    });

    setEditMode(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Profile
      </h1>

      <div className="bg-white p-8 rounded-xl shadow">

        <div className="flex items-center gap-6">

          <div>
            <h2 className="text-xl font-semibold">
              {user.full_name}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>
          </div>

        </div>

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

    </div>
  );
}