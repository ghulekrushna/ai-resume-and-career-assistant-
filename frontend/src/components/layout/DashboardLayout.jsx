import React, { useState } from 'react';
import Sidebar from '../navigation/Sidebar';
import ResumeTemplates from '../resume/ResumeTemplates';
import AiResumeGenerator from '../features/AiResumeGenerator';
import AtsChecker from '../features/AtsChecker';
import JobRecommendations from '../features/JobRecommendations';
import InterviewPrep from '../features/InterviewPrep';
import UserProfile from '../features/UserProfile';
import {
  HiOutlineSquares2X2,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlinePlus,
  HiOutlineArrowUpRight,
  HiOutlineCheck
} from 'react-icons/hi2';
import './DashboardLayout.css';

const DashboardLayout = ({ initialTab = 'dashboard', user, onLogout, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light', isDarkMode);
  };

  // Content renderers for each sidebar menu option
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="tab-view fade-in">
            <div className="view-header">
              <div>
                <h2>Welcome back, {user?.name || 'User'} 👋</h2>
                <p>Here is an overview of your resume stats and AI career progress.</p>
              </div>
              <button className="primary-action-btn">
                <HiOutlinePlus /> Create New Resume
              </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper purple">
                  <HiOutlineDocumentText />
                </div>
                <div className="stat-content">
                  <span className="stat-title">Saved Resumes</span>
                  <div className="stat-val-group">
                    <span className="stat-value">{user?.isNewUser ? 0 : (user?.resumes?.length || 0)}</span>
                    <span className="stat-trend positive">{user?.isNewUser ? 'New Account' : '+1 this week'}</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper cyan">
                  <HiOutlineShieldCheck />
                </div>
                <div className="stat-content">
                  <span className="stat-title">Avg. ATS Score</span>
                  <div className="stat-val-group">
                    <span className="stat-value">{user?.isNewUser ? '0%' : '94%'}</span>
                    <span className="stat-trend positive">{user?.isNewUser ? 'Pending Scan' : 'Top 5%'}</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper rose">
                  <HiOutlineBriefcase />
                </div>
                <div className="stat-content">
                  <span className="stat-title">Job Matches</span>
                  <div className="stat-val-group">
                    <span className="stat-value">{user?.isNewUser ? 0 : 14}</span>
                    <span className="stat-trend positive">{user?.isNewUser ? 'Complete profile to match' : '9 New today'}</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper amber">
                  <HiOutlineChatBubbleLeftRight />
                </div>
                <div className="stat-content">
                  <span className="stat-title">Mock Interviews</span>
                  <div className="stat-val-group">
                    <span className="stat-value">{user?.isNewUser ? '0 Done' : '5 Done'}</span>
                    <span className="stat-trend">{user?.isNewUser ? 'Ready to start' : '88% Avg Score'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Cards */}
            <div className="dashboard-columns">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>Recent Resumes</h3>
                  <button className="text-btn" onClick={() => setActiveTab('create-resume')}>
                    View All <HiOutlineArrowUpRight />
                  </button>
                </div>
                <div className="resume-list">
                  {user?.isNewUser || !user?.resumes || user.resumes.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>No resumes created yet. Start building your first ATS-friendly resume!</p>
                      <button className="primary-action-btn" style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }} onClick={() => setActiveTab('create-resume')}>
                        <HiOutlinePlus /> Create First Resume
                      </button>
                    </div>
                  ) : (
                    user.resumes.map((r, idx) => (
                      <div key={idx} className="resume-item">
                        <div className="resume-icon">📄</div>
                        <div className="resume-meta">
                          <h4>{r.title}</h4>
                          <p>Updated recently • ATS Score: <span className="score-high">{r.atsScore || 90}%</span></p>
                        </div>
                        <button className="badge-btn">Edit</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>AI Job Recommendations</h3>
                  <button className="text-btn" onClick={() => setActiveTab('job-recommendation')}>
                    Explore Jobs <HiOutlineArrowUpRight />
                  </button>
                </div>
                <div className="job-list">
                  <div className="job-item">
                    <div className="job-meta">
                      <h4>Staff Software Engineer - AI</h4>
                      <p>OpenAI • San Francisco, CA (Remote) • $210k - $280k</p>
                    </div>
                    <span className="match-pill">98% Match</span>
                  </div>
                  <div className="job-item">
                    <div className="job-meta">
                      <h4>Lead Full Stack Architect</h4>
                      <p>Vercel • Remote • $190k - $240k</p>
                    </div>
                    <span className="match-pill">94% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'create-resume':
      case 'my-resume':
        return (
          <div className="tab-view fade-in">
            <ResumeTemplates />
          </div>
        );

      case 'ai-resume':
        return <AiResumeGenerator />;

      case 'ats-checker':
        return <AtsChecker />;

      case 'job-recommendation':
        return <JobRecommendations />;

      case 'interview-prep':
        return <InterviewPrep />;

      case 'profile':
        return <UserProfile user={user} />;

      case 'setting':
        return (
          <div className="tab-view fade-in">
            <div className="view-header">
              <div>
                <h2>Application Settings</h2>
                <p>Configure notifications, API integrations, and themes.</p>
              </div>
            </div>
            <div className="content-box-placeholder">
              <HiOutlineCog6Tooth className="placeholder-icon" />
              <h3>Preferences & Configuration</h3>
              <p>Customize your AI model choices, data privacy, and notification alerts.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`dashboard-layout-container ${isSidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      {/* Sidebar Component */}
      <Sidebar
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user}
        onLogout={onLogout || onBackToLanding}
      />

      {/* Main Page Area */}
      <div className="dashboard-main-wrapper">
        {/* Top Navbar */}
        <header className="dashboard-top-navbar">
          <div className="nav-search-box">
            <HiOutlineMagnifyingGlass className="search-icon" />
            <input
              type="text"
              placeholder="Search resumes, jobs, ATS templates..."
              className="search-input"
            />
          </div>

          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
            </button>

            <button className="icon-btn notification-btn" title="Notifications">
              <HiOutlineBell />
              <span className="notif-badge" />
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main className="dashboard-body">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
