import { create } from "zustand";
import { Campaign } from "./types";

type Store = {
  campaigns: Campaign[];
  apply: (id: number) => void;
  submitLink: (id: number, link: string) => void;
};

export const useCampaignStore = create<Store>((set) => ({
  campaigns: [
    {
      id: 1,
      title: "Instagram Reel Promo",
      client: "Nike",
      platform: "Instagram",
      budget: 8000,
      description: "Create 1 reel",
      guidelines: "No music copyright",
      hashtags: ["#nike", "#fitness"],
      endDate: "2026-02-05",
      status: "available",
    },
  ],

  apply: (id) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, status: "applied" } : c
      ),
    })),

  submitLink: (id, link) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id
          ? { ...c, postLink: link, status: "completed" }
          : c
      ),
    })),
}));
