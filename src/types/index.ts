export interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
}

export interface CampaignResponse {
  campaign: Campaign;
}

export interface CampaignInsights {
  campaign_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export interface CampaignInsightsResponse {
  insights: CampaignInsights;
}

export interface AllCampaignsInsights {
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;
  average_ctr: number;
  average_cpc: number;
  roi: number;
}