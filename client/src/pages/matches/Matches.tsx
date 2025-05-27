// src/pages/matches/Matches.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Match, User } from '../../types';
import { useMatches, useUpdateMatchStatus } from '../../hooks/useQueries';

const Matches: React.FC = () => {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Use React Query to fetch matches
  const { data: matches, isLoading, error } = useMatches();
  const updateMatchStatus = useUpdateMatchStatus();

  const getOtherUser = (match: Match): User => {
    if (!user) return match.brand; // Default fallback
    return user.userType === 'creator' ? match.brand : match.creator;
  };

  const handleUpdateStatus = (id: string, status: 'accepted' | 'rejected' | 'completed') => {
    updateMatchStatus.mutate({ id, status });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>Error loading matches. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  // If no matches found
  if (!matches || matches.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">You don't have any matches yet.</p>
          {user?.userType === 'brand' && (
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Discover Creators
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Match List</h2>
          </div>
          
          <div className="divide-y">
            {matches.map((match: Match) => (
              <div
                key={match._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center ${
                  selectedMatch?._id === match._id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  {getOtherUser(match).profile?.profileImageUrl && (
                    <img
                      src={getOtherUser(match).profile?.profileImageUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {getOtherUser(match).firstName} {getOtherUser(match).lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white shadow rounded-lg">
          {selectedMatch ? (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                  {getOtherUser(selectedMatch).profile?.profileImageUrl && (
                    <img
                      src={getOtherUser(selectedMatch).profile?.profileImageUrl || ''}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">
                    {getOtherUser(selectedMatch).firstName} {getOtherUser(selectedMatch).lastName}
                  </h4>
                  {user?.userType === 'creator' && getOtherUser(selectedMatch).company?.name && (
                    <p className="text-gray-600">{getOtherUser(selectedMatch).company?.name}</p>
                  )}
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <span className={`inline-block h-2 w-2 rounded-full ${
                        selectedMatch.status === 'accepted' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                      <span className="text-sm ml-1">
                        {selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h5 className="font-medium mb-2">Match Details</h5>
                <p className="text-sm text-gray-600">
                  Matched on {new Date(selectedMatch.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {selectedMatch.status === 'pending' && user?.userType === 'creator' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(selectedMatch._id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedMatch._id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </>
                )}
                
                {selectedMatch.status === 'accepted' && (
                  <>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                      Message
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                      View Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Select a match to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;