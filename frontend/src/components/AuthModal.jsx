import React, { useState } from 'react';

/**
 * AuthModal Component
 * Handles user authentication (Login and Signup screens) in a responsive, glassmorphic modal overlay.
 */
export default function AuthModal({ onClose, onLoginSuccess }) {
  
  // ==========================================
  // 1. STATE INITIALIZATION
  // ==========================================
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login (false) and Signup (true)
  const [name, setName] = useState('');                 // Full name (signup only)
  const [username, setUsername] = useState('');         // Username (login only)
  const [email, setEmail] = useState('');               // Email address (signup only)
  const [password, setPassword] = useState('');         // Password (both modes)

  // ==========================================
  // 2. EVENT HANDLERS
  // ==========================================
  
  // Handles switching between Login and Signup modes, clearing all fields
  const handleToggleMode = (registerMode) => {
    setIsRegister(registerMode);
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  // Handles signup/login form submissions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      // Trigger signup success callback
      onLoginSuccess({ 
        name: name, 
        email: email,
        username: email.split('@')[0] // Auto-derive username from email
      });
    } else {
      // Trigger login success callback
      onLoginSuccess({ 
        name: username, 
        email: `${username}@gmail.com`, // Mock email for username-based login
        username: username
      });
    }
    onClose();
  };

  // ==========================================
  // 3. RENDER LAYOUT
  // ==========================================
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Decorative Neon Glow Backdrop */}
        <div className="auth-glow-aura"></div>

        {/* Modal Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        {/* Header Section (Title & Subtitle) */}
        <div className="auth-header">
          <div className="auth-header-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <h2 className="auth-title">
              {isRegister ? 'Create account' : 'Welcome back'}
            </h2>
          </div>
          <p className="auth-subtitle">
            {isRegister ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} style={{ marginTop: '24px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Full Name field (Signup Mode Only) */}
          {isRegister && (
            <div className="auth-input-container animate-fade">
              <label className="auth-input-label">Full Name</label>
              <div className="auth-input-row">
                <input 
                  type="text" 
                  className="auth-input-field" 
                  placeholder="Alex Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Email Address field (Signup Mode Only) */}
          {isRegister && (
            <div className="auth-input-container animate-fade">
              <label className="auth-input-label">Email Address</label>
              <div className="auth-input-row">
                <input 
                  type="email" 
                  className="auth-input-field" 
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Username field (Login Mode Only) */}
          {!isRegister && (
            <div className="auth-input-container animate-fade">
              <label className="auth-input-label">Username</label>
              <div className="auth-input-row">
                <input 
                  type="text" 
                  className="auth-input-field" 
                  placeholder="alex_miller"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Password field (Both Modes) */}
          <div className="auth-input-container animate-fade">
            <label className="auth-input-label">Password</label>
            <div className="auth-input-row">
              <input 
                type="password" 
                className="auth-input-field" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Form Submit Button */}
          <button type="submit" className="auth-submit-btn">
            <span>{isRegister ? 'Sign up' : 'Log in'}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        {/* OR Divider Section */}
        <div className="auth-divider">OR</div>

        {/* Social Authentication Buttons */}
        <div className="auth-social-container">
          {/* Google OAuth Login */}
          <button type="button" className="auth-social-btn" onClick={() => { onLoginSuccess({ name: 'Google User', username: 'google_user' }); onClose(); }}>
            <div className="auth-social-left">
              <span className="auth-social-icon">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.8 2.94C6.2 7.2 8.87 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.47h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.37-4.88 3.37-8.52z" />
                  <path fill="#FBBC05" d="M5.3 10.44c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19L1.5 3.12C.54 5.05 0 7.21 0 9.5s.54 4.45 1.5 6.38l3.8-2.94z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.1.74-2.5 1.18-4.3 1.18-3.13 0-5.8-2.16-6.7-5.4L1.5 15.97C3.4 19.82 7.35 23 12 23z" />
                </svg>
              </span>
              <span>Continue with Google</span>
            </div>
            <div className="auth-social-arrow">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>

          {/* X (formerly Twitter) OAuth Login */}
          <button type="button" className="auth-social-btn" onClick={() => { onLoginSuccess({ name: 'X User', username: 'x_user' }); onClose(); }}>
            <div className="auth-social-left">
              <span className="auth-social-icon">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              <span>Continue with X</span>
            </div>
            <div className="auth-social-arrow">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>

        {/* Footer Toggle Link (Login <-> Signup Switcher) */}
        <div className="auth-footer">
          {isRegister ? (
            <>
              Already have an account?
              <span className="auth-toggle-link" onClick={() => handleToggleMode(false)}>
                Log in
              </span>
            </>
          ) : (
            <>
              Don't have an account?
              <span className="auth-toggle-link" onClick={() => handleToggleMode(true)}>
                Sign up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
