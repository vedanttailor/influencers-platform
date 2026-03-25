"use client";

import { option } from "framer-motion/client";
import { useState } from "react";

export default function CreateCampaignForm() {
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [platformError, setplatformError] = useState([]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //Handle Multiple Platform Selection
  const handlePlatformChange = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const platformList = [
    "Instagram",
    "YouTube",
    // "Facebook",
    // "TikTok",
    // "Twitter (X)",
    // "LinkedIn",
    // "Snapchat",
    // "Pinterest",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Campaign</h1>

      <form className="space-y-8">

        {/* Basic Campaign Information */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">
            Basic Campaign Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input type="text" placeholder="Campaign Name" className="input" required/>

            <input type="text" placeholder="Brand / Client Name" className="input" required/>

            <select className="input" required>
              <option value="">Campaign Type</option>
              <option>Product Promotion</option>
              <option>Brand Awareness</option>
              <option>App Install</option>
              <option>Event Promotion</option>
              <option>Product Launch</option>
              <option>Giveaway / Contest</option>
              <option>Influencer Takeover</option>
              <option>Affiliate Marketing</option>
              <option>Discount / Offer Campaign</option>
              <option>User Generated Content</option>
              <option>Brand Collaboration</option>
              <option>Review / Testimonial Campaign</option>
              <option>Unboxing Campaign</option>
              <option>Seasonal Campaign</option>
              <option>Festival Campaign</option>
              <option>Pre-Launch / Teaser Campaign</option>
              <option>Rebranding Campaign</option>
              <option>CSR / Social Awareness Campaign</option>
              <option>Store / Website Traffic Campaign</option>
              <option>Live Stream Promotion</option>
            </select>

            <select className="input" required>
              <option value="">Campaign Category</option>
              <option>Fashion & Apparel</option>
              <option>Beauty & Skincare</option>
              <option>Health & Fitness</option>
              <option>Food & Beverages</option>
              <option>Technology & Gadgets</option>
              <option>Mobile Apps & SaaS</option>
              <option>Finance & FinTech</option>
              <option>Education & E-Learning</option>
              <option>Travel & Tourism</option>
              <option>Lifestyle</option>
              <option>Gaming & Esports</option>
              <option>Entertainment & Media</option>
              <option>Sports & Outdoors</option>
              <option>Automobile</option>
              <option>Real Estate</option>
              <option>E-commerce</option>
              <option>Jewelry & Accessories</option>
              <option>Home Decor & Furniture</option>
              <option>Parenting & Baby Care</option>
              <option>NGOs & Social Causes</option>
            </select>

            <select className="input" required>
              <option value="">Campaign Objective</option>
              <option>Brand Awareness</option>
              <option>Reach / Impressions</option>
              <option>Engagement</option>
              <option>Follower Growth</option>
              <option>Website Traffic</option>
              <option>App Installs</option>
              <option>Lead Generation</option>
              <option>Sales / Conversions</option>
              <option>Product Trials</option>
              <option>Video Views</option>
              <option>Content Creation</option>
              <option>Audience Education</option>
              <option>Event Registrations</option>
              <option>Email Signups</option>
              <option>Promo Code Usage</option>
              <option>Store Visits</option>
              <option>Community Building</option>
              <option>Brand Trust</option>
            </select>

            {/* Multi Platform Selection */}
<div className="md:col-span-2">
  <label className="text-sm text-gray-600 mb-2 block">
    Select Platforms *
  </label>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {platformList.map((platform) => (
      <div
        key={platform}
        onClick={() => handlePlatformChange(platform)}
        className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition ${
          platforms.includes(platform)
            ? "bg-black text-white border-black"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        <input
          type="checkbox"
          checked={platforms.includes(platform)}
          onChange={() => handlePlatformChange(platform)}
          className="cursor-pointer"
        />
        <span className="text-sm">{platform}</span>
      </div>
    ))}
  </div>

  {/* Error Message */}
    {platformError && (
    <p className="text-red-500 text-sm mt-2">
      Please select at least one platform
    </p>
  )}
</div>

            {/* Logo Upload */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600" >
                Campaign Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                required
                className="w-full border p-2 rounded mt-1"
              />

              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

          </div>

          <textarea
            placeholder="Campaign Description"
            rows={4}
            className="input mt-4"
          />
        </section>

        {/* Timeline */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">Campaign Timeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input type="date" className="input mt-1" required />
            </div>

            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input type="date" className="input mt-1" required/>
            </div>
          </div>
        </section>

        {/* Budget */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-medium mb-4">
            Budget
          </h2>

          <input
            type="number"
            placeholder="Total Campaign Budget"
            className="input"
            required
          />
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button type="button" className="px-6 py-2 border rounded-lg">
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
          outline: none;
        }
        .input:focus {
          border-color: LightBlue;
        }
      `}</style>
    </div>
  );
}