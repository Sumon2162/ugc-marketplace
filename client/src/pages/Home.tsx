import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to UGC Marketplace</h1>
      
      {user?.userType === 'creator' ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Creator Dashboard</h2>
          <p className="mb-4">
            As a creator, you can upload your content and connect with clients looking for UGC creators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="font-medium text-primary-700 mb-2">Upload Content</h3>
              <p className="text-gray-600">
                Share your best videos to attract potential clients.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="font-medium text-primary-700 mb-2">Manage Matches</h3>
              <p className="text-gray-600">
                Connect with clients who are interested in your content.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Client Dashboard</h2>
          <p className="mb-4">
            As a client, you can discover creators and find the perfect match for your UGC needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-medium text-secondary-700 mb-2">Discover Creators</h3>
              <p className="text-gray-600">
                Browse through our talented pool of UGC creators.
              </p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-medium text-secondary-700 mb-2">Manage Projects</h3>
              <p className="text-gray-600">
                Keep track of your ongoing collaborations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;