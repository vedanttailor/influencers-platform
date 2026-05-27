/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateCampaignForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "",
    category: "",
    objective: "",
    companyUrl: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  const [errors, setErrors] = useState<any>({});

  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  const platformList = ["Instagram", "YouTube"];

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // =========================
  // HANDLE LOGO
  // =========================

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      // Image Validation
      if (!file.type.startsWith("image/")) {
        setErrors({
          ...errors,
          logo: "Only image files are allowed",
        });
        return;
      }

      // Max 2MB
      if (file.size > 2 * 1024 * 1024) {
        setErrors({
          ...errors,
          logo: "Image size must be less than 2MB",
        });
        return;
      }

      setLogo(file);
      setPreview(URL.createObjectURL(file));

      setErrors({
        ...errors,
        logo: "",
      });
    }
  };

  // =========================
  // HANDLE PLATFORM
  // =========================

  const handlePlatformChange = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }

    setErrors({
      ...errors,
      platforms: "",
    });
  };

  // =========================
  // RESET FORM
  // =========================

  const handleCancel = () => {
    setFormData({
      name: "",
      brand: "",
      type: "",
      category: "",
      objective: "",
      companyUrl: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
    });

    setPlatforms([]);
    setLogo(null);
    setPreview("");
    setErrors({});
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors: any = {};

    // Campaign Name
    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    } else if (formData.name.length < 3) {
      newErrors.name =
        "Campaign name must be at least 3 characters";
    }

    // Brand Name
    if (!formData.brand.trim()) {
      newErrors.brand = "Company name is required";
    }

    // Campaign Type
    if (!formData.type) {
      newErrors.type = "Please select campaign type";
    }

    // Category
    if (!formData.category) {
      newErrors.category =
        "Please select campaign category";
    }

    // Objective
    if (!formData.objective) {
      newErrors.objective =
        "Please select campaign objective";
    }

    // Company URL
    if (formData.companyUrl) {
      const urlPattern =
        /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/;

      if (!urlPattern.test(formData.companyUrl)) {
        newErrors.companyUrl =
          "Enter valid website URL";
      }
    }

    // Description
    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description =
        "Description must be at least 20 characters";
    }

    // Start Date
    if (!formData.startDate) {
      newErrors.startDate =
        "Start date is required";
    }

    // End Date
    if (!formData.endDate) {
      newErrors.endDate =
        "End date is required";
    }

    // Date Validation
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date";
    }

    // Budget
    if (!formData.budget) {
      newErrors.budget = "Budget is required";
    } else if (Number(formData.budget) < 1000) {
      newErrors.budget =
        "Minimum budget is ₹1000";
    }

    // Platforms
    if (platforms.length === 0) {
      newErrors.platforms =
        "Please select at least one platform";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const form = new FormData();

      form.append("campaign_name", formData.name);
      form.append("brand_name", formData.brand);
      form.append("campaign_type", formData.type);
      form.append("campaign_category", formData.category);
      form.append(
        "campaign_objective",
        formData.objective
      );
      form.append("company_url", formData.companyUrl);
      form.append("description", formData.description);
      form.append("start_date", formData.startDate);
      form.append("end_date", formData.endDate);

      form.append("budget", String(formData.budget));

      platforms.forEach((p) =>
        form.append("platforms", p)
      );

      if (logo) {
        form.append("logo", logo);
      }

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://127.0.0.1:8000/campaigns",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        const err = await res.json();

        console.error(err);

        toast.error(
          err.detail || "Failed to create campaign"
        );

        return;
      }

      toast.success(
        "Campaign created successfully"
      );

      handleCancel();

      router.push("/client/campaigns");
    } catch (err) {
      console.error("Error:", err);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Create Campaign
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* ========================= */}
        {/* BASIC INFO */}
        {/* ========================= */}

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">
            Basic Campaign Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campaign Name */}
            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Campaign Name"
                className={`input ${
                  errors.name
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.name && (
                <p className="error">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Company / Client Name"
                className={`input ${
                  errors.brand
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.brand && (
                <p className="error">
                  {errors.brand}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`input ${
                  errors.type
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">
                  Campaign Type
                </option>

                <option>
                  Product Promotion
                </option>
                <option>
                  Brand Awareness
                </option>
                <option>App Install</option>
                <option>
                  Lead Generation
                </option>
                <option>
                  Event Promotion
                </option>
                <option>
                  Giveaway / Contest
                </option>
                <option>
                  Affiliate Marketing
                </option>
                <option>
                  Influencer Collaboration
                </option>
                <option>
                  Content Creation
                </option>
                <option>
                  Seasonal Campaign
                </option>
              </select>

              {errors.type && (
                <p className="error">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input ${
                  errors.category
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">
                  Campaign Category
                </option>

                <option>Fashion</option>
                <option>Technology</option>
                <option>
                  Food & Beverage
                </option>
                <option>
                  Health & Fitness
                </option>
                <option>
                  Beauty & Skincare
                </option>
                <option>
                  Travel & Tourism
                </option>
                <option>Education</option>
                <option>
                  Finance & Investment
                </option>
                <option>Gaming</option>
                <option>
                  Entertainment
                </option>
                <option>Automobile</option>
                <option>Real Estate</option>
                <option>Sports</option>
                <option>
                  Parenting & Kids
                </option>
              </select>

              {errors.category && (
                <p className="error">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Objective */}
            <div>
              <select
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                className={`input ${
                  errors.objective
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">
                  Campaign Objective
                </option>

                <option>Engagement</option>
                <option>Sales</option>
                <option>
                  Brand Awareness
                </option>
                <option>
                  Website Traffic
                </option>
                <option>
                  App Downloads
                </option>
                <option>
                  Lead Generation
                </option>
                <option>
                  Followers Growth
                </option>
                <option>
                  Video Views
                </option>
                <option>
                  Product Reviews
                </option>
                <option>
                  Content Reach
                </option>
              </select>

              {errors.objective && (
                <p className="error">
                  {errors.objective}
                </p>
              )}
            </div>

            {/* URL */}
            <div>
              <input
                name="companyUrl"
                value={formData.companyUrl}
                onChange={handleChange}
                placeholder="Company Website URL"
                className={`input ${
                  errors.companyUrl
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.companyUrl && (
                <p className="error">
                  {errors.companyUrl}
                </p>
              )}
            </div>

            {/* Platforms */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-2 block">
                Select Platforms *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platformList.map((platform) => (
                  <div
                    key={platform}
                    onClick={() =>
                      handlePlatformChange(
                        platform
                      )
                    }
                    className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                      platforms.includes(platform)
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={platforms.includes(
                        platform
                      )}
                      readOnly
                    />

                    <span>{platform}</span>
                  </div>
                ))}
              </div>

              {errors.platforms && (
                <p className="error">
                  {errors.platforms}
                </p>
              )}
            </div>

            {/* Logo */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-2 block">
                Campaign Logo / Banner
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className={`input ${
                  errors.logo
                    ? "border-red-500"
                    : ""
                }`}
              />

              <p className="text-xs text-gray-500 mt-1">
                Upload PNG, JPG or JPEG image
                (Max 2MB)
              </p>

              {errors.logo && (
                <p className="error">
                  {errors.logo}
                </p>
              )}

              {preview && (
                <img
                  src={preview}
                  className="w-24 h-24 mt-3 rounded border object-cover"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Campaign Description"
              rows={5}
              className={`input resize-none ${
                errors.description
                  ? "border-red-500"
                  : ""
              }`}
            />

            {errors.description && (
              <p className="error">
                {errors.description}
              </p>
            )}
          </div>
        </section>

        {/* ========================= */}
        {/* TIMELINE */}
        {/* ========================= */}

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">
            Campaign Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Start Date *
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`input ${
                  errors.startDate
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.startDate && (
                <p className="error">
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                End Date *
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`input ${
                  errors.endDate
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.endDate && (
                <p className="error">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ========================= */}
        {/* BUDGET */}
        {/* ========================= */}

        <section className="bg-white p-6 rounded-xl shadow">
          <label className="text-sm text-gray-600 mb-2 block">
            Campaign Budget *
          </label>

          <input
            type="number"
            min={1000}
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget ₹"
            className={`input ${
              errors.budget
                ? "border-red-500"
                : ""
            }`}
          />

          {errors.budget && (
            <p className="error">
              {errors.budget}
            </p>
          )}
        </section>

        {/* BUTTONS */}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Create Campaign
          </button>
        </div>
      </form>

      {/* ========================= */}
      {/* STYLES */}
      {/* ========================= */}

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          outline: none;
          transition: 0.2s;
        }

        .input:focus {
          border-color: black;
        }

        .error {
          color: red;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}