import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
  totalViews: number;
  totalEarnings: number;
  totalVideos: number;
  totalFollowers: number;
  monthlyViews: number[];
  monthlyEarnings: number[];
  topVideos: Array<{
    title: string;
    views: number;
    earnings: number;
    thumbnail: string;
  }>;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const analyticsData: AnalyticsData = {
    totalViews: 1250000,
    totalEarnings: 15420,
    totalVideos: 47,
    totalFollowers: 8934,
    monthlyViews: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 78000, 82000, 89000, 95000],
    monthlyEarnings: [780, 920, 850, 1100, 1050, 1200, 1350, 1280, 1480, 1620, 1750, 1890],
    topVideos: [
      {
        title: "Summer Fashion Lookbook 2024",
        views: 89000,
        earnings: 1240,
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=225&fit=crop"
      },
      {
        title: "Skincare Routine That Changed My Life",
        views: 76000,
        earnings: 980,
        thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop"
      },
      {
        title: "Tech Review: Latest iPhone",
        views: 68000,
        earnings: 850,
        thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=225&fit=crop"
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 25%, #2d1b3d 50%, #1e3a8a 75%, #1e293b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            Analytics Dashboard
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem'
          }}>
            Track your performance and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Views', value: formatNumber(analyticsData.totalViews), icon: '👁️' },
            { label: 'Total Earnings', value: formatCurrency(analyticsData.totalEarnings), icon: '💰' },
            { label: 'Total Videos', value: analyticsData.totalVideos.toString(), icon: '🎥' },
            { label: 'Followers', value: formatNumber(analyticsData.totalFollowers), icon: '👥' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{stat.icon}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                  {stat.label}
                </span>
              </div>
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Monthly Views Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Monthly Views
            </h3>
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'end',
              gap: '0.5rem',
              padding: '1rem 0'
            }}>
              {analyticsData.monthlyViews.map((views, index) => {
                const maxViews = Math.max(...analyticsData.monthlyViews);
                const height = (views / maxViews) * 160;
                return (
                  <div key={index} style={{
                    flex: 1,
                    height: `${height}px`,
                    background: 'linear-gradient(to top, #8b5cf6, #a78bfa)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    paddingBottom: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#ffffff',
                    fontWeight: '500'
                  }}>
                    {formatNumber(views)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Earnings Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Monthly Earnings
            </h3>
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'end',
              gap: '0.5rem',
              padding: '1rem 0'
            }}>
              {analyticsData.monthlyEarnings.map((earnings, index) => {
                const maxEarnings = Math.max(...analyticsData.monthlyEarnings);
                const height = (earnings / maxEarnings) * 160;
                return (
                  <div key={index} style={{
                    flex: 1,
                    height: `${height}px`,
                    background: 'linear-gradient(to top, #06b6d4, #67e8f9)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    paddingBottom: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#ffffff',
                    fontWeight: '500'
                  }}>
                    ${earnings}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Videos */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Top Performing Videos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analyticsData.topVideos.map((video, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  style={{
                    width: '80px',
                    height: '45px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem'
                  }}>
                    {video.title}
                  </h4>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    <span>👁️ {formatNumber(video.views)} views</span>
                    <span>💰 {formatCurrency(video.earnings)} earned</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default Analytics;