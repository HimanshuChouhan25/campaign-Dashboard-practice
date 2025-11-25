

const API_BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

export const api = {
  async getCampaigns() {
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

  async getCampaign(id) {
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

  async getAllInsights() {
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

  async getCampaignInsights(id) {
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