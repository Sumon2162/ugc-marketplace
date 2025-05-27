import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../config/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'creator' | 'brand';
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  category?: string;
  rates?: {
    ugcVideo?: number;
    brandPartnership?: number;
    productReview?: number;
  };
  followers?: number;
  rating?: number;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          // Try to get fresh user data from backend
          try {
            const freshUserData = await apiService.getUserProfile();
            setUser(freshUserData);
            setIsAuthenticated(true);
          } catch (error) {
            // If backend call fails, use saved user data
            console.log('Using cached user data');
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const updatedUser = await apiService.updateUserProfile(userData);
      setUser(updatedUser);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error: any) {
      console.error('Update user error:', error);
      return { success: false, error: error.message || 'Update failed' };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};