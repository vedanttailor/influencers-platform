export type CampaignStatus =
  | "available"
  | "applied"
  | "accepted"
  | "completed";

export type Campaign = {
  id: number;
  title: string;
  client: string;
  platform: string;
  budget: number;
  description: string;
  guidelines: string;
  hashtags: string[];
  endDate: string;
  status: CampaignStatus;
};
