/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function EditCampaignPage() {

  const params = useParams();

  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(false);

  const [campaign, setCampaign] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {

    fetchCampaign();

  }, []);

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

      <h1 className="text-2xl font-bold mb-6">
        Edit Campaign
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >

        <input
          name="campaign_name"
          defaultValue={campaign.campaign_name}
          placeholder="Campaign Name"
          className="input"
          required
        />

        <input
          name="brand_name"
          defaultValue={campaign.brand_name}
          placeholder="Brand Name"
          className="input"
          required
        />

        <input
          name="campaign_type"
          defaultValue={campaign.campaign_type}
          placeholder="Campaign Type"
          className="input"
          required
        />

        <input
          name="campaign_category"
          defaultValue={campaign.campaign_category}
          placeholder="Category"
          className="input"
          required
        />

        <input
          name="campaign_objective"
          defaultValue={campaign.campaign_objective}
          placeholder="Objective"
          className="input"
          required
        />

        <input
          name="company_url"
          defaultValue={campaign.company_url}
          placeholder="Company URL"
          className="input"
        />

        <textarea
          name="description"
          defaultValue={campaign.description}
          placeholder="Description"
          className="input h-32"
          required
        />

        <input
          type="date"
          name="start_date"
          defaultValue={campaign.start_date?.split("T")[0]}
          className="input"
          required
        />

        <input
          type="date"
          name="end_date"
          defaultValue={campaign.end_date?.split("T")[0]}
          className="input"
          required
        />

        <input
          type="number"
          name="budget"
          defaultValue={campaign.budget}
          placeholder="Budget"
          className="input"
          required
        />

        <div>

          <p className="mb-2 font-medium">
            Current Logo
          </p>

          <img
            src={campaign.logo}
            className="w-24 h-24 rounded-lg object-cover border"
          />

        </div>

        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Updating..." : "Update Campaign"}
        </button>

      </form>
    </div>
  );
}