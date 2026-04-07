/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { api } from "@/lib/api";

export const useCampaignStore = create((set) => ({
  campaigns: [],

  fetchCampaigns: async () => {
    try {
      const data = await api.get("/influencer/campaigns");

      const formatted = data.map((c: any) => ({
        id: c.id,
        title: c.campaign_name,
        client: c.brand_name,
        platform: c.platforms?.join(", "),
        budget: Number(c.budget),
        endDate: c.end_date,
        status: c.status || "available",
        description: "",
      }));

      set({ campaigns: formatted });
    } catch (err) {
      console.error(err);
    }
  },

  fetchMyCampaigns: async () => {
    try {
      const data = await api.get("/influencer/my-campaigns");

      const formatted = data.map((c: any) => ({
        id: c.id,
        title: c.campaign_name,
        client: c.brand_name,
        budget: Number(c.budget),
        status: c.status,
        endDate: c.end_date,
        post_url: c.post_url,
      }));

      set((state: any) => ({
        campaigns: [...state.campaigns, ...formatted],
      }));
    } catch (err) {
      console.error(err);
    }
  },

  apply: async (id: string) => {
    await api.post("/influencer/apply", { campaign_id: id });

    set((state: any) => ({
      campaigns: state.campaigns.map((c: any) =>
        c.id === id ? { ...c, status: "applied" } : c,
      ),
    }));
  },
  earnings: null,

  fetchEarnings: async () => {
    try {
      const data = await api.get("/influencer/earnings");
      set({ earnings: data });
    } catch (err) {
      console.error(err);
    }
  },

  submitLink: async (id: string, link: string) => {
    await api.patch(`/influencer/submit/${id}`, {
      post_url: link,
    });

    set((state: any) => ({
      campaigns: state.campaigns.map((c: any) =>
        c.id === id ? { ...c, status: "completed" } : c,
      ),
    }));
  },
}));
