"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const sendCode = async () => {
    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(true);
        setMessage(data?.message || "Failed to send code");
      } else {
        setMessage("Verification code sent to your email");
        setStep(2);
      }
    } catch {
      setError(true);
      setMessage("Server not reachable");
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError(true);
      return setMessage("Passwords do not match");
    }

    setLoading(true);
    setMessage(null);
    setError(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(true);
        setMessage(data?.message || "Reset failed");
      } else {
        setMessage("Password updated successfully 🎉");
        setStep(3);
      }
    } catch {
      setError(true);
      setMessage("Server not reachable");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      
      <div className="hidden md:flex flex-col justify-center px-16 text-white">
        <h1 className="text-4xl font-bold mb-4">Influencer CRM</h1>
        <p className="text-gray-400 text-lg">
          Secure your account access.
        </p>
      </div>

      
      <div className="flex items-center justify-center">
        <div
          className="w-full max-w-lg p-8 rounded-2xl 
                     bg-white/10 backdrop-blur-xl 
                     border border-white/10 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold mb-1 text-white">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-400 mb-4">
            Step {step} of 3
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm 
              ${error ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}
            >
              {message}
            </div>
          )}

          {step === 1 && (
            <>
              <input
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg 
                           hover:bg-indigo-700 transition 
                           disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                className="input"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg 
                           hover:bg-indigo-700 transition 
                           disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-green-300 text-center mb-4">
                Password updated successfully
              </p>
              <Link
                href="/login"
                className="w-full block text-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
              >
                Back to Login
              </Link>
            </>
          )}

          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
