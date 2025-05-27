import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
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
      maxWidth: '420px',
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
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem'
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
    inputFocused: {
      borderColor: 'rgba(139, 69, 255, 0.5)',
      background: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 0 0 3px rgba(139, 69, 255, 0.1)'
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
    forgotPassword: {
      textAlign: 'right' as const,
      marginTop: '-0.5rem'
    },
    forgotPasswordLink: {
      color: 'rgba(139, 69, 255, 0.8)',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    submitButton: {
      padding: '0.875rem 1.5rem',
      background: 'linear-gradient(135deg, #8B45FF 0%, #3B82F6 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(139, 69, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      marginTop: '0.5rem',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    submitButtonLoading: {
      background: 'rgba(139, 69, 255, 0.5)',
      cursor: 'not-allowed',
      boxShadow: '0 4px 16px rgba(139, 69, 255, 0.2)'
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
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '8px',
      padding: '0.75rem',
      color: '#F87171',
      fontSize: '14px',
      fontWeight: '500'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '1.5rem 0'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)'
    },
    dividerText: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontWeight: '500'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>
            Sign in to your account to continue your creative journey
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(139, 69, 255, 0.5)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(139, 69, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 69, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div style={styles.forgotPassword}>
              <button
                type="button"
                style={styles.forgotPasswordLink}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(139, 69, 255, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(139, 69, 255, 0.8)'}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonLoading : {})
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 69, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 69, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            {isLoading && <div style={styles.loadingSpinner}></div>}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={styles.footerLink}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(139, 69, 255, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(139, 69, 255, 0.8)'}
            >
              Sign up
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
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Login;