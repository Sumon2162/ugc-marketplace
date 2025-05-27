import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Rating {
  _id: string;
  rater: {
    _id: string;
    firstName: string;
    lastName: string;
    profile?: {
      profileImageUrl?: string;
    };
    company?: {
      name: string;
    };
  };
  rated: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  review: string;
  match: {
    _id: string;
    projectDetails: {
      title: string;
    };
  };
  createdAt: string;
}

interface RatingFormProps {
  matchId: string;
  ratedUserId: string;
  ratedUserName: string;
  projectTitle: string;
  onRatingSubmitted: () => void;
  onCancel: () => void;
}

interface RatingDisplayProps {
  userId: string;
  showForm?: boolean;
}

const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}> = ({ rating, onRatingChange, size = 'md', interactive = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${
            interactive ? 'cursor-pointer' : ''
          } ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const RatingForm: React.FC<RatingFormProps> = ({
  matchId,
  ratedUserId,
  ratedUserName,
  projectTitle,
  onRatingSubmitted,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/ratings', {
        matchId,
        ratedUserId,
        rating,
        review: review.trim()
      });

      toast.success('Rating submitted successfully');
      onRatingSubmitted();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">
        Rate your experience with {ratedUserName}
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Project: {projectTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
            interactive
          />
          <p className="text-xs text-gray-500 mt-1">
            {rating === 0 && 'Click to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Review (Optional)
          </label>
          <textarea
            id="review"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Share your experience working with this person..."
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {review.length}/500 characters
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const RatingDisplay: React.FC<RatingDisplayProps> = ({ userId, showForm = true }) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [pendingRatings, setPendingRatings] = useState<any[]>([]);

  useEffect(() => {
    fetchRatings();
    if (showForm) {
      fetchPendingRatings();
    }
  }, [userId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ratings/user/${userId}`);
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRatings = async () => {
    try {
      const response = await api.get('/ratings/pending');
      setPendingRatings(response.data);
    } catch (error) {
      console.error('Error fetching pending ratings:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Ratings Alert */}
      {showForm && pendingRatings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Pending Ratings
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You have {pendingRatings.length} completed project{pendingRatings.length !== 1 ? 's' : ''} waiting for your rating.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="text-yellow-800 underline hover:text-yellow-900"
                  >
                    Rate now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Form Modal */}
      {showRatingForm && pendingRatings.length > 0 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <RatingForm
              matchId={pendingRatings[0]._id}
              ratedUserId={user?.userType === 'creator' ? pendingRatings[0].brand._id : pendingRatings[0].creator._id}
              ratedUserName={user?.userType === 'creator' 
                ? `${pendingRatings[0].brand.firstName} ${pendingRatings[0].brand.lastName}`
                : `${pendingRatings[0].creator.firstName} ${pendingRatings[0].creator.lastName}`
              }
              projectTitle={pendingRatings[0].projectDetails.title}
              onRatingSubmitted={() => {
                setShowRatingForm(false);
                fetchPendingRatings();
                fetchRatings();
              }}
              onCancel={() => setShowRatingForm(false)}
            />
          </div>
        </div>
      )}

      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Ratings & Reviews</h3>
          <div className="text-right">
            <div className="flex items-center">
              <StarRating rating={averageRating} size="md" />
              <span className="ml-2 text-lg font-bold">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{totalRatings} review{totalRatings !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Rating Distribution */}
        {totalRatings > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h4>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter(r => r.rating === star).length;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center mb-1">
                  <span className="text-sm w-3">{star}</span>
                  <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Individual Reviews */}
      {ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                    {rating.rater.profile?.profileImageUrl ? (
                      <img
                        src={rating.rater.profile.profileImageUrl}
                        alt={`${rating.rater.firstName} ${rating.rater.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-800 text-sm font-medium">
                        {rating.rater.firstName.charAt(0)}{rating.rater.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {rating.rater.firstName} {rating.rater.lastName}
                    </p>
                    {rating.rater.company?.name && (
                      <p className="text-xs text-gray-500">{rating.rater.company.name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <StarRating rating={rating.rating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">{formatDate(rating.createdAt)}</p>
                </div>
              </div>

              {rating.review && (
                <div className="mb-3">
                  <p className="text-gray-700">{rating.review}</p>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t pt-2">
                Project: {rating.match.projectDetails.title}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Reviews will appear here after completed projects.
          </p>
        </div>
      )}
    </div>
  );
};

export { RatingForm, RatingDisplay, StarRating };