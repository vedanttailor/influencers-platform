"use client";

import { useState } from "react";

export default function CreateCampaignForm() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "",
    category: "",
    objective: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [platforms, setPlatforms] = useState([]);
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


  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (platforms.length === 0) {
      setPlatformError(true);
      return;
    }

    console.log("Form Data:", formData);
    console.log("Platforms:", platforms);
    console.log("Logo:", logo);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

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
              placeholder="Brand / Client Name"
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
            </select>

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
            <div>
              <label className="text-sm text-gray-600">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input mt-1"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input mt-1"
                min={formData.startDate}
                required
              />
            </div>
          </div>

          {formData.endDate &&
            formData.startDate &&
            formData.endDate < formData.startDate && (
              <p className="text-red-500 text-sm mt-2">
                End date cannot be earlier than start date
              </p>
            )}
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
