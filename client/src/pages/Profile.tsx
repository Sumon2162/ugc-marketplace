import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../config/api';
import EditProfileModal from './EditProfileModal';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalEarnings: 0
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const fetchUserVideos = async () => {
    try {
      const response = await apiService.get('/videos/my-videos');
      console.log('Full Response:', response);
      console.log('Response Data:', response.data);
      console.log('Response Status:', response.status);
      
      // Handle different response structures
      let videosData = [];
      
      if (response && response.data && response.data.videos) {
        videosData = response.data.videos;
      } else if (response && response.data && Array.isArray(response.data)) {
        videosData = response.data;
      } else if (response && Array.isArray(response)) {
        videosData = response;
      } else if (response && response.videos) {
        videosData = response.videos;
      } else {
        console.log('Unexpected response structure:', response);
        videosData = [];
      }
      
      console.log('Final Videos Data:', videosData);
      setVideos(videosData);
      
      // Calculate stats from videos data
      const calculatedStats = {
        totalVideos: videosData.length,
        totalViews: videosData.reduce((sum: number, video: any) => sum + (video.views || 0), 0),
        totalLikes: videosData.reduce((sum: number, video: any) => sum + (video.likes || 0), 0),
        totalEarnings: videosData.reduce((sum: number, video: any) => sum + (video.earnings || 0), 0)
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchUserStats = async () => {
    // Stats are now calculated from videos data above
    // This function is kept for potential future use
  };

  const handleVideoView = (video: any) => {
    if (video.url) {
      window.open(video.url, '_blank');
    } else if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    } else {
      alert(`Viewing video: ${video.title}`);
    }
  };

  const handleUploadVideo = () => {
    window.location.href = '/upload';
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <div 
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      }}
    >
      <div 
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 16px',
          borderRadius: '16px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
        {value}
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '500', margin: 0 }}>
        {title}
      </p>
    </div>
  );

  const VideoCard = ({ video }: any) => (
    <div 
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div 
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontSize: '48px' }}>🎬</span>
          </div>
        )}
        <div 
          style={{
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '16px',
          }}
          className="video-overlay"
        >
          <button 
            onClick={() => handleVideoView(video)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            View Video
          </button>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: 'white', fontWeight: '600', margin: '0 0 8px 0', fontSize: '16px' }}>
          {video.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          <span>{video.views || 0} views</span>
          <span>{video.likes || 0} likes</span>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #6B46C1 0%, #1E40AF 50%, #3730A3 100%)',
      }}
    >
      {/* Floating Orbs */}
      <div style={{ position: 'fixed', inset: '0', overflow: 'hidden', pointerEvents: 'none' }}>
        <div 
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '384px',
            height: '384px',
            background: 'rgba(147, 51, 234, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '75%',
            right: '25%',
            width: '320px',
            height: '320px',
            background: 'rgba(236, 72, 153, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite 1s',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '33%',
            width: '288px',
            height: '288px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: '10', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Profile Header */}
          <div 
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    width: '96px',
                    height: '96px',
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  {user?.firstName?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '32px',
                    height: '32px',
                    background: '#10B981',
                    borderRadius: '50%',
                    border: '4px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                </div>
              </div>

              {/* Profile Info */}
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || 'Creator Name'
                  }
                </h1>
                <p style={{ color: '#C4B5FD', fontSize: '18px', margin: '0 0 16px 0' }}>
                  {user?.userType === 'creator' ? '🎬 Content Creator' : '🏢 Brand Partner'}
                </p>
                {user?.bio && (
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 16px 0', maxWidth: '512px' }}>
                    {user.bio}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                  {user?.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)' }}>
                      <span>📍</span> {user.location}
                    </span>
                  )}
                  {user?.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C4B5FD', textDecoration: 'none' }}
                    >
                      <span>🌐</span> Website
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={handleEditProfile}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleShareProfile}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <StatCard 
              title="Videos" 
              value={stats.totalVideos} 
              icon="🎬" 
              color="linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)"
            />
            <StatCard 
              title="Total Views" 
              value={stats.totalViews.toLocaleString()} 
              icon="👁️" 
              color="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
            />
            <StatCard 
              title="Likes" 
              value={stats.totalLikes.toLocaleString()} 
              icon="❤️" 
              color="linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
            />
            <StatCard 
              title="Earnings" 
              value={`$${stats.totalEarnings.toLocaleString()}`} 
              icon="💰" 
              color="linear-gradient(135deg, #10B981 0%, #059669 100%)"
            />
          </div>

          {/* Tabs */}
          <div 
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '4px', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['videos', 'analytics', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: activeTab === tab 
                      ? 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)'
                      : 'transparent',
                    color: activeTab === tab 
                      ? 'white'
                      : 'rgba(255,255,255,0.7)',
                    boxShadow: activeTab === tab 
                      ? '0 8px 32px rgba(0,0,0,0.3)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '24px' }}>
              {activeTab === 'videos' && (
                <div>
                  {videos.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                      {videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <div 
                        style={{
                          width: '96px',
                          height: '96px',
                          margin: '0 auto 24px',
                          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '48px' }}>🎬</span>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                        No videos yet
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 24px 0' }}>
                        Start creating content to showcase your work
                      </p>
                      <button 
                        onClick={handleUploadVideo}
                        style={{
                          padding: '12px 24px',
                          background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Upload First Video
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                      Performance Overview
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div 
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px 0' }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Video Engagement</span>
                          <span style={{ color: '#10B981' }}>+12%</span>
                        </div>
                        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px' }}>
                          <div 
                            style={{
                              background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                              height: '8px',
                              borderRadius: '4px',
                              width: '75%',
                            }}
                          />
                        </div>
                      </div>
                      <div 
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px 0' }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Audience Growth</span>
                          <span style={{ color: '#3B82F6' }}>+8%</span>
                        </div>
                        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '8px' }}>
                          <div 
                            style={{
                              background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
                              height: '8px',
                              borderRadius: '4px',
                              width: '60%',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                      Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div 
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px 0' }}>
                          New campaign application received
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>
                          2 hours ago
                        </p>
                      </div>
                      <div 
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px 0' }}>
                          Video approved for campaign
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>
                          5 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                    About
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    <div>
                      <div 
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <h4 style={{ color: 'white', fontWeight: '500', margin: '0 0 8px 0' }}>
                          Contact Information
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                          <p style={{ margin: 0 }}>📧 {user?.email}</p>
                          {user?.location && <p style={{ margin: 0 }}>📍 {user.location}</p>}
                          {user?.website && (
                            <p style={{ margin: 0 }}>
                              🌐 <a 
                                href={user.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: '#C4B5FD', textDecoration: 'none' }}
                              >
                                {user.website}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div 
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <h4 style={{ color: 'white', fontWeight: '500', margin: '0 0 8px 0' }}>
                          Account Details
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                          <p style={{ margin: 0 }}>Account Type: {user?.userType}</p>
                          <p style={{ margin: 0 }}>Member Since: {user ? new Date().getFullYear() : 'N/A'}</p>
                          <p style={{ margin: 0 }}>Status: Active ✅</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.8; }
          }
          
          .video-overlay {
            opacity: 0;
          }
          
          .video-overlay:hover {
            opacity: 1;
          }
        `}
      </style>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={() => {
          // Refresh the profile data after save
          fetchUserVideos();
        }}
      />
    </div>
  );
};

export default Profile;