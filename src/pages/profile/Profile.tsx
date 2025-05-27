import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../config/api';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  location: string;
  category: string;
  socialLinks: {
    website: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  rates: {
    shortVideo: number;
    longVideo: number;
    socialPost: number;
  };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    category: user?.category || '',
    socialLinks: {
      website: user?.socialLinks?.website || '',
      instagram: user?.socialLinks?.instagram || '',
      tiktok: user?.socialLinks?.tiktok || '',
      youtube: user?.socialLinks?.youtube || '',
    },
    rates: {
      shortVideo: user?.rates?.shortVideo || 100,
      longVideo: user?.rates?.longVideo || 500,
      socialPost: user?.rates?.socialPost || 50,
    }
  });

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyVideos();
      setVideos(response.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiService.updateUserProfile(profileData);
      setIsEditing(false);
      // Show success message or update user context
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProfileData],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 
pt-20">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full 
blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full 
blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your profile and creator settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-black/20 p-1 rounded-xl backdrop-blur-sm">
          {[
            { id: 'profile', label: 'Profile Info', icon: '👤' },
            { id: 'social', label: 'Social Links', icon: '🔗' },
            { id: 'pricing', label: 'Pricing', icon: '💰' },
            { id: 'videos', label: 'My Videos', icon: '🎥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 
rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 
text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  {isEditing ? 'Save Changes' : '✏️ Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none 
disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none 
disabled:opacity-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-gray-400 opacity-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none 
disabled:opacity-50"
                    placeholder="Tell us about yourself and your content creation style..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none 
disabled:opacity-50"
                    placeholder="Your city/country"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    value={profileData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Select Category</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="fashion">Fashion</option>
                    <option value="fitness">Fitness</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="tech">Tech</option>
                    <option value="beauty">Beauty</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Social Media Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">🌐 Website</label>
                  <input
                    type="url"
                    value={profileData.socialLinks.website}
                    onChange={(e) => handleInputChange('socialLinks.website', 
e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">📷 Instagram</label>
                  <input
                    type="text"
                    value={profileData.socialLinks.instagram}
                    onChange={(e) => handleInputChange('socialLinks.instagram', 
e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="@yourusername"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">🎵 TikTok</label>
                  <input
                    type="text"
                    value={profileData.socialLinks.tiktok}
                    onChange={(e) => handleInputChange('socialLinks.tiktok', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="@yourusername"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">📺 YouTube</label>
                  <input
                    type="text"
                    value={profileData.socialLinks.youtube}
                    onChange={(e) => handleInputChange('socialLinks.youtube', 
e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Channel Name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Content Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 
rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">🎥 Short Video</h3>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Rate (USD)</label>
                    <input
                      type="number"
                      value={profileData.rates.shortVideo}
                      onChange={(e) => handleInputChange('rates.shortVideo', 
parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 
rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <p className="text-sm text-gray-400">15-60 second videos</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 
rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">📹 Long Video</h3>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Rate (USD)</label>
                    <input
                      type="number"
                      value={profileData.rates.longVideo}
                      onChange={(e) => handleInputChange('rates.longVideo', 
parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 
rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <p className="text-sm text-gray-400">1+ minute videos</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 
rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">📱 Social Post</h3>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Rate (USD)</label>
                    <input
                      type="number"
                      value={profileData.rates.socialPost}
                      onChange={(e) => handleInputChange('rates.socialPost', 
parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 
rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <p className="text-sm text-gray-400">Static posts & stories</p>
                </div>
              </div>
            </div>
          )}

          {/* My Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">My Videos</h2>
                <button
                  onClick={fetchUserVideos}
                  className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg 
hover:bg-purple-600/30 transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 
border-purple-500"></div>
                  <span className="ml-3 text-gray-300">Loading videos...</span>
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video: any) => (
                    <div key={video._id} className="bg-white/5 rounded-xl overflow-hidden 
border border-white/10 hover:border-purple-500/50 transition-colors">
                      <div className="aspect-video bg-gray-800 flex items-center 
justify-center">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={video.title} className="w-full 
h-full object-cover" />
                        ) : (
                          <div className="text-gray-400">🎥 {video.title}</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{video.description}</p>
                        <div className="flex justify-between items-center text-xs 
text-gray-500">
                          <span>{video.category}</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
                  <p className="text-gray-400 mb-6">Upload your first video to get 
started!</p>
                  <a
                    href="/upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r 
from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all 
duration-200"
                  >
                    📹 Upload Video
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
