import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialUserType = searchParams.get('type') as 'creator' | 'brand' || 'creator';
  
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'creator' | 'brand'>(initialUserType);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    website: '',
    industry: '',
    bio: '',
    socialMedia: {
      instagram: '',
      tiktok: '',
      youtube: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    backgroundOrb1: {
      position: 'absolute' as const,
      top: '-20%',
      right: '-10%',
      width: '60rem',
      height: '60rem',
      background: 'radial-gradient(circle, rgba(139, 69, 255, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float 20s ease-in-out infinite',
      zIndex: 1
    },
    backgroundOrb2: {
      position: 'absolute' as const,
      bottom: '-30%',
      left: '-20%',
      width: '50rem',
      height: '50rem',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float 25s ease-in-out infinite reverse',
      zIndex: 1
    },
    noise: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.02,
      pointerEvents: 'none' as const,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      zIndex: 1
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '24px',
      padding: '3rem',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 32px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      width: '100%',
      maxWidth: '480px',
      position: 'relative' as const,
      zIndex: 10
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2.5rem'
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(255, 255, 255, 0.6)',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '2rem',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '2rem'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #8B45FF 0%, #3B82F6 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '700',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(139, 69, 255, 0.3)'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '600',
      letterSpacing: '-0.025em',
      color: '#ffffff'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '1.5'
    },
    progressBar: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem'
    },
    progressStep: {
      flex: 1,
      height: '3px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    progressStepActive: {
      background: 'linear-gradient(90deg, #8B45FF, #3B82F6)',
      animation: 'progress 0.3s ease-out'
    },
    userTypeSelector: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '2rem'
    },
    userTypeCard: {
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center' as const,
      backdropFilter: 'blur(20px)'
    },
    userTypeCardActive: {
      background: 'rgba(139, 69, 255, 0.15)',
      borderColor: 'rgba(139, 69, 255, 0.5)',
      boxShadow: '0 8px 32px rgba(139, 69, 255, 0.2)'
    },
    userTypeIcon: {
      fontSize: '2rem',
      marginBottom: '0.75rem'
    },
    userTypeTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#ffffff'
    },
    userTypeDesc: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '1.4'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem'
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.8)',
      letterSpacing: '-0.01em'
    },
    inputWrapper: {
      position: 'relative' as const
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '15px',
      fontWeight: '400',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    textarea: {
      minHeight: '100px',
      resize: 'vertical' as const,
      fontFamily: 'inherit'
    },
    passwordToggle: {
      position: 'absolute' as const,
      right: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.5)',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease'
    },
    passwordStrength: {
      display: 'flex',
      gap: '0.25rem',
      marginTop: '0.5rem'
    },
    strengthBar: {
      flex: 1,
      height: '2px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1px'
    },
    strengthBarActive: {
      background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '8px',
      padding: '0.75rem',
      color: '#F87171',
      fontSize: '14px',
      fontWeight: '500'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem'
    },
    button: {
      padding: '0.875rem 1.5rem',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      outline: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #8B45FF 0%, #3B82F6 100%)',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(139, 69, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      flex: 1
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)'
    },
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem'
    },
    footer: {
      textAlign: 'center' as const,
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
    },
    footerText: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    footerLink: {
      color: 'rgba(139, 69, 255, 0.8)',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease'
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email)) {
      setError('Please fill in all required fields');
      return;
    }
    if (step === 2 && (!formData.password || formData.password !== formData.confirmPassword)) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({
        ...formData,
        userType
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div style={styles.userTypeSelector}>
              <div 
                style={{
                  ...styles.userTypeCard,
                  ...(userType === 'creator' ? styles.userTypeCardActive : {})
                }}
                onClick={() => setUserType('creator')}
              >
                <div style={styles.userTypeIcon}>🎨</div>
                <div style={styles.userTypeTitle}>Creator</div>
                <div style={styles.userTypeDesc}>Showcase your content and connect with brands</div>
              </div>
              <div 
                style={{
                  ...styles.userTypeCard,
                  ...(userType === 'brand' ? styles.userTypeCardActive : {})
                }}
                onClick={() => setUserType('brand')}
              >
                <div style={styles.userTypeIcon}>🏢</div>
                <div style={styles.userTypeTitle}>Brand</div>
                <div style={styles.userTypeDesc}>Find creators and launch campaigns</div>
              </div>
            </div>
            
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={styles.input}
                  placeholder="John"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={styles.input}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={styles.input}
                placeholder="john@example.com"
                required
              />
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password *</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  style={styles.input}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={styles.passwordStrength}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.strengthBar,
                      ...(i < calculatePasswordStrength(formData.password) ? styles.strengthBarActive : {})
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                style={styles.input}
                placeholder="Confirm your password"
                required
              />
            </div>
          </>
        );
      
      case 3:
        return userType === 'brand' ? (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                style={styles.input}
                placeholder="Your company name"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                style={styles.input}
                placeholder="https://yourcompany.com"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                style={styles.input}
                placeholder="Technology, Fashion, etc."
              />
            </div>
          </>
        ) : (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                style={{...styles.input, ...styles.textarea}}
                placeholder="Tell us about yourself and your content..."
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Instagram Handle</label>
              <input
                type="text"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                style={styles.input}
                placeholder="@username"
              />
            </div>
            
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>TikTok</label>
                <input
                  type="text"
                  value={formData.socialMedia.tiktok}
                  onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                  style={styles.input}
                  placeholder="@username"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>YouTube</label>
                <input
                  type="text"
                  value={formData.socialMedia.youtube}
                  onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  style={styles.input}
                  placeholder="@channel"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Create your account';
      case 2: return 'Secure your account';
      case 3: return userType === 'brand' ? 'Company details' : 'Your creative profile';
      default: return 'Create your account';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return 'Choose your account type and basic information';
      case 2: return 'Create a strong password to protect your account';
      case 3: return userType === 'brand' 
        ? 'Tell us about your company to get better matches'
        : 'Share your social media to showcase your work';
      default: return 'Join the future of creator economy';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundOrb1}></div>
      <div style={styles.backgroundOrb2}></div>
      <div style={styles.noise}></div>
      
      <div style={styles.card}>
        <Link 
          to="/" 
          style={styles.backLink}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
        >
          ← Back to home
        </Link>
        
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>U</div>
            <span style={styles.logoText}>UGC Marketplace</span>
          </div>
          
          <div style={styles.progressBar}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={styles.progressStep}>
                {i <= step && <div style={styles.progressStepActive}></div>}
              </div>
            ))}
          </div>
          
          <h1 style={styles.title}>{getStepTitle()}</h1>
          <p style={styles.subtitle}>{getStepSubtitle()}</p>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          
          {renderStepContent()}
          
          <div style={styles.buttonGroup}>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={styles.secondaryButton}
                disabled={isLoading}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={styles.primaryButton}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                style={styles.primaryButton}
              >
                {isLoading && <div style={styles.loadingSpinner}></div>}
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            )}
          </div>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={styles.footerLink}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(139, 69, 255, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(139, 69, 255, 0.8)'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Register;