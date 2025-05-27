import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

interface VideoAnalytics {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  watchTime: number;
}

interface OverviewStats {
  totalViews: number;
  totalLikes: number;
  totalVideos: number;
  avgWatchTime: number;
}

const VideoAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [analytics, setAnalytics] = useState<VideoAnalytics[]>([]);
  const [stats, setStats] = useState<OverviewStats>({
    totalViews: 0,
    totalLikes: 0,
    totalVideos: 0,
    avgWatchTime: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Using our compatible get method
        const analyticsResponse = await api.get(`/analytics/videos?timeRange=${timeRange}`);
        
        // If the API returns data in a nested format like { data: { videos: [...] }}
        // This will handle it because our api.get method wraps the response in { data: ... }
        setAnalytics(analyticsResponse.data.videos || []);
        
        // Fetch overview statistics
        const statsResponse = await api.get(`/analytics/overview?timeRange=${timeRange}`);
        setStats(statsResponse.data.stats || {
          totalViews: 0,
          totalLikes: 0,
          totalVideos: 0,
          avgWatchTime: 0
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load analytics data');
        
        // Set mock data for development
        setAnalytics([
          { 
            videoId: '1', 
            title: 'Product Demo',
            views: 1250, 
            likes: 85,
            comments: 32,
            watchTime: 145 
          },
          { 
            videoId: '2', 
            title: 'Travel Vlog',
            views: 3450, 
            likes: 240,
            comments: 87,
            watchTime: 210 
          }
        ]);
        
        setStats({
          totalViews: 4700,
          totalLikes: 325,
          totalVideos: 2,
          avgWatchTime: 178
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Video Analytics</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeRangeChange('7d')}
            className={`px-3 py-1 rounded ${
              timeRange === '7d' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => handleTimeRangeChange('30d')}
            className={`px-3 py-1 rounded ${
              timeRange === '30d' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => handleTimeRangeChange('90d')}
            className={`px-3 py-1 rounded ${
              timeRange === '90d' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Views</h3>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Likes</h3>
              <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Videos</h3>
              <p className="text-2xl font-bold">{stats.totalVideos.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Avg. Watch Time</h3>
              <p className="text-2xl font-bold">{stats.avgWatchTime}s</p>
            </div>
          </div>
          
          {/* Video List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Watch Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.map((video) => (
                  <tr key={video.videoId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{video.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{video.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{video.likes.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{video.comments.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{video.watchTime}s</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoAnalytics;