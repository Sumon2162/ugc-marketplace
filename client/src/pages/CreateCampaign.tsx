import React, { useState } from 'react';
import { apiService } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface CampaignData {
  title: string;
  description: string;
  budget: number;
  category: string;
  deliverables: string[];
  timeline: string;
  requirements: string;
  targetAudience: string;
  brandGuidelines: string;
  contentType: string[];
  platforms: string[];
}

const CreateCampaign: React.FC = () => {
  const { user } = useAuth();
  
  const [campaign, setCampaign] = useState<CampaignData>({
    title: '',
    description: '',
    budget: 1000,
    category: 'Fashion & Beauty',
    deliverables: [],
    timeline: '1-2 weeks',
    requirements: '',
    targetAudience: '',
    brandGuidelines: '',
    contentType: [],
    platforms: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newDeliverable, setNewDeliverable] = useState('');

  const categories = [
    'Fashion & Beauty',
    'Lifestyle',
    'Technology',
    'Food & Cooking',
    'Travel',
    'Fitness & Health',
    'Gaming',
    'Home & Garden',
    'Parenting',
    'Business'
  ];

  const contentTypes = [
    'UGC Video',
    'Product Review',
    'Unboxing',
    'Tutorial/How-to',
    'Lifestyle Integration',
    'Before/After',
    'Testimonial',
    'Behind the Scenes'
  ];

  const platforms = [
    'Instagram',
    'TikTok',
    'YouTube',
    'Twitter',
    'Facebook',
    'Pinterest',
    'LinkedIn',
    'Snapchat'
  ];

  const timelines = [
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '2-3 months',
    '3+ months'
  ];

  const handleInputChange = (field: keyof CampaignData, value: any) => {
    setCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof CampaignData, value: string) => {
    setCampaign(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) 
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
        : [value]
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setCampaign(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()]
      }));
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (index: number) => {
    setCampaign(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Campaign created:', campaign);
      const response = await apiService.createCampaign(campaign);
      console.log('✅ API Response:', response);
    // Here you would submit to your backend
    alert('🎉 Campaign created successfully! Creators will now be able to see and apply for your campaign.');
    } catch (error) {
      console.error('❌ Campaign creation failed:', error);
      alert('Error creating campaign. Please try again.');
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 25%, #2d1b3d 50%, #1e3a8a 75%, #1e293b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        padding: '2rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            Create New Campaign
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem'
          }}>
            Launch your UGC campaign and connect with talented creators
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {[
            { step: 1, title: 'Basic Info', icon: '📝' },
            { step: 2, title: 'Requirements', icon: '📋' },
            { step: 3, title: 'Deliverables', icon: '🎯' },
            { step: 4, title: 'Review & Launch', icon: '🚀' }
          ].map(({ step, title, icon }) => (
            <div
              key={step}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: currentStep >= step ? 1 : 0.5
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= step 
                  ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' 
                  : 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                fontSize: '1.25rem'
              }}>
                {currentStep > step ? '✓' : icon}
              </div>
              <span style={{
                color: currentStep >= step ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                {title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          marginBottom: '2rem'
        }}>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                📝 Campaign Basic Information
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={campaign.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Summer Fashion Collection Launch"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Campaign Description *
                  </label>
                  <textarea
                    value={campaign.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your campaign objectives, brand story, and what you're looking for..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      Budget ($) *
                    </label>
                    <input
                      type="number"
                      value={campaign.budget}
                      onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                      min="100"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      Category *
                    </label>
                    <select
                      value={campaign.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} style={{ background: '#1a1a2e', color: '#ffffff' }}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem'
                    }}>
                      Timeline *
                    </label>
                    <select
                      value={campaign.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      {timelines.map(timeline => (
                        <option key={timeline} value={timeline} style={{ background: '#1a1a2e', color: '#ffffff' }}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 2 && (
            <div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                📋 Campaign Requirements
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Content Types *
                  </label>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    Select all content types you'd like creators to produce
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {contentTypes.map(type => (
                      <label key={type} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: campaign.contentType.includes(type) 
                          ? 'rgba(139, 92, 246, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: campaign.contentType.includes(type)
                          ? '1px solid rgba(139, 92, 246, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={campaign.contentType.includes(type)}
                          onChange={() => handleArrayToggle('contentType', type)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span style={{
                          color: '#ffffff',
                          fontSize: '0.875rem'
                        }}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Target Platforms *
                  </label>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    Where should the content be published?
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {platforms.map(platform => (
                      <label key={platform} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: campaign.platforms.includes(platform) 
                          ? 'rgba(6, 182, 212, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: campaign.platforms.includes(platform)
                          ? '1px solid rgba(6, 182, 212, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={campaign.platforms.includes(platform)}
                          onChange={() => handleArrayToggle('platforms', platform)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span style={{
                          color: '#ffffff',
                          fontSize: '0.875rem'
                        }}>
                          {platform}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Target Audience
                  </label>
                  <textarea
                    value={campaign.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="Describe your target audience (age, interests, demographics, etc.)"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Additional Requirements
                  </label>
                  <textarea
                    value={campaign.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Any specific requirements, restrictions, or guidelines creators should know about..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Deliverables */}
          {currentStep === 3 && (
            <div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                🎯 Campaign Deliverables
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Add Deliverables
                  </label>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    List specific deliverables creators need to provide (e.g., "3 Instagram posts", "1 TikTok video", "Product photos")
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      placeholder="e.g., 3 Instagram feed posts"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && addDeliverable()}
                    />
                    <button
                      onClick={addDeliverable}
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Add
                    </button>
                  </div>

                  {campaign.deliverables.length > 0 && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h4 style={{
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: '500',
                        marginBottom: '0.75rem'
                      }}>
                        Campaign Deliverables:
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {campaign.deliverables.map((deliverable, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px'
                          }}>
                            <span style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                              • {deliverable}
                            </span>
                            <button
                              onClick={() => removeDeliverable(index)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.25rem 0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    Brand Guidelines
                  </label>
                  <textarea
                    value={campaign.brandGuidelines}
                    onChange={(e) => handleInputChange('brandGuidelines', e.target.value)}
                    placeholder="Share your brand guidelines, color schemes, tone of voice, dos and don'ts, etc."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Launch */}
          {currentStep === 4 && (
            <div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                🚀 Review & Launch Campaign
              </h3>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2rem'
              }}>
                <h4 style={{
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Campaign Summary
                </h4>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Title:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>{campaign.title || 'Not specified'}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Budget:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Category:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>{campaign.category}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Timeline:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>{campaign.timeline}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Content Types:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>
                      {campaign.contentType.length > 0 ? campaign.contentType.join(', ') : 'None selected'}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Platforms:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>
                      {campaign.platforms.length > 0 ? campaign.platforms.join(', ') : 'None selected'}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#a78bfa' }}>Deliverables:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>
                      {campaign.deliverables.length > 0 ? `${campaign.deliverables.length} items` : 'None specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <p style={{
                  color: '#10b981',
                  fontSize: '0.875rem',
                  margin: 0
                }}>
                  ✅ Once launched, your campaign will be visible to creators who match your criteria. 
                  You'll receive applications that you can review and approve.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{
              background: currentStep === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              color: currentStep === 1 ? 'rgba(255, 255, 255, 0.5)' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Previous
          </button>

          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: currentStep >= step ? '#8b5cf6' : 'rgba(255, 255, 255, 0.3)'
                }}
              />
            ))}
          </div>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 2rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
            >
              🚀 Launch Campaign
            </button>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default CreateCampaign;