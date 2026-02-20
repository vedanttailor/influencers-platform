/* eslint-disable @typescript-eslint/no-unused-vars */
type Platform = "instagram" | "youtube";

type InfluencerStatus = "pending" | "approved" | "rejected" | "suspended" | "blacklisted";

interface PlatformStats {
  platform: Platform;
  username: string;
  followers: number;
  verified: boolean;
}

interface CampaignPerformance {
  campaignName: string;
  platform: Platform;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

interface Influencer {
  id: number;
  name: string;
  email: string;
  status: InfluencerStatus;
  rating: number; // 1–5
  platforms: PlatformStats[];
  campaigns: CampaignPerformance[];
}
