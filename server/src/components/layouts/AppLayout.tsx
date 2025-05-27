import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  UGC Hub
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              {user && (
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">
                      Hi, {user.firstName}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
              >
                Home
              </Link>
              
              {user?.userType === 'creator' ? (
                <>
                  <Link
                    to="/creator"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
                  >
                    Upload Video
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/client"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/discover"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
                  >
                    Discover Creators
                  </Link>
                </>
              )}
              
              <Link
                to="/matches"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
              >
                Matches
              </Link>
              
              <Link
                to="/messages"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
              >
                Messages
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-md"
              >
                Profile
              </Link>
            </nav>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;