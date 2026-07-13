import { useState } from 'react'
import '../App.css'
import AuthModal from './AuthModal'
import Dashboard from './Dashboard'

/**
 * LandingPage Component
 * The main public-facing landing page of ResuAI Coach. Features product showcase, pricing links,
 * and handles starting user authentication.
 */
export default function LandingPage() {
  
  // ==========================================
  // 1. STATE INITIALIZATION & CONFIGURATION
  // ==========================================
  const [showAuthModal, setShowAuthModal] = useState(false) // Visibility of login/signup modal
  const [isLoggedIn, setIsLoggedIn] = useState(false)       // User login status
  const [user, setUser] = useState(null)                     // Logged-in user payload
  const [theme, setTheme] = useState('dark')                 // Application theme ('dark' | 'light')

  // ==========================================
  // 2. THEME & AUTH LOGIC HANDLERS
  // ==========================================
  
  // Toggles the theme class on document body between dark and light modes
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.body.className = nextTheme
  }

  // Invoked upon successful login/signup form submit
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
    alert(`Authentication Success! Welcome, ${userData?.name || userData?.username || 'User'}.`)
  }

  // Utility to extract initials from full name or username for profile avatars
  const getInitials = (user) => {
    if (!user) return 'US'
    if (user.name) {
      const parts = user.name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return parts[0].slice(0, 2).toUpperCase()
    }
    if (user.username) {
      return user.username.slice(0, 2).toUpperCase()
    }
    return 'US'
  }

  // ==========================================
  // 3. LOGGED-IN REDIRECT TO DASHBOARD
  // ==========================================
  if (isLoggedIn) {
    return (
      <Dashboard 
        user={user} 
        onLogout={() => { setIsLoggedIn(false); setUser(null); }} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
    )
  }

  // ==========================================
  // 4. PUBLIC LANDING PAGE LAYOUT RENDER
  // ==========================================
  return (
    <div className="landing-container">
      
      {/* 4a. Top Header / Navigation Bar */}
      <header className="landing-header">
        <div className="landing-brand">
          <div className="landing-logo">✧</div>
          <span className="landing-brand-name">ResuAI Coach</span>
        </div>
        
        {/* Navigation Dropdown Links */}
        <nav className="landing-nav">
          <div className="landing-nav-link nav-dropdown-item">
            For individuals <span className="nav-arrow">▾</span>
            <div className="dropdown-menu animate-fade">
              <a href="#auth" className="dropdown-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
                <strong>📄 Resume Optimizer</strong>
                <span>Score ATS & add keywords</span>
              </a>
              <a href="#auth" className="dropdown-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
                <strong>🎙️ Mock Interview Prep</strong>
                <span>STAR evaluation simulations</span>
              </a>
              <a href="#auth" className="dropdown-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
                <strong>✉️ Cover Letter Maker</strong>
                <span>AI tailored generator</span>
              </a>
              <a href="#auth" className="dropdown-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
                <strong>🛣️ Career Roadmap</strong>
                <span>Skill trajectory milestones</span>
              </a>
            </div>
          </div>
          
          <div className="landing-nav-link nav-dropdown-item">
            For Organizations <span className="nav-arrow">▾</span>
            <div className="dropdown-menu animate-fade">
              <a href="#auth" className="dropdown-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
                <strong>🔍 Candidate Screening</strong>
                <span>Batch parser & scorer</span>
              </a>
              <a href="#auth" className="dropdown-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
                <strong>👥 Custom Interviewer</strong>
                <span>Tailored hiring dashboards</span>
              </a>
            </div>
          </div>
          
          <a href="#auth" className="landing-nav-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>Pricing</a>
          <a href="#auth" className="landing-nav-link" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>Our Story</a>
        </nav>

        {/* Theme Toggler & Auth Login/Signup Buttons */}
        <div className="landing-auth-buttons">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px' }}>
              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '11px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }} title={user?.name || user?.username || 'Profile'}>
                {getInitials(user)}
              </div>
              <button className="landing-btn-login" onClick={() => { setIsLoggedIn(false); setUser(null); }} style={{ fontSize: '13px' }}>Logout</button>
            </div>
          ) : (
            <>
              <button className="landing-btn-login" onClick={() => setShowAuthModal(true)}>Log in</button>
              <button className="landing-btn-signup" onClick={() => setShowAuthModal(true)}>Sign up</button>
            </>
          )}
        </div>
      </header>

      {/* 4b. Hero Showcase Section */}
      <section className="landing-hero animate-fade">
        <div className="landing-hero-left">
          <div className="landing-pill">
            AI feeling unfamiliar? Start with the fundamentals &rarr;
          </div>
          <h1 className="landing-title">
            The smarter way <br />
            to grow your <br />
            career with AI
          </h1>
          <p className="landing-subtitle">
            First, let's find your baseline. Get your free AI Readiness Score in 5 minutes to see your strengths, close skill gaps, and unlock your personalized growth plan.
          </p>
          <div className="landing-hero-actions">
            <button className="btn-primary landing-cta-btn" onClick={() => setShowAuthModal(true)}>
              Get Your Free AI Readiness Score
            </button>
            <a href="#auth" className="landing-link-text" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>
              What does this check measure?
            </a>
          </div>
        </div>

        {/* Floating 3D Dashboard Mockup Graphic */}
        <div className="landing-hero-right">
          <div className="glow-trail"></div>
          <div className="dashboard-mockup-wrapper">
            <div className="mockup-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
              <div className="mockup-address">resuai-coach.io/dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-side-logo">✧</div>
                <div className="mockup-side-item active"></div>
                <div className="mockup-side-item"></div>
                <div className="mockup-side-item"></div>
                <div className="mockup-side-item"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-row">
                  <div className="mockup-card" style={{ width: '40%' }}>
                    <div className="mockup-circle-gauge">
                      <div className="gauge-text">70%</div>
                    </div>
                    <div className="mockup-line" style={{ width: '80%', marginTop: '5px' }}></div>
                    <div className="mockup-line" style={{ width: '60%' }}></div>
                  </div>
                  <div className="mockup-card" style={{ width: '60%' }}>
                    <div className="mockup-chart-header" style={{ display: 'flex', justifyContent: 'space-between', height: '10px' }}>
                      <div className="mockup-line" style={{ width: '40%', height: '5px' }}></div>
                      <div className="mockup-line" style={{ width: '20%', height: '5px' }}></div>
                    </div>
                    <div className="mockup-chart-curve" style={{ marginTop: '10px' }}></div>
                    <div className="mockup-line" style={{ width: '90%', marginTop: '10px' }}></div>
                  </div>
                </div>
                <div className="mockup-row">
                  <div className="mockup-card" style={{ width: '100%' }}>
                    <div className="mockup-line" style={{ width: '95%', height: '12px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div className="mockup-line" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4c. Feature Steps / Process Section */}
      <section className="landing-steps animate-fade">
        <div className="step-card">
          <div className="step-icon">📋</div>
          <h3>Assess</h3>
          <p>Discover how prepared you are with a quick AI-powered assessment.</p>
        </div>
        <div className="step-divider">&rarr;</div>
        <div className="step-card">
          <div className="step-icon">📈</div>
          <h3>Build skills</h3>
          <p>Get tailored growth recommendations and stay consistent with streaks.</p>
        </div>
        <div className="step-divider">&rarr;</div>
        <div className="step-card">
          <div className="step-icon">🏆</div>
          <h3>Show the world</h3>
          <p>Share your badge, optimise your CV, and apply to roles that fit your growth.</p>
        </div>
      </section>

      {/* 4d. Authentication Overlay Modal Dialog */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  )
}
