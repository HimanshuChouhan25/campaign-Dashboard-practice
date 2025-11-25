

const BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

// api functions

export const api = {
  async getCampaigns() {
    try {
      const response = await fetch(`${BASE_URL}/campaigns`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch campaigns`);
      }
      return response.json();
    } catch (error) {
      console.log('getCampaigns failed:', error);
      throw error;
    }
  },

  async getCampaign(id) {
    try {
      const response = await fetch(`${BASE_URL}/campaigns/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `HTTP ${response.status}: Failed to fetch campaign`;
        throw new Error(message);
      }
      return response.json();
    } catch (error) {
      console.log('getCampaign failed:', error);
      throw error;
    }
  },

  async getAllInsights() {
    try {
      const response = await fetch(`${BASE_URL}/campaigns/insights`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Insights API unavailable`);
      }
      return response.json();
    } catch (error) {
      console.log('getAllInsights failed:', error);
      throw error;
    }
  },

  async getCampaignInsights(id) {
    try {
      const response = await fetch(`${BASE_URL}/campaigns/${id}/insights`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Campaign insights unavailable`);
      }
      return response.json();
    } catch (error) {
      console.log('getCampaignInsights failed:', error);
      throw error;
    }
  }
};