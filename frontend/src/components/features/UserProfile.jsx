import React, { useState } from 'react';
import {
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineCog6Tooth,
  HiOutlineCheck,
  HiOutlinePlus,
  HiOutlineXMark,
  HiOutlineShieldCheck
} from 'react-icons/hi2';
import './UserProfile.css';

const UserProfile = ({ user, onSaveProfile }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@example.com',
    role: user?.role || 'Senior Full Stack & AI Engineer',
    location: 'San Francisco, CA',
    targetSalary: '$180k - $250k',
    experienceYears: '6+ Years',
    skills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'TailwindCSS', 'GraphQL', 'Docker']
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSave = () => {
    if (onSaveProfile) onSaveProfile(profileData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="user-profile-container fade-in">
      <div className="view-header">
        <div>
          <h2><HiOutlineUser className="icon-user" /> User Profile & Career Preferences</h2>
          <p>Manage your account settings, target role specs, and master skills inventory.</p>
        </div>
        <button className="primary-action-btn" onClick={handleSave}>
          {isSavedNotice ? <><HiOutlineCheck /> Profile Saved!</> : 'Save Profile Changes'}
        </button>
      </div>

      <div className="profile-grid">
        {/* Personal Meta Card */}
        <div className="profile-card user-meta-card">
          <div className="avatar-header">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=a855f7&color=fff&bold=true`}
              alt="User Avatar"
              className="user-avatar-lg"
            />
            <div>
              <h3>{profileData.name}</h3>
              <p className="user-role-badge">{profileData.role}</p>
              <span className="pro-badge"><HiOutlineShieldCheck /> Pro Member</span>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Current Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            />
          </div>
        </div>

        {/* Career & Skills Card */}
        <div className="profile-card career-skills-card">
          <h3><HiOutlineBriefcase /> Target Career Preferences</h3>

          <div className="form-group">
            <label>Target Job Title</label>
            <input
              type="text"
              value={profileData.role}
              onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Target Salary Expectation</label>
            <input
              type="text"
              value={profileData.targetSalary}
              onChange={(e) => setProfileData({ ...profileData, targetSalary: e.target.value })}
            />
          </div>

          <h3><HiOutlineAcademicCap /> Master Skills Inventory</h3>
          <p className="card-subtitle">Skills used to match job recommendations and calculate ATS scores.</p>

          <div className="add-skill-row">
            <input
              type="text"
              placeholder="Add new skill (e.g. AWS, Redis)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button className="icon-btn-secondary" onClick={handleAddSkill}>
              <HiOutlinePlus /> Add
            </button>
          </div>

          <div className="skills-chip-wrapper">
            {profileData.skills.map((skill, idx) => (
              <span key={idx} className="skill-chip-removable">
                {skill}
                <button onClick={() => handleRemoveSkill(skill)}><HiOutlineXMark /></button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
