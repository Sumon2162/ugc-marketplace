import React from 'react';
import toast from '../../utils/toast';

const Discover: React.FC = () => {
  const handleMatch = () => {
    // Mock the match functionality
    const currentVideo = {
      creator: { firstName: 'Jane' }
    };
    
    try {
      // Simulate a 400 error to test the toast.info
      const error = { response: { status: 400 } };
      if (error.response?.status === 400) {
        toast.info(`You've already matched with ${currentVideo.creator.firstName}`);
      } else {
        toast.error('Failed to create match');
      }
    } catch (error) {
      console.error('Match error:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Discover Creators</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-4">Find creators that match your needs</p>
        <button 
          onClick={handleMatch}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Test Match Toast
        </button>
      </div>
    </div>
  );
};

export default Discover;