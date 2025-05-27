// src/services/api.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generic fetch function with error handling
async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit & { isFormData?: boolean }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Don't automatically set Content-Type for FormData
  const headers = options?.isFormData
    ? {
        ...options?.headers
      }
    : {
        'Content-Type': 'application/json',
        ...options?.headers
      };
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      } catch (e) {
        throw new Error(`API Error: ${response.status}`);
      }
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Function to handle authentication token
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchFromAPI<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: any) =>
      fetchFromAPI<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    getCurrentUser: () => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      return fetchFromAPI<{ user: any }>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
  
  // Videos endpoints
  videos: {
    getAll: () =>
      fetchFromAPI<any[]>('/videos', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    
    getById: (id: string) =>
      fetchFromAPI<any>(`/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    
    upload: (formData: FormData) =>
      fetch(`${API_URL}/videos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }
        return response.json();
      }),
    
    getAnalytics: (videoId: string) =>
      fetchFromAPI<any>(`/videos/${videoId}/analytics`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
      
    getAnalyticsByTimeRange: (timeRange: string) =>
      fetchFromAPI<any>(`/analytics/videos?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
  },
  
  // Matches endpoints
  matches: {
    getAll: () =>
      fetchFromAPI<any[]>('/matches', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    
    getById: (id: string) =>
      fetchFromAPI<any>(`/matches/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    
    create: (creatorId: string) =>
      fetchFromAPI<any>('/matches', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ creatorId }),
      }),
    
    updateStatus: (id: string, status: 'accepted' | 'rejected' | 'completed') =>
      fetchFromAPI<any>(`/matches/${id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status }),
      }),
  },
  
  // Messages endpoints
  messages: {
    getByMatchId: (matchId: string) =>
      fetchFromAPI<any[]>(`/messages/match/${matchId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }),
    
    send: (matchId: string, content: string) =>
      fetchFromAPI<any>('/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ matchId, content }),
      }),
  },
  
  // General get method for compatibility
  get: (url: string, config?: { headers?: Record<string, string> }) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    return fetchFromAPI<any>(endpoint, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        ...config?.headers
      },
    }).then(data => ({ data })); // Wrap response to mimic axios format
  },
  
  // General post method for compatibility with config
  post: (url: string, data: any, config?: { headers?: Record<string, string> }) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    const isFormData = data instanceof FormData;
    
    return fetchFromAPI<any>(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        ...config?.headers
      },
      body: isFormData ? data : JSON.stringify(data),
      isFormData
    }).then(data => ({ data })); // Wrap response to mimic axios format
  },
  
  // General patch method for compatibility
  patch: (url: string, data: any, config?: { headers?: Record<string, string> }) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    return fetchFromAPI<any>(endpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        ...config?.headers
      },
      body: JSON.stringify(data),
    }).then(data => ({ data })); // Wrap response to mimic axios format
  },
  
  // General put method for compatibility
  put: (url: string, data: any, config?: { headers?: Record<string, string> }) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    return fetchFromAPI<any>(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        ...config?.headers
      },
      body: JSON.stringify(data),
    }).then(data => ({ data })); // Wrap response to mimic axios format
  }
};

// For default import compatibility
export default api;