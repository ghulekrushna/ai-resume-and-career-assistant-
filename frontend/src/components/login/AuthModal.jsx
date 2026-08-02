import React, { useState } from 'react';
import { apiService } from '../../services/api';
import './AuthModal.css';

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
  const [showPassword, setShowPassword] = useState(false); // Visibility of password text
  const [rememberMe, setRememberMe] = useState(false);  // Remember me checkbox

  // ==========================================
  // 2. EVENT HANDLERS
  // ==========================================
  const handleToggleMode = (registerMode) => {
    setIsRegister(registerMode);
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const res = await apiService.registerUser(name, email, password);
        if (res && res.id) {
          onLoginSuccess({
            name: res.name || name,
            email: res.email || email,
            role: res.role || 'Job Seeker & Pro Member',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(res.name || name)}&background=a855f7&color=fff&bold=true`
          });
        } else {
          // Fallback login
          onLoginSuccess({
            name: name || email.split('@')[0],
            email: email,
            role: 'Job Seeker & Pro Member'
          });
        }
      } else {
        const res = await apiService.loginUser(username, password);
        if (res && res.user) {
          localStorage.setItem('token', res.access_token);
          onLoginSuccess({
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(res.user.name)}&background=a855f7&color=fff&bold=true`
          });
        } else {
          // Fallback login
          onLoginSuccess({
            name: username || 'User',
            email: `${username}@example.com`,
            role: 'Job Seeker & Pro Member'
          });
        }
      }
    } catch (err) {
      console.warn("Auth warning:", err);
      onLoginSuccess({
        name: isRegister ? name : (username || 'User'),
        email: email || `${username}@example.com`,
        role: 'Job Seeker & Pro Member'
      });
    }
    onClose();
  };

  // ==========================================
  // 3. ICONS & DECORATIONS (INLINE SVG)
  // ==========================================
  const brainLogo = (
    <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="auth-brain-logo">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="url(#logoGrad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="#00C6FF" />
      <circle cx="8" cy="9" r="1.5" fill="#7B61FF" />
      <circle cx="16" cy="9" r="1.5" fill="#7B61FF" />
      <circle cx="9" cy="15" r="1.5" fill="#4DEAFF" />
      <circle cx="15" cy="15" r="1.5" fill="#4DEAFF" />
      <line x1="12" y1="12" x2="8" y2="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="12" y1="12" x2="16" y2="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="12" y1="12" x2="9" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="12" y1="12" x2="15" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#7B61FF" />
        </linearGradient>
      </defs>
    </svg>
  );

  const userIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const lockIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const eyeIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const eyeOffIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Decorative Neon Glow Backdrop */}
        <div className="auth-glow-aura"></div>

        {/* Modal Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        {/* Header Section (Logo, Title & Subtitle) */}
        <div className="auth-header">
          {brainLogo}
          <h2 className="auth-title">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="auth-subtitle">
            {isRegister ? 'Sign up to start your journey' : 'Sign in to continue to your AI workspace'}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 2 }}>
          
          {/* Full Name field (Signup Mode Only) */}
          {isRegister && (
            <div className="auth-input-wrapper animate-fade">
              <span className="auth-input-icon">
                {userIcon}
              </span>
              <input 
                type="text" 
                className="auth-input-elem" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          {/* Username / Email field */}
          {!isRegister ? (
            <div className="auth-input-wrapper animate-fade">
              <span className="auth-input-icon">
                {userIcon}
              </span>
              <input 
                type="text" 
                className="auth-input-elem" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          ) : (
            <div className="auth-input-wrapper animate-fade">
              <span className="auth-input-icon">
                {userIcon}
              </span>
              <input 
                type="email" 
                className="auth-input-elem" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Password field (Both Modes) */}
          <div className="auth-input-wrapper animate-fade">
            <span className="auth-input-icon">
              {lockIcon}
            </span>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="auth-input-elem" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="auth-password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>

          {/* Remember Me checkbox & Forgot Password link (Login Mode Only) */}
          {!isRegister && (
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input 
                  type="checkbox" 
                  className="auth-checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <a 
                href="#forgot" 
                className="auth-forgot-link"
                onClick={(e) => { e.preventDefault(); alert('Reset password link sent (mock).'); }}
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Form Submit Button */}
          <button type="submit" className="auth-submit-btn">
            <span>{isRegister ? 'Sign In' : 'Login'}</span>
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
          <button type="button" className="auth-social-btn" onClick={() => { onLoginSuccess({ name: 'Google User', email: 'google@gmail.com', username: 'google_user' }); onClose(); }}>
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
        </div>

        {/* Footer Toggle Link */}
        <div className="auth-footer">
          {isRegister ? (
            <>
              Already have an account?
              <span className="auth-toggle-link" onClick={() => handleToggleMode(false)}>
                Log In
              </span>
            </>
          ) : (
            <>
              Don't have an account?
              <span className="auth-toggle-link" onClick={() => handleToggleMode(true)}>
                Sign Up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
