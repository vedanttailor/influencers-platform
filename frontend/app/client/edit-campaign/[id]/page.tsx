/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function EditCampaignPage() {
  const params = useParams();

  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(false);

  const [campaign, setCampaign] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [budget, setBudget] = useState<number>(0);

  useEffect(() => {
    fetchCampaign();
  }, []);

  useEffect(() => {
    if (campaign?.budget != null) {
      setBudget(Number(campaign.budget) || 0);
    }
  }, [campaign]);

  const platformFee = Number((budget * 0.1).toFixed(2));
  const totalPayment = Number((budget + platformFee).toFixed(2));

  const fetchCampaign = async () => {
    try {
      const data = await api.get(`/campaigns/${id}`);

      setCampaign(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const form = e.target;

    try {
      const formData = new FormData();

      formData.append("campaign_name", form.campaign_name.value);

      formData.append("brand_name", form.brand_name.value);

      formData.append("campaign_type", form.campaign_type.value);

      formData.append("campaign_category", form.campaign_category.value);

      formData.append("campaign_objective", form.campaign_objective.value);

      formData.append("company_url", form.company_url.value);

      formData.append("description", form.description.value);

      formData.append("start_date", form.start_date.value);

      formData.append("end_date", form.end_date.value);

      formData.append("budget", form.budget.value);

      campaign.platforms.forEach((p: string) => {
        formData.append("platforms", p);
      });

      if (file) {
        formData.append("logo", file);
      }

      await api.put(`/campaigns/${id}`, formData);

      alert("Campaign updated successfully");

      router.push("/client/campaigns");
    } catch (err) {
      console.error(err);

      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link
          href="/client/campaigns"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Campaigns
        </Link>
        
      </div>
      <h1 className="text-2xl font-bold mb-6">Edit Campaign</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow"
      >
        {/* Campaign Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            name="campaign_name"
            defaultValue={campaign.campaign_name}
            className="input"
            required
          />
        </div>

        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name
          </label>
          <input
            name="brand_name"
            defaultValue={campaign.brand_name}
            className="input"
            required
          />
        </div>

        {/* Campaign Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Type
          </label>
          <input
            name="campaign_type"
            defaultValue={campaign.campaign_type}
            className="input"
            required
          />
        </div>

        {/* Campaign Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Category
          </label>
          <input
            name="campaign_category"
            defaultValue={campaign.campaign_category}
            className="input"
            required
          />
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Objective
          </label>
          <input
            name="campaign_objective"
            defaultValue={campaign.campaign_objective}
            className="input"
            required
          />
        </div>

        {/* Company URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website URL
          </label>
          <input
            name="company_url"
            defaultValue={campaign.company_url}
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Description
          </label>
          <textarea
            name="description"
            defaultValue={campaign.description}
            className="input h-32"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            defaultValue={campaign.start_date?.split("T")[0]}
            className="input"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            defaultValue={campaign.end_date?.split("T")[0]}
            className="input"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Budget (₹)
          </label>

          <input
            type="number"
            name="budget"
            defaultValue={campaign.budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="input"
            required
          />

          {budget > 0 && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg space-y-2">
              <p className="flex justify-between">
                <span>Campaign Amount:</span>
                <span className="font-medium">
                  ₹{budget.toLocaleString("en-IN")}
                </span>
              </p>

              <p className="flex justify-between">
                <span>Platform Fee (10%):</span>
                <span className="font-medium text-orange-600">
                  ₹{platformFee.toLocaleString("en-IN")}
                </span>
              </p>

              <hr />

              <p className="flex justify-between text-lg font-bold">
                <span>Total Payment:</span>
                <span className="text-green-600">
                  ₹{totalPayment.toLocaleString("en-IN")}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Current Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Campaign Logo
          </label>

          <img
            src={campaign.logo}
            className="w-24 h-24 rounded-lg object-cover border"
          />
        </div>

        {/* Upload New Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Logo
          </label>

          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Updating..." : "Update Campaign"}
        </button>
      </form>
    </div>
  );
}
