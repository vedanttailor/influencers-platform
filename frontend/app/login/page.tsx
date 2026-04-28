/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { redirectByRole } from "@/app/utils/redirectByRole";
import{ FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
          typeof result.detail === "string"
            ? result.detail
            : result?.detail?.[0]?.msg || "Login failed";

        setMsg(message);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);

      setError(false);
      setMsg("Login successful");

      setTimeout(() => {
        redirectByRole(result.role, router);
      }, 500);
    } catch (err) {
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
          <h1 className="auth-brand-title">
            Run creator campaigns with clarity
          </h1>
          <p className="auth-brand-sub">
            Manage briefs, approvals, and performance in one professional
            workspace—built for brands and influencers.
          </p>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-card">
          <h2 className="auth-heading">Sign in</h2>
          <p className="auth-sub">
            Welcome back. Enter your credentials to continue.
          </p>

          {msg && (
            <div
              className={`auth-alert mt-5 ${
                error ? "auth-alert-error" : "auth-alert-success"
              }`}
            >
              {msg}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className={`space-y-4 ${msg ? "mt-4" : "mt-6"}`}
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
              required
            />

            <div style={{ position: "relative" }}>
              <input
                name="fpass"
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input"
                required
                style={{ paddingRight: "40px" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#6b7280",
                }}
              >
                {showPassword ? <FaEyeSlash/> :<FaEye/> }
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn-primary"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link href="/signup" className="auth-link">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}