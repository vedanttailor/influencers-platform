/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { redirectByRole } from "@/app/utils/redirectByRole";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    let imageUrl = "";

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
      console.log("upload response:", uploadData);

      if (uploadData.image_url) {
        imageUrl = uploadData.image_url;
      } else {
        console.error("Image upload failed");
      }
    }
    const form = e.target;

    const data = {
      full_name: form.fname.value,
      email: form.femail.value,
      password: form.fpass.value,
      phone: form.fphone.value,
      role: form.frole.value,
      profile_img: imageUrl,
    };
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(true);
        const message =
          typeof result?.detail?.[0]?.msg === "string"
            ? result.detail[0].msg
            : typeof result?.message === "string"
              ? result.message
              : "Signup failed";

        setMsg(message);
      } else {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        setError(false);
        setMsg("Account created successfully.");
        form.reset();
        setImagePreview(null);
        redirectByRole(result.role, router);
      }
    } catch {
      setError(true);
      setMsg("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <p className="auth-brand-badge">Influencer CRM</p>
          <h1 className="auth-brand-title">Join your creator marketing workspace</h1>
          <p className="auth-brand-sub">
            Onboard as a client or influencer and keep every campaign, asset, and payout in
            sync.
          </p>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-card-wide">
          <h2 className="auth-heading">Create account</h2>
          <p className="auth-sub">Fill in your details to get started.</p>

          {msg && (
            <div
              className={`auth-alert mt-5 ${error ? "auth-alert-error" : "auth-alert-success"}`}
            >
              {msg}
            </div>
          )}

          <form
            onSubmit={handleSignup}
            className={`space-y-4 ${msg ? "mt-4" : "mt-6"}`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          >
            {/* Autofill traps */}
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

            <input
              name="fname"
              autoComplete="new-name"
              placeholder="Full name"
              className="input"
              required
            />
            <input
              name="femail"
              autoComplete="new-email"
              type="email"
              placeholder="Email"
              className="input"
              required
            />
            <input
              name="fpass"
              autoComplete="new-password"
              type="password"
              placeholder="Password"
              className="input"
              required
            />
            <input
              name="fphone"
              autoComplete="new-tel"
              type="tel"
              placeholder="Phone number"
              className="input"
              maxLength={10}
              required
            />

            <select name="frole" className="input" required>
              <option value="">Select role</option>
              <option value="client">Client</option>
              <option value="influencer">Influencer</option>
              {/* <option value="manager">Manager</option>
              <option value="admin">Admin</option> */}
            </select>

            <div>
              <label className="text-sm font-medium text-slate-700">Profile photo</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700"
                required
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
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
