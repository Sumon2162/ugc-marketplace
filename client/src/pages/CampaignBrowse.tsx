import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../config/api';

interface Campaign {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  timeline: string;
  contentTypes?: string[];
  platforms?: string[];
  brand: {
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  createdAt: string;
  status: string;
}

const CampaignBrowse: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await apiService.getAllCampaigns();
      setCampaigns(response.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyToCampaign = async (campaignId: string) => {
    try {
      const proposal = prompt("Please enter your proposal for this campaign:");
      if (!proposal) return;

      await apiService.post(`/campaigns/${campaignId}/apply`, {
        proposal
      });
      
      alert('💎💎 Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to campaign:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 25%, #2d1b3d 50%, #1e3a8a 75%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading amazing campaigns...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 25%, #2d1b3d 50%, #1e3a8a 75%, #1e293b 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
      }}></div>

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '4rem 2rem 3rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ffffff, #a855f7, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
        }}>Browse Campaigns</h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Discover exciting brand partnerships and grow your creator business
        </p>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Campaigns grid */}
        {campaigns.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem',
          }}>
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '1rem',
                }}>{campaign.title}</h3>
                
                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '1.5rem',
                  lineHeight: 1.5,
                }}>{campaign.description}</p>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Budget</span>
                    <span style={{
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                    }}>${campaign.budget.toLocaleString()}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Category</span>
                    <span style={{ color: '#a855f7', fontWeight: '600' }}>
                      {campaign.category}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Timeline</span>
                    <span style={{ color: 'white' }}>{campaign.timeline}</span>
                  </div>
                </div>

                <button
                  onClick={() => applyToCampaign(campaign._id)}
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    border: 'none',
                    borderRadius: '15px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  🚀 Apply Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🎯</div>
            <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>
              No campaigns available
            </h2>
            <p>Check back soon for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignBrowse;
