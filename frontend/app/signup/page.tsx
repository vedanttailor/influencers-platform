/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { redirectByRole } from "@/app/utils/redirectByRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [msg, setMsg] = useState<string | null>(
    null
  );

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [file, setFile] = useState<File | null>(
    null
  );

  const [showPassword, setShowPassword] =
    useState(false);

  // =========================
  // CUSTOM VALIDATION ERRORS
  // =========================

  const [formErrors, setFormErrors] =
    useState<any>({});

  // =========================
  // VALIDATE FORM
  // =========================

  const validateForm = (form: any) => {
    const errors: any = {};

    // Full Name
    if (!form.fname.value.trim()) {
      errors.fname = "Full name is required";
    } else if (
      form.fname.value.trim().length < 3
    ) {
      errors.fname =
        "Name must be at least 3 characters";
    }

    // Email
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.femail.value.trim()) {
      errors.femail = "Email is required";
    } else if (
      !emailPattern.test(form.femail.value)
    ) {
      errors.femail =
        "Enter valid email address";
    }

    // PASSWORD VALIDATION
    const password = form.fpass.value;

    if (!password) {
      errors.fpass = "Password is required";
    } else if (password.length < 8) {
      errors.fpass =
        "Password must be minimum 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.fpass =
        "Password must contain uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.fpass =
        "Password must contain lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.fpass =
        "Password must contain number";
    } else if (
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.fpass =
        "Password must contain special character";
    }

    // Phone
    const phonePattern = /^[0-9]{10}$/;

    if (!form.fphone.value.trim()) {
      errors.fphone =
        "Phone number is required";
    } else if (
      !phonePattern.test(form.fphone.value)
    ) {
      errors.fphone =
        "Phone number must be 10 digits";
    }

    // Role
    if (!form.frole.value) {
      errors.frole = "Please select role";
    }

    // Image Validation
    if (!file) {
      errors.file =
        "Profile image is required";
    } else {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];

      if (
        !allowedTypes.includes(file.type)
      ) {
        errors.file =
          "Only PNG, JPG and JPEG images are allowed";
      }

      const maxSize = 2 * 1024 * 1024;

      if (file.size > maxSize) {
        errors.file =
          "Image size must be less than 2MB";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    const errors: any = {};

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      errors.file =
        "Only PNG, JPG and JPEG images are allowed";
    }

    const maxSize = 2 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      errors.file =
        "Image size must be less than 2MB";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      setFile(null);

      setImagePreview(null);

      return;
    }

    setFormErrors({
      ...formErrors,
      file: "",
    });

    setFile(selectedFile);

    setImagePreview(
      URL.createObjectURL(selectedFile)
    );
  };

  // =========================
  // HANDLE SIGNUP
  // =========================

  const handleSignup = async (e: any) => {
    e.preventDefault();

    setMsg(null);

    setLoading(true);

    const form = e.target;

    if (!validateForm(form)) {
      setLoading(false);
      return;
    }

    let imageUrl = "";

    try {
      // IMAGE UPLOAD
      if (file) {
        const formData = new FormData();

        formData.append("file", file);

        const uploadRes = await fetch(
          "http://127.0.0.1:8000/auth/upload-profile-image",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData =
          await uploadRes.json();

        if (uploadData.image_url) {
          imageUrl =
            uploadData.image_url;
        } else {
          setError(true);

          setMsg("Image upload failed");

          setLoading(false);

          return;
        }
      }

      // SIGNUP DATA
      const data = {
        full_name: form.fname.value,
        email: form.femail.value,
        password: form.fpass.value,
        phone: form.fphone.value,
        role: form.frole.value,
        profile_img: imageUrl,
      };

      // API CALL
      const res = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(true);

        const message =
          typeof result?.detail?.[0]
            ?.msg === "string"
            ? result.detail[0].msg
            : typeof result?.message ===
                "string"
              ? result.message
              : "Signup failed";

        setMsg(message);

        return;
      }

      // SUCCESS
      localStorage.setItem(
        "token",
        result.token
      );

      localStorage.setItem(
        "role",
        result.role
      );

      setError(false);

      setMsg(
        "Account created successfully."
      );

      form.reset();

      setImagePreview(null);

      setFile(null);

      setFormErrors({});

      redirectByRole(result.role, router);
    } catch (err) {
      console.error(err);

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
          <p className="auth-brand-badge">
            Influencer CRM
          </p>

          <h1 className="auth-brand-title">
            Join your creator marketing
            workspace
          </h1>

          <p className="auth-brand-sub">
            Onboard as a client or
            influencer and keep every
            campaign, asset, and payout in
            sync.
          </p>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-card-wide">
          <h2 className="auth-heading">
            Create account
          </h2>

          <p className="auth-sub">
            Fill in your details to get
            started.
          </p>

          {msg && (
            <div
              className={`auth-alert mt-5 ${
                error
                  ? "auth-alert-error"
                  : "auth-alert-success"
              }`}
            >
              {msg}
            </div>
          )}

          <form
            onSubmit={handleSignup}
            className={`space-y-4 ${
              msg ? "mt-4" : "mt-6"
            }`}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            noValidate
          >
            {/* FULL NAME */}
            <div>
              <input
                name="fname"
                autoComplete="new-name"
                placeholder="User Name"
                className={`input ${
                  formErrors.fname
                    ? "border-red-500"
                    : ""
                }`}
              />

              {formErrors.fname && (
                <p className="error">
                  {formErrors.fname}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                name="femail"
                autoComplete="new-email"
                type="text"
                placeholder="Email"
                className={`input ${
                  formErrors.femail
                    ? "border-red-500"
                    : ""
                }`}
              />

              {formErrors.femail && (
                <p className="error">
                  {formErrors.femail}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  name="fpass"
                  autoComplete="new-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  className={`input ${
                    formErrors.fpass
                      ? "border-red-500"
                      : ""
                  }`}
                  style={{
                    paddingRight: "40px",
                  }}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    let error = "";

                    if (
                      value.length < 8
                    ) {
                      error =
                        "Password must be minimum 8 characters";
                    } else if (
                      !/[A-Z]/.test(value)
                    ) {
                      error =
                        "Password must contain uppercase letter";
                    } else if (
                      !/[a-z]/.test(value)
                    ) {
                      error =
                        "Password must contain lowercase letter";
                    } else if (
                      !/[0-9]/.test(value)
                    ) {
                      error =
                        "Password must contain number";
                    } else if (
                      !/[!@#$%^&*(),.?":{}|<>]/.test(
                        value
                      )
                    ) {
                      error =
                        "Password must contain special character";
                    }

                    setFormErrors({
                      ...formErrors,
                      fpass: error,
                    });
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#6b7280",
                  }}
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {formErrors.fpass && (
                <p className="error">
                  {formErrors.fpass}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                name="fphone"
                autoComplete="new-tel"
                type="tel"
                placeholder="Phone number"
                className={`input ${
                  formErrors.fphone
                    ? "border-red-500"
                    : ""
                }`}
                maxLength={10}
                onInput={(e: any) => {
                  e.target.value =
                    e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                }}
              />

              {formErrors.fphone && (
                <p className="error">
                  {formErrors.fphone}
                </p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <select
                name="frole"
                className={`input ${
                  formErrors.frole
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">
                  Select role
                </option>

                <option value="client">
                  Client
                </option>

                <option value="influencer">
                  Influencer
                </option>
              </select>

              {formErrors.frole && (
                <p className="error">
                  {formErrors.frole}
                </p>
              )}
            </div>

            {/* PROFILE IMAGE */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Profile photo
              </label>

              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                className={`mt-2 block w-full text-sm text-slate-600 ${
                  formErrors.file
                    ? "border border-red-500 rounded-lg p-2"
                    : ""
                }`}
                onChange={
                  handleImageChange
                }
              />

              <p className="text-xs text-gray-500 mt-1">
                Only PNG, JPG, JPEG
                allowed (Max 2MB)
              </p>

              {formErrors.file && (
                <p className="error">
                  {formErrors.file}
                </p>
              )}

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 h-20 w-20 rounded-2xl border border-slate-200 object-cover shadow-sm"
                />
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn-primary"
            >
              {loading
                ? "Creating..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="auth-link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* CUSTOM STYLE */}

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