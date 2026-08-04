import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { apiService } from './services/api';

/**
 * Main Application Component
 * Manages user authentication state, dynamic profile data, session persistence,
 * browser history back-button protection, and secure login/logout flow.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resuai_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = localStorage.getItem('resuai_active_user');
      return saved ? 'dashboard' : 'landing';
    } catch (e) {
      return 'landing';
    }
  });

  // Protect against browser back/forward navigation into authenticated dashboard after logout
  useEffect(() => {
    const handlePopState = (e) => {
      const savedUser = localStorage.getItem('resuai_active_user');
      if (!savedUser) {
        setCurrentUser(null);
        setViewMode('landing');
      } else if (e.state && e.state.view === 'dashboard') {
        setViewMode('dashboard');
      } else {
        // Default to landing page requiring authentication if navigated back
        setCurrentUser(null);
        localStorage.removeItem('resuai_active_user');
        localStorage.removeItem('token');
        setViewMode('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle user login or sign up success
  const handleLogin = (userData) => {
    const isDemoUser = userData?.isDemo === true;
    const userName = userData?.name || userData?.username || (userData?.email ? userData.email.split('@')[0] : 'New User');
    const formattedUser = {
      name: userName,
      email: userData?.email || 'newuser@example.com',
      role: 'Job Seeker & Member',
      avatar: userData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=a855f7&color=fff&bold=true`,
      isNewUser: !isDemoUser,
      resumes: isDemoUser ? [
        { title: 'Senior_FullStack_Engineer_2026.pdf', atsScore: 96 },
        { title: 'AI_Product_Manager_Targeted.pdf', atsScore: 92 }
      ] : []
    };

    try {
      localStorage.setItem('resuai_active_user', JSON.stringify(formattedUser));
      sessionStorage.setItem('resuai_auth_session', 'true');
    } catch (e) {
      console.error('Failed to persist active user', e);
    }

    // Push dashboard history state
    window.history.pushState({ view: 'dashboard' }, '', '/dashboard');

    setCurrentUser(formattedUser);
    setViewMode('dashboard');
  };

  // Handle user logout and clear active session profile
  const handleLogout = async () => {
    try {
      await apiService.logoutUser().catch(() => {});
    } catch (e) {
      console.error('Logout error', e);
    }

    localStorage.removeItem('resuai_active_user');
    localStorage.removeItem('token');
    localStorage.removeItem('resuai_active_tab');
    sessionStorage.clear();

    // Replace browser history state so clicking Back does not re-open dashboard
    window.history.replaceState({ view: 'landing' }, '', '/');

    setCurrentUser(null);
    setViewMode('landing');
  };

  // Handle explicit navigation back to landing page (requires login again)
  const handleBackToLanding = () => {
    localStorage.removeItem('resuai_active_user');
    localStorage.removeItem('token');
    sessionStorage.clear();

    window.history.replaceState({ view: 'landing' }, '', '/');

    setCurrentUser(null);
    setViewMode('landing');
  };

  if (viewMode === 'landing' || !currentUser) {
    return (
      <LandingPage
        onLoginSuccess={handleLogin}
        onGoToDashboard={() => handleLogin({ name: 'Alex Morgan', isDemo: true })}
      />
    );
  }

  return (
    <DashboardLayout
      user={currentUser}
      onLogout={handleLogout}
      onBackToLanding={handleBackToLanding}
    />
  );
}

export default App;

