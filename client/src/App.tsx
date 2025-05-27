import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Upload from './pages/video/Upload';
import Discovery from './pages/Discovery';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import CreateCampaign from './pages/CreateCampaign';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CampaignBrowse from './pages/CampaignBrowse';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/discovery" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute><CampaignBrowse /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;