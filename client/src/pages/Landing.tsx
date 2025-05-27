import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      color: '#ffffff',
      overflow: 'hidden'
    },
    noise: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.03,
      pointerEvents: 'none' as const,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      zIndex: 1
    },
    gradientOrb1: {
      position: 'absolute' as const,
      top: '-10%',
      right: '-10%',
      width: '50rem',
      height: '50rem',
      background: 'radial-gradient(circle, rgba(139, 69, 255, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float 20s ease-in-out infinite',
      zIndex: 1
    },
    gradientOrb2: {
      position: 'absolute' as const,
      bottom: '-20%',
      left: '-10%',
      width: '40rem',
      height: '40rem',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float 25s ease-in-out infinite reverse',
      zIndex: 1
    },
    header: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '1rem 0'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
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
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    navLink: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      textDecoration: 'none',
      color: 'rgba(255, 255, 255, 0.7)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '15px',
      fontWeight: '500',
      border: 'none',
      background: 'transparent'
    },
    navButton: {
      padding: '0.625rem 1.25rem',
      borderRadius: '12px',
      textDecoration: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      fontWeight: '500',
      fontSize: '15px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    },
    main: {
      position: 'relative' as const,
      zIndex: 10,
      paddingTop: '80px'
    },
    hero: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '8rem 2rem 4rem',
      textAlign: 'center' as const,
      position: 'relative' as const
    },
    heroTitle: {
      fontSize: 'clamp(3rem, 8vw, 6rem)',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.04em',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    heroGradientText: {
      background: 'linear-gradient(135deg, #8B45FF 0%, #3B82F6 50%, #06B6D4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'block'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      lineHeight: '1.6',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '3rem',
      maxWidth: '600px',
      margin: '0 auto 3rem'
    },
    heroButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '4rem',
      flexWrap: 'wrap' as const
    },
    primaryButton: {
      padding: '1rem 2rem',
      borderRadius: '16px',
      textDecoration: 'none',
      background: 'linear-gradient(135deg, #8B45FF 0%, #3B82F6 100%)',
      color: '#fff',
      fontWeight: '600',
      fontSize: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(139, 69, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    secondaryButton: {
      padding: '1rem 2rem',
      borderRadius: '16px',
      textDecoration: 'none',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      fontWeight: '600',
      fontSize: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(20px)'
    },
    heroStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: '6rem'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    statDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8B45FF, #3B82F6)'
    },
    showcase: {
      position: 'relative' as const,
      maxWidth: '1200px',
      margin: '0 auto',
      perspective: '1000px'
    },
    showcaseImage: {
      width: '100%',
      borderRadius: '24px',
      boxShadow: '0 40px 120px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      position: 'relative' as const
    },
    features: {
      padding: '8rem 2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    featuresHeader: {
      textAlign: 'center' as const,
      marginBottom: '5rem'
    },
    sectionTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.03em',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    sectionSubtitle: {
      fontSize: '1.125rem',
      color: 'rgba(255, 255, 255, 0.6)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem'
    },
    featureCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '2.5rem',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    featureCardGlow: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(139, 69, 255, 0.5), transparent)',
      opacity: 0,
      transition: 'opacity 0.4s ease'
    },
    featureIcon: {
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      filter: 'grayscale(1) brightness(1.2)'
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#ffffff'
    },
    featureDescription: {
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '1.6',
      fontSize: '15px'
    },
    cta: {
      padding: '8rem 2rem',
      textAlign: 'center' as const,
      position: 'relative' as const
    },
    ctaGlow: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      height: '400px',
      background: 'radial-gradient(ellipse, rgba(139, 69, 255, 0.1) 0%, transparent 70%)',
      filter: 'blur(40px)',
      zIndex: -1
    },
    ctaTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.03em',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    ctaSubtitle: {
      fontSize: '1.125rem',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '2.5rem',
      lineHeight: '1.6',
      maxWidth: '500px',
      margin: '0 auto 2.5rem'
    },
    footer: {
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      padding: '4rem 2rem 2rem'
    },
    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '3rem',
      marginBottom: '3rem'
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem'
    },
    footerTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#ffffff'
    },
    footerLink: {
      color: 'rgba(255, 255, 255, 0.5)',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.2s ease',
      lineHeight: '1.5'
    },
    footerBottom: {
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      paddingTop: '2rem',
      textAlign: 'center' as const,
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.noise}></div>
      <div style={styles.gradientOrb1}></div>
      <div style={styles.gradientOrb2}></div>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>U</div>
            <span style={styles.logoText}>UGC Marketplace</span>
          </div>
          <nav style={styles.nav}>
            <Link 
              to="/login" 
              style={styles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={styles.navButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>
            The Future of
            <span style={styles.heroGradientText}>Creator Economy</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Where exceptional brands meet world-class creators. 
            Build authentic connections that drive meaningful engagement and exponential growth.
          </p>
          <div style={styles.heroButtons}>
            <Link 
              to="/register?type=client" 
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 69, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 69, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}
            >
              Start Your Journey
            </Link>
            <Link 
              to="/register?type=creator" 
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Join as Creator
            </Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <div style={styles.statDot}></div>
              <span>10,000+ Creators Worldwide</span>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statDot}></div>
              <span>$50M+ Creator Revenue</span>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statDot}></div>
              <span>500+ Fortune 500 Brands</span>
            </div>
          </div>
          
          {/* Showcase */}
          <div style={styles.showcase}>
            <div style={styles.showcaseImage}>
              <div style={{
                height: '400px',
                background: 'linear-gradient(135deg, rgba(139, 69, 255, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                color: 'rgba(255, 255, 255, 0.3)'
              }}>
                ▶
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.features}>
          <div style={styles.featuresHeader}>
            <h2 style={styles.sectionTitle}>Built for Excellence</h2>
            <p style={styles.sectionSubtitle}>
              Every feature designed to elevate your creative partnerships to unprecedented heights
            </p>
          </div>
          <div style={styles.featuresGrid}>
            {[
              {
                icon: "⚡",
                title: "Lightning Fast Matching",
                description: "AI-powered algorithms instantly connect you with perfect-fit creators based on audience overlap, brand alignment, and performance metrics."
              },
              {
                icon: "🎯",
                title: "Precision Analytics",
                description: "Real-time performance tracking with predictive insights that help you optimize campaigns before they even launch."
              },
              {
                icon: "🛡️",
                title: "Enterprise Security",
                description: "Bank-level encryption and compliance with SOC 2, GDPR, and CCPA standards protect your most sensitive data."
              },
              {
                icon: "🚀",
                title: "Scale Without Limits",
                description: "From startups to Fortune 500 companies, our platform grows with your needs and handles campaigns of any size."
              },
              {
                icon: "💎",
                title: "Premium Support",
                description: "Dedicated success managers and 24/7 priority support ensure your campaigns exceed expectations every time."
              },
              {
                icon: "🌟",
                title: "Global Reach",
                description: "Access creators from 150+ countries with localized insights and cultural expertise for worldwide campaigns."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(139, 69, 255, 0.3)';
                  const glow = e.currentTarget.querySelector('.feature-glow') as HTMLElement;
                  if (glow) glow.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  const glow = e.currentTarget.querySelector('.feature-glow') as HTMLElement;
                  if (glow) glow.style.opacity = '0';
                }}
              >
                <div className="feature-glow" style={styles.featureCardGlow}></div>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.cta}>
          <div style={styles.ctaGlow}></div>
          <h2 style={styles.ctaTitle}>Ready to Redefine Your Brand?</h2>
          <p style={styles.ctaSubtitle}>
            Join the world's most exclusive creator marketplace and transform how you connect with audiences.
          </p>
          <div style={styles.heroButtons}>
            <Link 
              to="/register?type=client" 
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 69, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 69, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}
            >
              Get Started Today
            </Link>
            <Link 
              to="/register?type=creator" 
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Apply as Creator
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerGrid}>
            <div style={styles.footerSection}>
              <div style={styles.logo}>
                <div style={styles.logoIcon}>U</div>
                <span style={styles.logoText}>UGC Marketplace</span>
              </div>
              <p style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginTop: '1rem', lineHeight: '1.5'}}>
                The world's premier creator economy platform. Connecting exceptional brands with world-class creators since 2025.
              </p>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Platform</h4>
              <a href="#" style={styles.footerLink}>Discover Creators</a>
              <a href="#" style={styles.footerLink}>Brand Solutions</a>
              <a href="#" style={styles.footerLink}>Analytics Suite</a>
              <a href="#" style={styles.footerLink}>API Documentation</a>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Creators</h4>
              <a href="#" style={styles.footerLink}>Creator Program</a>
              <a href="#" style={styles.footerLink}>Success Stories</a>
              <a href="#" style={styles.footerLink}>Resources</a>
              <a href="#" style={styles.footerLink}>Community</a>
            </div>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Company</h4>
              <a href="#" style={styles.footerLink}>About Us</a>
              <a href="#" style={styles.footerLink}>Careers</a>
              <a href="#" style={styles.footerLink}>Press Kit</a>
              <a href="#" style={styles.footerLink}>Contact</a>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p>&copy; 2025 UGC Marketplace. All rights reserved. Privacy Policy • Terms of Service • Cookie Policy</p>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 69, 255, 0.3) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(139, 69, 255, 0.3);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 69, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Landing;