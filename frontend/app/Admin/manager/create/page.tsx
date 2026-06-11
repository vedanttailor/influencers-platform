/* eslint-disable @next/next/no-img-element */
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
  const [formErrors, setFormErrors] = useState<any>({});

  const roleLabel = useMemo(() => "manager", []);
  const validateForm = (form: any) => {
    const errors: any = {};

    // Full Name
    if (!form.fname.value.trim()) {
      errors.fname = "Full name is required";
    } else if (form.fname.value.trim().length < 3) {
      errors.fname = "Name must be at least 3 characters";
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.femail.value.trim()) {
      errors.femail = "Email is required";
    } else if (!emailPattern.test(form.femail.value)) {
      errors.femail = "Enter valid email address";
    }

    // Password
    const password = form.fpass.value;

    if (!password) {
      errors.fpass = "Password is required";
    } else if (password.length < 8) {
      errors.fpass = "Password must be minimum 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.fpass = "Password must contain uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.fpass = "Password must contain lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.fpass = "Password must contain number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.fpass = "Password must contain special character";
    }

    // Phone
    const phonePattern = /^[0-9]{10}$/;

    if (!form.fphone.value.trim()) {
      errors.fphone = "Phone number is required";
    } else if (!phonePattern.test(form.fphone.value)) {
      errors.fphone = "Phone number must be 10 digits";
    }

    // Image (optional)
    // Image (Required)
    if (!file) {
      errors.file = "Profile image is required";
    } else {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        errors.file = "Only PNG, JPG and JPEG images are allowed";
      }

      const maxSize = 2 * 1024 * 1024;

      if (file.size > maxSize) {
        errors.file = "Image size must be less than 2MB";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();

    setMsg(null);
    setError(false);

    const form = e.target;

    if (!validateForm(form)) {
      return;
    }

    setLoading(true);

    let imageUrl: string | null = null;

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(
          "http://127.0.0.1:8000/auth/upload-profile-image",
          {
            method: "POST",
            body: formData,
          },
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(
            uploadData?.detail || uploadData?.message || "Image upload failed",
          );
        }

        imageUrl = uploadData?.image_url || null;
      }

      const payload = {
        full_name: form.fname.value,
        email: form.femail.value,
        password: form.fpass.value,
        phone: form.fphone.value,
        profile_img: imageUrl,
      };

      await api.post("/admin/create-manager", payload);

      setError(false);
      setMsg("Manager created successfully.");

      form.reset();
      setFile(null);
      setImagePreview(null);
      setFormErrors({});
    } catch (err: any) {
      console.error(err);

      setError(true);

      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to create manager";

      if (
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("email")
      ) {
        setMsg("Email is already in use.");
      } else if (
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("phone")
      ) {
        setMsg("Phone number is already in use.");
      } else {
        setMsg(errorMessage);
      }
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
            Role is fixed to{" "}
            <span className="font-semibold capitalize">{roleLabel}</span>.
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
          <div
            className={`auth-alert ${error ? "auth-alert-error" : "auth-alert-success"}`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4" autoComplete="off">
          {/* Autofill traps */}
          <input type="text" style={{ display: "none" }} />
          <input type="password" style={{ display: "none" }} />

          <div>
            <input
              name="fname"
              placeholder="Full name"
              className={`input ${formErrors.fname ? "border-red-500" : ""}`}
              autoComplete="off"
            />
            {formErrors.fname && <p className="error">{formErrors.fname}</p>}
          </div>

          <div>
            <input
              name="femail"
              placeholder="Email"
              className={`input ${formErrors.femail ? "border-red-500" : ""}`}
              autoComplete="off"
            />
            {formErrors.femail && <p className="error">{formErrors.femail}</p>}
          </div>

          <div>
            <input
              name="fpass"
              type="password"
              placeholder="Password"
              className={`input ${formErrors.fpass ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            {formErrors.fpass && <p className="error">{formErrors.fpass}</p>}
          </div>

          <div>
            <input
              name="fphone"
              placeholder="Phone number"
              className={`input ${formErrors.fphone ? "border-red-500" : ""}`}
              autoComplete="off"
              maxLength={10}
              onInput={(e: any) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
            {formErrors.fphone && <p className="error">{formErrors.fphone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Profile photo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];

                if (!selectedFile) {
                  setFormErrors({
                    ...formErrors,
                    file: "Profile image is required",
                  });
                  return;
                }

                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

                if (!allowedTypes.includes(selectedFile.type)) {
                  setError(true);
                  setMsg("Only JPG, JPEG and PNG files are allowed.");
                  e.target.value = "";
                  return;
                }

                const maxSize = 2 * 1024 * 1024;

                if (selectedFile.size > maxSize) {
                  setError(true);
                  setMsg("Image size must not exceed 2MB.");
                  e.target.value = "";
                  return;
                }

                setError(false);
                setMsg(null);
                setFile(selectedFile);
                setImagePreview(URL.createObjectURL(selectedFile));
              }}
            />
            {formErrors.file && <p className="error">{formErrors.file}</p>}

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
      <style jsx>{`
        .error {
          color: red;
          font-size: 14px;
          margin-top: 4px;
        }

        .border-red-500 {
          border: 1px solid red !important;
        }
      `}</style>
    </div>
  );
}