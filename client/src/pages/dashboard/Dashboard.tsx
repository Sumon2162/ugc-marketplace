import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    floatingOrb1: {
      position: 'absolute' as const,
      top: '10%',
      left: '10%',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
      animation: 'float 6s ease-in-out infinite',
      zIndex: 1,
    },
    floatingOrb2: {
      position: 'absolute' as const,
      bottom: '10%',
      right: '10%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
      animation: 'float 8s ease-in-out infinite reverse',
      zIndex: 1,
    },
    header: {
      position: 'relative' as const,
      zIndex: 10,
      padding: '2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      background: 'rgba(255, 255, 255, 0.05)',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
    },
    navLink: {
      color: 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'color 0.3s ease',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    userName: {
      fontSize: '1rem',
      fontWeight: '500',
    },
    logoutBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    welcomeSection: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
    },
    welcomeTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      background: 'linear-gradient(45deg, #ffffff, rgba(255, 255, 255, 0.8))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    welcomeSubtitle: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.7)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    main: {
      position: 'relative' as const,
      zIndex: 10,
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '0.5rem',
      backdropFilter: 'blur(10px)',
    },
    tab: {
      background: 'transparent',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.7)',
      padding: '1rem 2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    tabActive: {
      background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
      color: '#ffffff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'linear-gradient(45deg, #9333ea, #3b82f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      marginBottom: '1rem',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1rem',
      marginBottom: '0.5rem',
    },
    statChange: {
      fontSize: '0.9rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    statChangePositive: {
      color: '#10b981',
    },
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    actionCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center' as const,
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
    },
    actionIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'block',
    },
    actionTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '0.5rem',
    },
    actionDescription: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem',
      lineHeight: '1.5',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      marginBottom: '2rem',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '1rem',
    },
    chartPlaceholder: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '3rem',
      textAlign: 'center' as const,
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      border: '2px dashed rgba(255, 255, 255, 0.2)',
    },
  };

  const handleLogout = () => {
    logout();
  };

  // Mock data based on user type
  const getStatsData = () => {
    if (user?.userType === 'creator') {
      return [
        {
          icon: '👁️',
          value: '125.2K',
          label: 'Total Views',
          change: '+12.5%',
          isPositive: true,
        },
        {
          icon: '🎯',
          value: '8',
          label: 'Active Projects',
          change: '+2',
          isPositive: true,
        },
        {
          icon: '💰',
          value: '$4,250',
          label: 'Earnings',
          change: '+18.2%',
          isPositive: true,
        },
        {
          icon: '⭐',
          value: '96%',
          label: 'Completion Rate',
          change: '+2%',
          isPositive: true,
        },
      ];
    } else {
      return [
        {
          icon: '📊',
          value: '2.5M',
          label: 'Campaign Reach',
          change: '+22.5%',
          isPositive: true,
        },
        {
          icon: '👥',
          value: '12',
          label: 'Active Creators',
          change: '+3',
          isPositive: true,
        },
        {
          icon: '📈',
          value: '340%',
          label: 'Campaign ROI',
          change: '+45%',
          isPositive: true,
        },
        {
          icon: '❤️',
          value: '6.8%',
          label: 'Avg. Engagement',
          change: '+1.2%',
          isPositive: true,
        },
      ];
    }
  };

  const getActionsData = () => {
    if (user?.userType === 'creator') {
      return [
        {
          icon: '📤',
          title: 'Upload Content',
          description: 'Share your latest videos and grow your audience',
          link: '/upload',
        },
        {
          icon: "🎯",
          title: "Browse Campaigns",
          description: "Discover brand campaigns and apply to opportunities",
          link: "/campaigns",
        },
        {
          icon: '💬',
          title: 'Messages',
          description: 'Connect with brands and manage conversations',
          link: '/messages',
        },
        {
          icon: '📊',
          title: 'Analytics',
          description: 'Track your performance and engagement metrics',
          link: '/analytics',
        },
        {
          icon: '👤',
          title: 'Profile',
          description: 'Update your creator profile and showcase your work',
          link: '/profile',
        },
      ];
    } else {
      return [
        {
          icon: '🔍',
          title: 'Discover Creators',
          description: 'Find perfect creators for your brand campaigns',
          link: '/discovery',
        },
        {
          icon: '🚀',
          title: 'Create Campaign',
          description: 'Launch new influencer marketing campaigns',
          link: '/create-campaign',
        },
        {
          icon: '💬',
          title: 'Messages',
          description: 'Communicate with creators and manage projects',
          link: '/messages',
        },
        {
          icon: '📈',
          title: 'Campaign Analytics',
          description: 'Monitor campaign performance and ROI',
          link: '/analytics',
        },
      ];
    }
  };

  const statsData = getStatsData();
  const actionsData = getActionsData();

  return (
    <div style={styles.container}>
      {/* Floating Background Orbs */}
      <div style={styles.floatingOrb1}></div>
      <div style={styles.floatingOrb2}></div>

      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>UGC Marketplace</div>
          
          <div style={styles.navLinks}>
            <Link to="/discovery" style={styles.navLink}>Discover</Link>
            <Link to="/messages" style={styles.navLink}>Messages</Link>
            <Link to="/matches" style={styles.navLink}>Matches</Link>
          </div>

          <div style={styles.userSection}>
            <div style={styles.avatar}>
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <span style={styles.userName}>{user?.firstName} {user?.lastName}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </nav>

        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>
            {user?.userType === 'creator' 
              ? `Welcome back, ${user?.firstName}!`
              : `Hello, ${user?.firstName}!`
            }
          </h1>
          <p style={styles.welcomeSubtitle}>
            {user?.userType === 'creator'
              ? 'Ready to create amazing content and grow your audience?'
              : 'Ready to discover talented creators and launch successful campaigns?'
            }
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {['overview', 'analytics', 'projects'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {})
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={{
                ...styles.statChange,
                ...(stat.isPositive ? styles.statChangePositive : {})
              }}>
                {stat.isPositive ? '↗' : '↘'} {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div style={styles.actionsGrid}>
          {actionsData.map((action, index) => (
            <Link key={index} to={action.link} style={styles.actionCard}>
              <div style={styles.actionIcon}>{action.icon}</div>
              <div style={styles.actionTitle}>{action.title}</div>
              <div style={styles.actionDescription}>{action.description}</div>
            </Link>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Dashboard Overview</div>
            <div style={styles.chartPlaceholder}>
              📈 Your performance summary and key metrics will appear here.<br/>
              {user?.userType === 'creator' 
                ? 'Track your content performance, audience growth, and earnings.'
                : 'Monitor your campaigns, creator partnerships, and ROI metrics.'
              }
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Performance Overview</div>
            <div style={styles.chartPlaceholder}>
              📊 Detailed analytics and performance charts will be displayed here.<br/>
              {user?.userType === 'creator'
                ? 'View engagement rates, audience demographics, and content performance.'
                : 'Analyze campaign effectiveness, creator performance, and brand metrics.'
              }
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              {user?.userType === 'creator' ? 'Your Projects' : 'Active Campaigns'}
            </div>
            <div style={styles.chartPlaceholder}>
              📁 {user?.userType === 'creator' 
                ? 'Active and completed projects will be displayed here.'
                : 'Your campaign management and creator collaborations will appear here.'
              }<br/>
              {user?.userType === 'creator'
                ? 'Manage deadlines, deliverables, and project communications.'
                : 'Track campaign progress, manage budgets, and communicate with creators.'
              }
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;