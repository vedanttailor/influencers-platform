"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000";

  const sendCode = async () => {
    if (!email) {
      setError(true);
      return setMessage("Email is required");
    }

    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to send code");
      }

      setMessage("Verification code sent to your email");
      setStep(2);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("SEND CODE ERROR:", err);
      setError(true);
      setMessage(err.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!code.trim()) {
      setError(true);
      return setMessage("Verification code is required");
    }

    if (newPassword.length < 6) {
      setError(true);
      return setMessage("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      setError(true);
      return setMessage("Passwords do not match");
    }

    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Reset failed");
      }

      setMessage("Password updated successfully.");
      setStep(3);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("RESET ERROR:", err);
      setError(true);
      setMessage(err.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <p className="auth-brand-badge">Influencer CRM</p>
          <h1 className="auth-brand-title">Reset access securely</h1>
          <p className="auth-brand-sub">
            Verify your email and choose a new password in a few quick steps.
          </p>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-card-wide">
          <h2 className="auth-heading">Forgot password</h2>
          <p className="auth-sub">Step {step} of 3</p>

          {message && (
            <div
              className={`auth-alert mt-5 ${error ? "auth-alert-error" : "auth-alert-success"}`}
            >
              {message}
            </div>
          )}

          <form autoComplete="off" className={message ? "mt-4" : "mt-6"}>
            {step === 1 && (
              <div className="space-y-4">
                <input
                  name="email"
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />

                <button
                  type="button"
                  onClick={sendCode}
                  disabled={loading}
                  className="auth-btn-primary mt-2"
                >
                  {loading ? "Sending..." : "Send code"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <input
                  name="otp"
                  className="input"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="one-time-code"
                  required
                />

                <div style={{ position: "relative" }}>
                  <input
                    name="new-password"
                    className="input"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ paddingRight: "40px" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    name="confirm-password"
                    className="input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ paddingRight: "40px" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={loading}
                  className="auth-btn-primary mt-2"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-center text-sm font-medium text-emerald-800">
                  Password updated successfully
                </p>

                <Link
                  href="/login"
                  className="auth-btn-primary block text-center"
                >
                  Back to sign in
                </Link>
              </div>
            )}
          </form>

          {step !== 3 && (
            <div className="mt-6 text-center">
              <Link href="/login" className="auth-link">
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
