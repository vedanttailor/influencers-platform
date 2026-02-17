/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = e.target;

    const data = {
      email: form.femail.value,
      password: form.fpass.value,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(true);
        const message =
          result?.detail?.[0]?.msg || result?.message || "Login failed";
        setMsg(message);
      } else {
        setError(false);
        setMsg("Login successful ✅");
        localStorage.setItem("token", result.access_token);

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
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
          Manage campaigns, creators and analytics in one place.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div
          className="w-full max-w-md p-8 rounded-2xl 
                        bg-white/10 backdrop-blur-xl 
                        border border-white/10 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold mb-2 text-white">
            Welcome back
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
            onSubmit={handleLogin}
            className="space-y-4"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          >
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

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

            <Link href="/forgot-password" className="text-sm text-blue-500">
              Forgot password?
            </Link>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg 
                         hover:bg-indigo-700 transition 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-400">
            Don’t have an account?{" "}
            <a href="/signup" className="text-indigo-400 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
