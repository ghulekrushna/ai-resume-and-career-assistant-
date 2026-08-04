import React, { useState } from 'react';
import {
  HiOutlineSquares2X2,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowLeftOnRectangle,
  HiBars3,
  HiXMark,
  HiOutlineViewColumns
} from 'react-icons/hi2';
import './Sidebar.css';

/**
 * Modern AI Career Assistant Sidebar Component
 * Supports expanded/collapsed states, mobile responsiveness, active selection, and custom badges.
 */
const Sidebar = ({
  activeId = 'dashboard',
  onSelect = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
  user = {
    name: 'Alex Morgan',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  },
  onLogout = () => {}
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTemplateOpen = activeId === 'create-resume' || activeId === 'my-resume';

  // Define navigation items requested by user
  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: HiOutlineSquares2X2,
      badge: null
    },
    ...(!isTemplateOpen
      ? [
          {
            id: 'create-resume',
            label: 'Create Resume',
            icon: HiOutlineDocumentText,
            badge: '3 Saved'
          }
        ]
      : []),
    {
      id: 'job-tracker',
      label: 'Kanban Tracker',
      icon: HiOutlineViewColumns,
      badge: '5 Active',
      badgeClass: 'badge-ai'
    },
    {
      id: 'ai-resume',
      label: 'AI Resume',
      icon: HiOutlineSparkles,
      badge: 'AI',
      badgeClass: 'badge-ai'
    },
    {
      id: 'ats-checker',
      label: 'ATS Checker',
      icon: HiOutlineShieldCheck,
      badge: '98% Score',
      badgeClass: 'badge-success'
    },
    {
      id: 'job-recommendation',
      label: 'Job Recommendation',
      icon: HiOutlineBriefcase,
      badge: '14 Jobs',
      badgeClass: 'badge-primary'
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep',
      icon: HiOutlineChatBubbleLeftRight,
      badge: 'New'
    }
  ];

  const secondaryNavItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: HiOutlineUser,
      badge: null
    },
    {
      id: 'setting',
      label: 'Setting',
      icon: HiOutlineCog6Tooth,
      badge: null
    }
  ];

  const handleItemClick = (id) => {
    onSelect(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeId === item.id;

    return (
      <li key={item.id} className="sidebar-nav-item">
        <button
          type="button"
          className={`sidebar-nav-button ${isActive ? 'active' : ''}`}
          onClick={() => handleItemClick(item.id)}
          title={isCollapsed ? item.label : undefined}
          aria-label={item.label}
        >
          <div className="sidebar-icon-wrapper">
            <Icon className="sidebar-icon" />
          </div>

          {!isCollapsed && (
            <span className="sidebar-label">{item.label}</span>
          )}

          {!isCollapsed && item.badge && (
            <span className={`sidebar-badge ${item.badgeClass || ''}`}>
              {item.badge}
            </span>
          )}

          {isCollapsed && (
            <div className="sidebar-tooltip">
              <span>{item.label}</span>
              {item.badge && <span className="tooltip-badge">{item.badge}</span>}
            </div>
          )}

          {isActive && <div className="sidebar-active-indicator" />}
        </button>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Header Bar Trigger */}
      <div className="sidebar-mobile-trigger-bar">
        <div className="sidebar-logo-brand" onClick={() => handleItemClick('dashboard')}>
          <div className="logo-icon-glow">
            <HiOutlineSparkles className="logo-sparkle" />
          </div>
          <span className="logo-text">ResumAI</span>
        </div>
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <HiXMark /> : <HiBars3 />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => handleItemClick('dashboard')}>
            <div className="brand-icon-box">
              <HiOutlineSparkles className="brand-icon" />
            </div>
            {!isCollapsed && (
              <div className="brand-info">
                <span className="brand-name">Resum<span className="brand-highlight">AI</span></span>
                <span className="brand-tagline">Career Suite</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Collapse sidebar"
          >
            {isCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
          </button>
        </div>

        {/* Navigation Content */}
        <div className="sidebar-content">
          {/* Main Navigation Section */}
          <div className="sidebar-section">
            {!isCollapsed && <div className="sidebar-section-title">Core Tools</div>}
            <ul className="sidebar-nav-list">
              {mainNavItems.map(renderNavItem)}
            </ul>
          </div>

          <div className="sidebar-divider" />

          {/* Account / Preferences Section */}
          <div className="sidebar-section">
            {!isCollapsed && <div className="sidebar-section-title">Account & Config</div>}
            <ul className="sidebar-nav-list">
              {secondaryNavItems.map(renderNavItem)}
            </ul>
          </div>

          {/* Upgrade Card (only in expanded mode) */}
          {!isCollapsed && (
            <div className="sidebar-upgrade-card">
              <div className="upgrade-icon">
                <HiOutlineSparkles />
              </div>
              <div className="upgrade-info">
                <h4>Pro AI Suite</h4>
                <p>Unlock unlimited ATS scans & mock interviews.</p>
              </div>
              <button type="button" className="upgrade-btn">
                Upgrade Pro
              </button>
            </div>
          )}
        </div>

        {/* Footer Profile Section */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="avatar-wrapper">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <span className="online-indicator" />
            </div>

            {!isCollapsed && (
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            )}

            <button
              type="button"
              className="logout-btn"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <HiOutlineArrowLeftOnRectangle />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
