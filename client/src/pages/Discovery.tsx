import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const mockCreators = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: '@sarahjohnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    followers: 125000,
    category: 'Lifestyle',
    location: 'Los Angeles, CA',
    rating: 4.9,
    verified: true,
    tags: ['Beauty', 'Fashion', 'Wellness'],
    bio: 'Lifestyle content creator passionate about sustainable living and authentic storytelling. Love creating content that inspires and connects.',
    priceRange: '$500 - $2,000',
    responseTime: '< 2 hours'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    username: '@marcuschen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    followers: 89000,
    category: 'Technology',
    location: 'San Francisco, CA',
    rating: 4.8,
    verified: true,
    tags: ['Tech Reviews', 'Gadgets', 'AI'],
    bio: 'Tech enthusiast creating in-depth reviews and tutorials. Specializing in emerging technologies and their real-world applications.',
    priceRange: '$800 - $3,000',
    responseTime: '< 4 hours'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    username: '@emmarod',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&h=400&fit=crop&crop=face',
    followers: 156000,
    category: 'Food & Cooking',
    location: 'Austin, TX',
    rating: 4.9,
    verified: true,
    tags: ['Recipe Development', 'Food Photography', 'Restaurants'],
    bio: 'Food content creator and recipe developer. Creating mouth-watering content that brings people together around great food.',
    priceRange: '$600 - $2,500',
    responseTime: '< 1 hour'
  }
];

const Discovery: React.FC = () => {
  const { user } = useAuth();
  const [creators, setCreators] = useState(mockCreators);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCreator = creators[currentIndex];

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  if (currentIndex >= creators.length) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(88, 28, 135) 50%, rgb(30, 64, 175) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Effects */}
        <div style={{
          position: 'absolute',
          inset: '0',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '18rem',
            height: '18rem',
            background: 'rgba(147, 51, 234, 0.3)',
            borderRadius: '50%',
            filter: 'blur(3rem)',
            animation: 'pulse 3s infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '75%',
            right: '25%',
            width: '24rem',
            height: '24rem',
            background: 'rgba(59, 130, 246, 0.3)',
            borderRadius: '50%',
            filter: 'blur(3rem)',
            animation: 'pulse 3s infinite',
            animationDelay: '1.5s'
          }}></div>
        </div>

        <div style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 10
        }}>
          <div style={{
            width: '6rem',
            height: '6rem',
            background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(59, 130, 246))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontSize: '1.875rem'
          }}>
            ✓
          </div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0'
          }}>
            You've seen all creators!
          </h2>
          <p style={{
            color: 'rgba(156, 163, 175, 1)',
            maxWidth: '24rem',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            Check back later for more amazing creators, or refine your search criteria.
          </p>
          <Link 
            to="/dashboard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(59, 130, 246))',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(88, 28, 135) 50%, rgb(30, 64, 175) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        inset: '0',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '18rem',
          height: '18rem',
          background: 'rgba(147, 51, 234, 0.3)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 3s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '75%',
          right: '25%',
          width: '24rem',
          height: '24rem',
          background: 'rgba(59, 130, 246, 0.3)',
          borderRadius: '50%',
          filter: 'blur(3rem)',
          animation: 'pulse 3s infinite',
          animationDelay: '1.5s'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem 1.5rem',
        maxWidth: '28rem',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <Link 
            to="/dashboard"
            style={{
              color: 'rgba(156, 163, 175, 1)',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← Back
          </Link>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>
            Discover Creators
          </h1>
          <div style={{ width: '4rem' }}></div>
        </div>

        {/* Creator Card */}
        <div style={{ position: 'relative' }}>
          <div
            ref={cardRef}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              transform: isAnimating 
                ? swipeDirection === 'left' 
                  ? 'translateX(-100%) rotate(-12deg)' 
                  : 'translateX(100%) rotate(12deg)'
                : 'translateX(0) rotate(0)',
              opacity: isAnimating ? 0 : 1,
              transition: 'all 0.3s ease-out',
              height: '37.5rem'
            }}
          >
            {/* Creator Image */}
            <div style={{
              position: 'relative',
              height: '66.67%'
            }}>
              <img
                src={currentCreator.avatar}
                alt={currentCreator.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)'
              }}></div>
              
              {/* Verified Badge */}
              {currentCreator.verified && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgb(59, 130, 246)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem' }}>✓</span>
                </div>
              )}

              {/* Stats Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem'
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {formatFollowers(currentCreator.followers)} followers
                  </span>
                </div>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span style={{ color: 'rgb(251, 191, 36)', fontSize: '0.875rem' }}>★</span>
                  <span style={{
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {currentCreator.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0
                }}>
                  {currentCreator.name}
                </h2>
                <span style={{
                  color: 'rgba(156, 163, 175, 1)',
                  fontSize: '0.875rem'
                }}>
                  {currentCreator.username}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.875rem',
                color: 'rgba(156, 163, 175, 1)',
                marginBottom: '1rem'
              }}>
                <span>{currentCreator.category}</span>
                <span>•</span>
                <span>{currentCreator.location}</span>
              </div>

              <p style={{
                color: 'rgba(209, 213, 219, 1)',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: '0 0 1rem 0'
              }}>
                {currentCreator.bio}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                {currentCreator.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(147, 51, 234, 0.3)',
                      color: 'rgba(196, 181, 253, 1)',
                      borderRadius: '9999px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <span style={{ color: 'rgba(156, 163, 175, 1)' }}>Price Range</span>
                  <p style={{
                    color: 'white',
                    fontWeight: '500',
                    margin: '0.25rem 0 0 0'
                  }}>
                    {currentCreator.priceRange}
                  </p>
                </div>
                <div>
                  <span style={{ color: 'rgba(156, 163, 175, 1)' }}>Response Time</span>
                  <p style={{
                    color: 'white',
                    fontWeight: '500',
                    margin: '0.25rem 0 0 0'
                  }}>
                    {currentCreator.responseTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            position: 'absolute',
            bottom: '-4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <button
              onClick={() => handleSwipe('left')}
              style={{
                width: '4rem',
                height: '4rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgb(239, 68, 68)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: 'rgb(239, 68, 68)',
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>
            
            <button
              onClick={() => handleSwipe('right')}
              style={{
                width: '4rem',
                height: '4rem',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid rgb(34, 197, 94)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: 'rgb(34, 197, 94)',
                transition: 'all 0.3s ease'
              }}
            >
              ♥
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div style={{
          marginTop: '5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {creators.map((_, index) => (
            <div
              key={index}
              style={{
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '50%',
                background: index < currentIndex 
                  ? 'rgb(147, 51, 234)' 
                  : index === currentIndex 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discovery;