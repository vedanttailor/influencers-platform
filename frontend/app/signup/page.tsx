/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { redirectByRole } from "@/app/utils/redirectByRole";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = e.target;
    

    const data = {
      full_name: form.fname.value,
      email: form.femail.value,
      password: form.fpass.value,
      phone: form.fphone.value,
      role: form.frole.value,
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
        setMsg("Account created successfully 🎉");
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
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="hidden md:flex flex-col justify-center px-16 text-white">
        <h1 className="text-4xl font-bold mb-4">Influencer CRM</h1>
        <p className="text-gray-400 text-lg">
          The operating system for creator marketing.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div
          className="w-full max-w-lg p-8 rounded-2xl 
                        bg-white/10 backdrop-blur-xl 
                        border border-white/10 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold mb-1 text-white">
            Create account
          </h2>

          {msg && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm 
              ${error ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}
            >
              {msg}
            </div>
          )}

          <form
            onSubmit={handleSignup}
            className="space-y-4"
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
            />
            <input
              name="femail"
              autoComplete="new-email"
              type="email"
              placeholder="Email"
              className="input"
            />
            <input
              name="fpass"
              autoComplete="new-password"
              type="password"
              placeholder="Password"
              className="input"
            />
            <input
              name="fphone"
              autoComplete="new-tel"
              type="tel"
              placeholder="Phone number"
              className="input"
            />

            <select name="frole" className="input">
              <option value="">Select role</option>
              <option value="client">Client</option>
              <option value="influencer">Influencer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>

            <div>
              <label className="text-sm text-gray-400">Profile photo</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-300 
                           file:bg-indigo-600 file:border-0 
                           file:text-white file:px-4 file:py-2 
                           file:rounded-lg hover:file:bg-indigo-700"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-2 h-20 w-20 rounded-full object-cover border border-white/20"
                />
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg 
                         hover:bg-indigo-700 transition 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
