import { Campaign, CampaignsResponse, CampaignResponse, CampaignInsights, CampaignInsightsResponse, AllCampaignsInsights } from '../types';

const API_BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

export const api = {
  async getCampaigns(): Promise<CampaignsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch campaigns`);
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getCampaigns:', error);
      throw error;
    }
  },

  async getCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `HTTP ${response.status}: Failed to fetch campaign`;
        throw new Error(message);
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getCampaign:', error);
      throw error;
    }
  },

  async getAllInsights(): Promise<AllCampaignsInsights> {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/insights`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Insights API unavailable`);
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getAllInsights:', error);
      throw error;
    }
  },

  async getCampaignInsights(id: string): Promise<CampaignInsightsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}/insights`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Campaign insights unavailable`);
      }
      return response.json();
    } catch (error) {
      console.error('API Error - getCampaignInsights:', error);
      throw error;
    }
  }
};