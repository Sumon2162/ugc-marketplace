// API Configuration - Hardcoded production URL
export const API_BASE_URL = 'https://ugc-marketplace.onrender.com/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Health check
  health: '/health',
  
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  
  // User management
  user: {
    profile: '/user/profile',
  },
  
  // Videos
  videos: {
    upload: '/videos/upload',
    myVideos: '/videos/my-videos',
    all: '/videos',
  },
  
  // Campaigns
  campaigns: {
    create: '/campaigns',
    all: '/campaigns',
    apply: (id) => `/campaigns/${id}/apply`,
  },
  
  // Messaging
  messages: {
    matches: '/matches',
    messages: (matchId) => `/messages/${matchId}`,
    send: '/messages',
  },
  
  // Analytics
  analytics: '/analytics',
  
  // Creators
  creators: {
    discover: '/creators/discover',
  },
};

// API Helper Functions
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async upload(endpoint, formData) {
    const token = this.getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  async login(email, password) {
    const response = await this.post(API_ENDPOINTS.auth.login, { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async register(userData) {
    const response = await this.post(API_ENDPOINTS.auth.register, userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getUserProfile() {
    return this.get(API_ENDPOINTS.user.profile);
  }

  async updateUserProfile(userData) {
    return this.put(API_ENDPOINTS.user.profile, userData);
  }

  async uploadVideo(formData) {
    return this.upload(API_ENDPOINTS.videos.upload, formData);
  }

  async getMyVideos() {
    return this.get(API_ENDPOINTS.videos.myVideos);
  }

  async getAllVideos(page = 1, category = '') {
    const params = new URLSearchParams({ page: page.toString() });
    if (category) params.append('category', category);
    return this.get(`${API_ENDPOINTS.videos.all}?${params}`);
  }

  async createCampaign(campaignData) {
    return this.post(API_ENDPOINTS.campaigns.create, campaignData);
  }

  async getAllCampaigns(page = 1, category = '') {
    const params = new URLSearchParams({ page: page.toString() });
    if (category) params.append('category', category);
    return this.get(`${API_ENDPOINTS.campaigns.all}?${params}`);
  }

  async applyToCampaign(campaignId, proposal) {
    return this.post(API_ENDPOINTS.campaigns.apply(campaignId), { proposal });
  }

  async discoverCreators(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    return this.get(`${API_ENDPOINTS.creators.discover}?${params}`);
  }

  async getMatches() {
    return this.get(API_ENDPOINTS.messages.matches);
  }

  async getMessages(matchId) {
    return this.get(API_ENDPOINTS.messages.messages(matchId));
  }

  async sendMessage(matchId, content) {
    return this.post(API_ENDPOINTS.messages.send, { matchId, content });
  }

  async getAnalytics() {
    return this.get(API_ENDPOINTS.analytics);
  }

  async checkHealth() {
    return this.get(API_ENDPOINTS.health);
  }
}

export const apiService = new ApiService();
export default apiService;
