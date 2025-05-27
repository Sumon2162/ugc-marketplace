import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../config/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      instagram: '',
      tiktok: '',
      youtube: '',
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          tiktok: user.socialLinks?.tiktok || '',
          youtube: user.socialLinks?.youtube || '',
        }
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      alert('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      alert('Last name is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Clean up social links - remove empty ones
      const cleanSocialLinks = Object.fromEntries(
        Object.entries(formData.socialLinks).filter(([_, value]) => value.trim() !== '')
      );

      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        website: formData.website.trim(),
        socialLinks: cleanSocialLinks
      };

      console.log('Updating profile with:', updateData);

      // Try different possible endpoints
      let response;
      try {
        response = await apiService.put('/users/profile', updateData);
      } catch (error: any) {
        if (error.response?.status === 404) {
          try {
            response = await apiService.put('/users/me', updateData);
          } catch (secondError: any) {
            if (secondError.response?.status === 404) {
              response = await apiService.put('/auth/profile', updateData);
            } else {
              throw secondError;
            }
          }
        } else {
          throw error;
        }
      }

      console.log('Profile updated successfully:', response.data);
      
      // Update the auth context with new user data
      if (updateUser) {
        updateUser({
          ...user,
          ...updateData
        });
      }

      alert('Profile updated successfully!');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: '0',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          padding: '32px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: 'white',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>Edit Profile</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px',
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
              }}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Location & Website */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder="City, Country"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Social Media</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  📸 Instagram
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder="@username or full URL"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  🎵 TikTok
                </label>
                <input
                  type="text"
                  value={formData.socialLinks.tiktok}
                  onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder="@username or full URL"
                />
              </div>
            </div>
          </div>

          {/* YouTube */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
              🎬 YouTube
            </label>
            <input
              type="text"
              value={formData.socialLinks.youtube}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
              }}
              placeholder="Channel URL"
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button
              onClick={onClose}
              style={{
                flex: '1',
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                flex: '1',
                padding: '12px',
                background: loading 
                  ? 'rgba(147, 51, 234, 0.5)' 
                  : 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;