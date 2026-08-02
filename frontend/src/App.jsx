import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';

/**
 * Main Application Component
 * Manages user authentication state, dynamic profile data, and session login/logout flow.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState('landing');

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
    setCurrentUser(formattedUser);
    setViewMode('dashboard');
  };

  // Handle user logout and clear session profile
  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('landing');
  };

  if (viewMode === 'landing' || !currentUser) {
    return (
      <LandingPage
        onLoginSuccess={handleLogin}
        onGoToDashboard={() => handleLogin({ name: 'Alex Morgan' })}
      />
    );
  }

  return (
    <DashboardLayout
      user={currentUser}
      onLogout={handleLogout}
    />
  );
}

export default App;
