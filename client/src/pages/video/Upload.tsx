import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../config/api';

const Upload: React.FC = () => {
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('lifestyle');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'lifestyle', label: 'Lifestyle', emoji: '🌟' },
    { id: 'beauty', label: 'Beauty', emoji: '💄' },
    { id: 'fashion', label: 'Fashion', emoji: '👗' },
    { id: 'fitness', label: 'Fitness', emoji: '💪' },
    { id: 'food', label: 'Food', emoji: '🍕' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'tech', label: 'Tech', emoji: '📱' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi'];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload MP4, MOV, or AVI files only');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 100MB');
      return;
    }

    setVideoFile(file);
    setError('');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title.trim() || !description.trim()) {
      setError('Please fill in all fields and select a video');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await apiService.uploadVideo(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setSuccess('🎉 Video uploaded successfully!');
        // Reset form
        setVideoFile(null);
        setTitle('');
        setDescription('');
        setCategory('lifestyle');
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 25%, #2d1b3d 50%, #1e3a8a 75%, #1e293b 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite',
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 8s ease-in-out infinite reverse',
      }}></div>

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '4rem 2rem 2rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ffffff, #a855f7, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
        }}>Upload Content</h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Share your creativity with the world. Upload high-quality videos and reach your audience.
        </p>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem 4rem',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Upload Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem',
        }}>
          {/* Error/Success Messages */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#fca5a5',
              textAlign: 'center',
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#6ee7b7',
              textAlign: 'center',
            }}>
              {success}
            </div>
          )}

          {/* File Upload Area */}
          <div
            style={{
              border: `2px dashed ${dragActive ? '#8b5cf6' : 'rgba(255, 255, 255, 0.3)'}`,
              borderRadius: '15px',
              padding: '3rem 2rem',
              textAlign: 'center',
              marginBottom: '2rem',
              transition: 'all 0.3s ease',
              background: dragActive ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mov,video/avi"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.7 }}>
              📹
            </div>
            
            {videoFile ? (
              <div>
                <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  ✅ {videoFile.name}
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  Drop your video here
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1rem' }}>
                  or click to browse files
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>
                  Supports MP4, MOV, AVI (Max 100MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                height: '8px',
                overflow: 'hidden',
                marginBottom: '0.5rem',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  height: '100%',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.3s ease',
                }}></div>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Title */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                📝 Video Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title"
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}>
                📄 Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video content, target audience, and key message"
                maxLength={500}
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {description.length}/500 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
              }}>
                🏷️ Category
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
              }}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: category === cat.id 
                        ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      {cat.emoji}
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || !videoFile || !title.trim() || !description.trim()}
            style={{
              width: '100%',
              padding: '1.5rem 2rem',
              marginTop: '2rem',
              background: uploading || !videoFile || !title.trim() || !description.trim()
                ? 'rgba(255, 255, 255, 0.2)'
                : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: uploading || !videoFile || !title.trim() || !description.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: uploading || !videoFile || !title.trim() || !description.trim() ? 0.5 : 1,
            }}
          >
            {uploading ? '⏳ Uploading...' : '🚀 Publish Video'}
          </button>
        </div>
      </div>

      {/* Add keyframes for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Upload;