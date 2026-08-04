import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { apiService } from './services/api';

/**
 * Main Application Component
 * Manages user authentication state using session-bound storage (sessionStorage).
 * When a user closes ("cuts") the browser tab or window, the session is cleared automatically.
 * Re-visiting the website requires the user to log in again.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Clear legacy persistent user state so tab close requires login
      localStorage.removeItem('resuai_active_user');
      const saved = sessionStorage.getItem('resuai_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = sessionStorage.getItem('resuai_active_user');
      return saved ? 'dashboard' : 'landing';
    } catch (e) {
      return 'landing';
    }
  });

  // Protect against browser back/forward navigation or session expiration
  useEffect(() => {
    const handlePopState = (e) => {
      const savedUser = sessionStorage.getItem('resuai_active_user');
      if (!savedUser) {
        setCurrentUser(null);
        setViewMode('landing');
      } else if (e.state && e.state.view === 'dashboard') {
        setViewMode('dashboard');
      } else {
        // Default to landing page requiring authentication if navigated back
        setCurrentUser(null);
        sessionStorage.removeItem('resuai_active_user');
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
      // Store session in sessionStorage so closing tab/window expires active login
      sessionStorage.setItem('resuai_active_user', JSON.stringify(formattedUser));
      localStorage.removeItem('resuai_active_user');
    } catch (e) {
      console.error('Failed to persist active session user', e);
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

    sessionStorage.removeItem('resuai_active_user');
    sessionStorage.clear();
    localStorage.removeItem('resuai_active_user');
    localStorage.removeItem('token');
    localStorage.removeItem('resuai_active_tab');

    // Replace browser history state so clicking Back does not re-open dashboard
    window.history.replaceState({ view: 'landing' }, '', '/');

    setCurrentUser(null);
    setViewMode('landing');
  };

  // Handle explicit navigation back to landing page (requires login again)
  const handleBackToLanding = () => {
    sessionStorage.removeItem('resuai_active_user');
    sessionStorage.clear();
    localStorage.removeItem('resuai_active_user');
    localStorage.removeItem('token');

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


