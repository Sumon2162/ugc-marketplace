import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout
import AppLayout from './components/layouts/AppLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Placeholder components for routes that we'll implement later
const Home = () => <div>Home Page</div>;
const CreatorDashboard = () => <div>Creator Dashboard</div>;
const ClientDashboard = () => <div>Client Dashboard</div>;
const UploadVideo = () => <div>Upload Video Page</div>;
const Discover = () => <div>Discover Creators Page</div>;
const Matches = () => <div>Matches Page</div>;
const Messages = () => <div>Messages Page</div>;
const Profile = () => <div>Profile Page</div>;
const NotFound = () => <div>404 - Page Not Found</div>;

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              
              {/* Creator routes */}
              <Route path="creator" element={
                <ProtectedRoute userType="creator">
                  <CreatorDashboard />
                </ProtectedRoute>
              } />
              <Route path="upload" element={
                <ProtectedRoute userType="creator">
                  <UploadVideo />
                </ProtectedRoute>
              } />
              
              {/* Client routes */}
              <Route path="client" element={
                <ProtectedRoute userType="client">
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="discover" element={
                <ProtectedRoute userType="client">
                  <Discover />
                </ProtectedRoute>
              } />
              
              {/* Common routes */}
              <Route path="matches" element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              } />
              <Route path="messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;