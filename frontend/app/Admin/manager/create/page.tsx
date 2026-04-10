"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CreateManagerPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const roleLabel = useMemo(() => "manager", []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setMsg(null);
    setError(false);
    setLoading(true);

    const form = e.target;
    let imageUrl: string | null = null;

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("http://127.0.0.1:8000/auth/upload-profile-image", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData?.detail || uploadData?.message || "Image upload failed");
        }

        imageUrl = uploadData?.image_url || null;
      }

      const payload = {
        full_name: form.fname.value,
        email: form.femail.value,
        password: form.fpass.value,
        phone: form.fphone.value || null,
        profile_img: imageUrl,
      };

      await api.post("/admin/create-manager", payload);

      setMsg("Manager created successfully.");
      setError(false);
      form.reset();
      setFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error(err);
      setError(true);
      setMsg(err?.message || "Failed to create manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Create Manager
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Role is fixed to <span className="font-semibold capitalize">{roleLabel}</span>.
          </p>
        </div>

        <Link
          href="/Admin/manager"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <div className="card p-8">
        {msg && (
          <div className={`auth-alert ${error ? "auth-alert-error" : "auth-alert-success"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4" autoComplete="off">
          {/* Autofill traps */}
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <input
            name="fname"
            placeholder="Full name"
            className="input"
            required
            autoComplete="new-name"
          />

          <input
            name="femail"
            type="email"
            placeholder="Email"
            className="input"
            required
            autoComplete="new-email"
          />

          <input
            name="fpass"
            type="password"
            placeholder="Password"
            className="input"
            required
            autoComplete="new-password"
          />

          <input
            name="fphone"
            type="tel"
            placeholder="Phone number (optional)"
            className="input"
            maxLength={15}
            autoComplete="new-tel"
          />

          <div>
            <label className="text-sm font-medium text-slate-700">Profile photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  setImagePreview(URL.createObjectURL(selectedFile));
                }
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt=""
                className="mt-3 h-20 w-20 rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
            )}
          </div>

          <button type="submit" disabled={loading} className="auth-btn-primary">
            {loading ? "Creating..." : "Create manager"}
          </button>
        </form>
      </div>
    </div>
  );
}

