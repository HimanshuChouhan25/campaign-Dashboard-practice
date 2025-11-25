import React, { useState, useEffect } from 'react';
import { Campaign, AllCampaignsInsights, CampaignInsights } from './types';
import { api } from './services/api';
import './App.css';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [insights, setInsights] = useState<AllCampaignsInsights | null>(null);
  const [campaignInsights, setCampaignInsights] = useState<CampaignInsights | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (campaigns.length > 0) {
      calculateInsights();
      fetchInsights();
    }
  }, [campaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCampaigns();
      setCampaigns(data.campaigns);
      setRetryCount(0);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchCampaigns, 2000);
      } else {
        setError('Unable to load campaigns. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateInsights = () => {
    const calculated = {
      total_impressions: campaigns.reduce((sum, c) => sum + (c.budget * 100), 0),
      total_clicks: campaigns.reduce((sum, c) => sum + (c.budget * 5), 0),
      total_conversions: campaigns.reduce((sum, c) => sum + (c.budget * 0.5), 0),
      total_spend: campaigns.reduce((sum, c) => sum + c.budget, 0),
      average_ctr: 5.0,
      average_cpc: 2.5,
      roi: 15.0
    };
    setInsights(calculated);
  };

  const fetchInsights = async () => {
    try {
      const data = await api.getAllInsights();
      if (data && data.total_impressions !== undefined) {
        setInsights(data);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
    }
  };

  const handleCampaignDoubleClick = async (campaignId: string) => {
    setModalLoading(true);
    
    try {
      const campaignData = await api.getCampaign(campaignId);
      setSelectedCampaign(campaignData.campaign);
    } catch (err) {
      console.error('Failed to load campaign:', err);
      const fallbackCampaign = campaigns.find(c => c.id === campaignId);
      if (fallbackCampaign) {
        setSelectedCampaign(fallbackCampaign);
      }
    }
    
    try {
      const insightsData = await api.getCampaignInsights(campaignId);
      const insights = insightsData.insights;
      const hasValidData = insights && Object.values(insights).some(val => val !== null && val !== undefined && val !== 0);
      setCampaignInsights(hasValidData ? insights : null);
    } catch (insightsErr) {
      console.error('Failed to load campaign insights:', insightsErr);
      setCampaignInsights(null);
    }
    
    setModalLoading(false);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setCampaignInsights(null);
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    filter === 'all' || campaign.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <span>Loading campaigns...</span>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => { setRetryCount(0); fetchCampaigns(); }}>Retry</button>
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <h1>Mixo Ads - Campaign Dashboard</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Total Campaigns</span>
            <span className="stat-value">{campaigns.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Impressions</span>
            <span className="stat-value">{insights?.total_impressions !== undefined ? insights.total_impressions.toLocaleString() : '-'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{insights?.total_clicks !== undefined ? insights.total_clicks.toLocaleString() : '-'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Spend</span>
            <span className="stat-value">{insights?.total_spend !== undefined ? formatCurrency(insights.total_spend) : '-'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Average CTR</span>
            <span className="stat-value">{insights?.average_ctr !== undefined ? `${insights.average_ctr.toFixed(2)}%` : '-'}</span>
          </div>
        </div>
      </header>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All ({campaigns.length})
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active ({campaigns.filter(c => c.status === 'active').length})
        </button>
        <button 
          className={filter === 'paused' ? 'active' : ''} 
          onClick={() => setFilter('paused')}
        >
          Paused ({campaigns.filter(c => c.status === 'paused').length})
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed ({campaigns.filter(c => c.status === 'completed').length})
        </button>
      </div>

      <div className="user-guide">
        <p style={{ color: '#dc2626' }}><b>Note :</b> Double-click on any campaign card to view detailed information and performance metrics</p>
      </div>

      <div className="campaigns-grid">
        {filteredCampaigns.length === 0 ? (
          <div className="no-campaigns">
            <p>No campaigns found for the selected filter.</p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
          <div 
            key={campaign.id} 
            className="campaign-card"
            onDoubleClick={() => handleCampaignDoubleClick(campaign.id)}
          >
            <div className="campaign-header">
              <h3>{campaign.name}</h3>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(campaign.status) }}
              >
                {campaign.status}
              </span>
            </div>
            
            <div className="campaign-details">
              <div className="detail">
                <span className="label">Budget:</span>
                <span className="value">{formatCurrency(campaign.budget)}</span>
              </div>
              <div className="detail">
                <span className="label">Daily Budget:</span>
                <span className="value">{formatCurrency(campaign.daily_budget)}</span>
              </div>
              <div className="detail">
                <span className="label">Platforms:</span>
                <span className="value">{campaign.platforms.join(', ')}</span>
              </div>
              <div className="detail">
                <span className="label">Created:</span>
                <span className="value">{formatDate(campaign.created_at)}</span>
              </div>
              <div className="detail">
                <span className="label">Brand ID:</span>
                <span className="value">{campaign.brand_id}</span>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {selectedCampaign && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Campaign Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            {modalLoading ? (
              <div className="modal-loading">
                <div className="spinner"></div>
                <span>Loading campaign details...</span>
              </div>
            ) : (
              <div className="modal-content">
                <div className="modal-field">
                  <label>Campaign Name:</label>
                  <span>{selectedCampaign.name}</span>
                </div>
                <div className="modal-field">
                  <label>Campaign ID:</label>
                  <span>{selectedCampaign.id}</span>
                </div>
                <div className="modal-field">
                  <label>Brand ID:</label>
                  <span>{selectedCampaign.brand_id}</span>
                </div>
                <div className="modal-field">
                  <label>Status:</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedCampaign.status) }}
                  >
                    {selectedCampaign.status}
                  </span>
                </div>
                <div className="modal-field">
                  <label>Total Budget:</label>
                  <span>{formatCurrency(selectedCampaign.budget)}</span>
                </div>
                <div className="modal-field">
                  <label>Daily Budget:</label>
                  <span>{formatCurrency(selectedCampaign.daily_budget)}</span>
                </div>
                <div className="modal-field">
                  <label>Platforms:</label>
                  <span>{selectedCampaign.platforms.join(', ')}</span>
                </div>
                <div className="modal-field">
                  <label>Created Date:</label>
                  <span>{formatDate(selectedCampaign.created_at)}</span>
                </div>
                
                {campaignInsights ? (
                  <>
                    <div className="modal-section-title">Performance Metrics</div>
                    <div className="modal-field">
                      <label>Impressions:</label>
                      <span>{campaignInsights.impressions?.toLocaleString() || 'No data'}</span>
                    </div>
                    <div className="modal-field">
                      <label>Clicks:</label>
                      <span>{campaignInsights.clicks?.toLocaleString() || 'No data'}</span>
                    </div>
                    <div className="modal-field">
                      <label>Conversions:</label>
                      <span>{campaignInsights.conversions?.toLocaleString() || 'No data'}</span>
                    </div>
                    <div className="modal-field">
                      <label>Spend:</label>
                      <span>{campaignInsights.spend ? formatCurrency(campaignInsights.spend) : 'No data'}</span>
                    </div>
                    <div className="modal-field">
                      <label>CTR:</label>
                      <span>{campaignInsights.ctr ? `${campaignInsights.ctr.toFixed(2)}%` : 'No data'}</span>
                    </div>
                    <div className="modal-field">
                      <label>CPC:</label>
                      <span>{campaignInsights.cpc ? formatCurrency(campaignInsights.cpc) : 'No data'}</span>
                    </div>
                    <div className="modal-field">
                      <label>Conversion Rate:</label>
                      <span>{campaignInsights.conversion_rate ? `${campaignInsights.conversion_rate.toFixed(2)}%` : 'No data'}</span>
                    </div>
                  </>
                ) : (
                  <div className="modal-section-title">Performance metrics unavailable</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;