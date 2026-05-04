/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

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

  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [platformError, setPlatformError] = useState(false);

  const platformList = ["Instagram", "YouTube"];

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePlatformChange = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

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
    setPlatformError(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (platforms.length === 0) {
      setPlatformError(true);
      return;
    }

    try {
      const form = new FormData();

      form.append("campaign_name", formData.name);
      form.append("brand_name", formData.brand);
      form.append("campaign_type", formData.type);
      form.append("campaign_category", formData.category);
      form.append("campaign_objective", formData.objective);
      form.append("company_url", formData.companyUrl);
      form.append("description", formData.description);
      form.append("start_date", formData.startDate);
      form.append("end_date", formData.endDate);

      // ✅ IMPORTANT: always send string
      form.append("budget", String(formData.budget));

      // ✅ platforms array
      platforms.forEach((p) => form.append("platforms", p));

      // ✅ logo file
      if (logo) {
        form.append("logo", logo);
      }

      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/campaigns", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        toast.error(err.detail || "Failed to create campaign");
        return;
      }

      toast.success("Campaign created successfully");

      // ✅ RESET FORM
      handleCancel();

      // ✅ REDIRECT (VERY IMPORTANT)
      router.push("/client/campaigns");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ✅ YOUR UI UNCHANGED BELOW */}

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">
            Basic Campaign Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Campaign Name"
              className="input"
              required
            />
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Company / Client Name"
              className="input"
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Campaign Type</option>
              <option>Product Promotion</option>
              <option>Brand Awareness</option>
              <option>App Install</option>
              <option>Lead Generation</option>
              <option>Event Promotion</option>
              <option>Giveaway / Contest</option>
              <option>Affiliate Marketing</option>
              <option>Influencer Collaboration</option>
              <option>Content Creation</option>
              <option>Seasonal Campaign</option>
            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Campaign Category</option>
              <option>Fashion</option>
              <option>Technology</option>
              <option>Food & Beverage</option>
              <option>Health & Fitness</option>
              <option>Beauty & Skincare</option>
              <option>Travel & Tourism</option>
              <option>Education</option>
              <option>Finance & Investment</option>
              <option>Gaming</option>
              <option>Entertainment</option>
              <option>Automobile</option>
              <option>Real Estate</option>
              <option>Sports</option>
              <option>Parenting & Kids</option>
            </select>

            <select
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Campaign Objective</option>
              <option>Engagement</option>
              <option>Sales</option>
              <option>Brand Awareness</option>
              <option>Website Traffic</option>
              <option>App Downloads</option>
              <option>Lead Generation</option>
              <option>Followers Growth</option>
              <option>Video Views</option>
              <option>Product Reviews</option>
              <option>Content Reach</option>
            </select>

            <input
              name="companyUrl"
              value={formData.companyUrl}
              onChange={handleChange}
              placeholder="Company Website URL (https://...)"
              className="input"
            />

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 mb-2 block">
                Select Platforms *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platformList.map((platform) => (
                  <div
                    key={platform}
                    onClick={() => handlePlatformChange(platform)}
                    className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                      platforms.includes(platform)
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={platforms.includes(platform)}
                      readOnly
                    />
                    <span>{platform}</span>
                  </div>
                ))}
              </div>

              {platformError && (
                <p className="text-red-500 text-sm mt-2">
                  Please select at least one platform
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="input"
              />
              {preview && (
                <img src={preview} className="w-24 h-24 mt-2 rounded border" />
              )}
            </div>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Campaign Description"
            className="input mt-4"
          />
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">Campaign Timeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow">
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget ₹"
            className="input"
            required
          />
        </section>

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

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}
