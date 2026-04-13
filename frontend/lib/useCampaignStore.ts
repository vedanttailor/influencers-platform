/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { api } from "@/lib/api";

export const useCampaignStore = create((set) => ({
  campaigns: [],

  fetchCampaigns: async () => {
    try {
      const [availableData, myData] = await Promise.all([
        api.get("/influencer/campaigns"),
        api.get("/influencer/my-campaigns"),
      ]);

      const available = availableData.map((c: any) => ({
        id: c.id,
        title: c.campaign_name,
        client: c.brand_name,
        platforms: Array.isArray(c.platforms) ? c.platforms : [],
        platform: Array.isArray(c.platforms) ? c.platforms.join(", ") : "",
        budget: Number(c.budget),
        endDate: c.end_date,
        status: c.status || "available",
        description: "",
        post_url: c.post_url || "",
      }));

      const mine = myData.map((c: any) => ({
        id: c.id,
        title: c.campaign_name,
        client: c.brand_name,
        platforms: Array.isArray(c.platforms) ? c.platforms : [],
        platform: Array.isArray(c.platforms) ? c.platforms.join(", ") : "",
        budget: Number(c.budget),
        endDate: c.end_date,
        status: c.status || "applied",
        description: "",
        post_url: c.post_url || "",
      }));

      const merged = new Map<string, any>();
      [...available, ...mine].forEach((c: any) => {
        const key = String(c.id);
        const prev = merged.get(key);
        if (!prev) {
          merged.set(key, c);
          return;
        }

        // Merge sparsely populated records (my-campaigns) with richer campaign rows.
        merged.set(key, {
          ...prev,
          ...c,
          platform: c.platform || prev.platform,
          platforms:
            Array.isArray(c.platforms) && c.platforms.length > 0
              ? c.platforms
              : prev.platforms,
          endDate: c.endDate || prev.endDate,
          client: c.client || prev.client,
          title: c.title || prev.title,
        });
      });

      set({ campaigns: Array.from(merged.values()) });
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
        c.id === id ? { ...c, status: "completed", post_url: link } : c,
      ),
    }));
  },
}));
