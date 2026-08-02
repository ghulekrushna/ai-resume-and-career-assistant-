import React, { useState } from 'react';
import {
  HiOutlineSparkles,
  HiOutlineArrowDownTray,
  HiOutlineShare,
  HiOutlineEye,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlinePlus,
  HiOutlineTrash,
  HiXMark,
  HiOutlineCloudArrowUp,
  HiOutlineMagnifyingGlassPlus,
  HiOutlineMagnifyingGlassMinus,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import './FullResumeEditor.css';

/**
 * Full-Screen 3-Panel Interactive Resume Editor
 * Matches the user reference screenshot with Left Content Panel, Center Canvas, and Right Formatting Bar.
 */
const FullResumeEditor = ({ template, onClose }) => {
  // Zoom level state
  const [zoomLevel, setZoomLevel] = useState(100);

  // Active accordion section on Left Panel
  const [expandedSection, setExpandedSection] = useState('personal');

  // Helper to extract initial data from template prop
  const getInitialResumeData = (tmpl) => {
    if (tmpl?.initialData) {
      return tmpl.initialData;
    }
    return {
      profileImage: tmpl?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      fullName: tmpl?.initialData?.fullName || 'Alex Morgan',
      jobTitle: tmpl?.roleTitle || (tmpl?.name ? tmpl.name.toUpperCase() : 'SENIOR SOFTWARE ENGINEER'),
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      address: 'San Francisco, CA',
      website: 'https://linkedin.com/in/alex-morgan',
      summary: tmpl?.description || 'Results-driven professional with 6+ years of experience building scalable applications, leading cross-functional engineering teams, and optimizing production cloud environments.',
      experiences: tmpl?.experiences || [
        {
          id: 'exp-1',
          company: 'TECHCORP SOLUTIONS',
          title: tmpl?.roleTitle || 'Senior Software Engineer',
          period: '2022 - Present',
          description: 'Architected high-performance cloud microservices and React web applications. Reduced system latency by 35% across 2M+ active users.'
        },
        {
          id: 'exp-2',
          company: 'INNOVATE LABS',
          title: 'Full Stack Developer',
          period: '2020 - 2022',
          description: 'Designed interactive web dashboards, REST APIs, and automated data processing pipelines using modern web stack.'
        }
      ],
      educations: tmpl?.educations || [
        {
          id: 'edu-1',
          institution: 'Stanford University',
          degree: 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
          year: '2020'
        }
      ],
      skills: tmpl?.skills || ['React.js', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS Cloud']
    };
  };

  // Resume Content State
  const [resumeData, setResumeData] = useState(() => getInitialResumeData(template));

  // Sync state when template prop changes
  React.useEffect(() => {
    if (template) {
      setResumeData(getInitialResumeData(template));
      if (template.accentColors?.[0]) {
        setStyleConfig((prev) => ({ ...prev, accentColor: template.accentColors[0] }));
      }
    }
  }, [template]);

  // Selected element & right panel styling state
  const [selectedElement, setSelectedElement] = useState('jobTitle');
  const [styleConfig, setStyleConfig] = useState({
    fontFamily: 'Outfit, sans-serif',
    fontColor: '#244CEC',
    fontSize: 14,
    opacity: 100,
    letterSpacing: 0,
    alignment: 'left',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    accentColor: template?.accentColors?.[0] || '#244CEC'
  });

  // New item draft states
  const [newSkill, setNewSkill] = useState('');

  // Handlers for zoom
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));

  // Handler for dynamic style updates
  const updateStyle = (key, value) => {
    setStyleConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Add / Remove Experience
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          company: 'NEW COMPANY',
          title: 'Role Title',
          period: '2022 - Present',
          description: 'Add your key responsibilities and accomplishments here.'
        }
      ]
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id)
    }));
  };

  // Add / Remove Skills
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="full-resume-editor-viewport">
      {/* 1. TOP NAVBAR HEADER */}
      <header className="editor-top-navbar">
        <div className="navbar-left">
          <div className="brand-badge">
            <HiOutlineSparkles className="sparkle-icon" />
          </div>
          <div className="editor-breadcrumbs">
            <span>Home</span> <HiOutlineChevronRight /> <span>Project</span> <HiOutlineChevronRight /> <span className="current-crumb">My Resume</span>
          </div>
          <span className="saved-pill">
            <HiOutlineCheckCircle /> Saved
          </span>
        </div>

        <div className="navbar-right">
          <button className="ai-generator-btn">
            <HiOutlineSparkles /> AI Generator
          </button>

          <div className="zoom-control-group">
            <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
              <HiOutlineMagnifyingGlassMinus />
            </button>
            <span className="zoom-value">{zoomLevel}%</span>
            <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
              <HiOutlineMagnifyingGlassPlus />
            </button>
          </div>

          <button className="navbar-icon-btn" title="Toggle Full Preview">
            <HiOutlineEye />
          </button>

          <button className="action-btn download-btn">
            <HiOutlineArrowDownTray /> Download
          </button>

          <button className="action-btn share-btn">
            <HiOutlineShare /> Share
          </button>

          <button className="close-editor-btn" onClick={onClose} title="Exit Full Editor">
            <HiXMark />
          </button>
        </div>
      </header>

      {/* 2. THREE-PANEL CONTAINER */}
      <div className="editor-panels-container">
        
        {/* LEFT PANEL: CONTENT BUILDER */}
        <aside className="editor-left-panel">
          <div className="panel-tab-header">
            <button className="panel-tab active">Create</button>
            <button className="panel-tab">Templates</button>
          </div>

          <div className="accordion-wrapper">
            
            {/* Personal Information Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setExpandedSection(expandedSection === 'personal' ? '' : 'personal')}
              >
                <span>Personal Information</span>
                {expandedSection === 'personal' ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              </button>

              {expandedSection === 'personal' && (
                <div className="accordion-content">
                  <div className="image-upload-box">
                    <label>Profile Image (Optional)</label>
                    <div className="upload-row">
                      <img src={resumeData.profileImage} alt="Profile" className="user-thumb" />
                      <button className="upload-btn">
                        <HiOutlineCloudArrowUp /> Upload
                      </button>
                    </div>
                    <span className="helper-text">Upload a professional photo (recommended: 400x400px)</span>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={resumeData.fullName}
                      onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={resumeData.jobTitle}
                      onChange={(e) => setResumeData({ ...resumeData, jobTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={resumeData.address}
                      onChange={(e) => setResumeData({ ...resumeData, address: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Professional Summary Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setExpandedSection(expandedSection === 'summary' ? '' : 'summary')}
              >
                <span>Professional Summary</span>
                {expandedSection === 'summary' ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              </button>

              {expandedSection === 'summary' && (
                <div className="accordion-content">
                  <div className="form-group">
                    <textarea
                      rows={5}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    />
                  </div>
                  <button className="ai-polish-btn">
                    <HiOutlineSparkles /> Polish Summary with AI
                  </button>
                </div>
              )}
            </div>

            {/* Employment History Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setExpandedSection(expandedSection === 'employment' ? '' : 'employment')}
              >
                <span>Employment History</span>
                {expandedSection === 'employment' ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              </button>

              {expandedSection === 'employment' && (
                <div className="accordion-content">
                  {resumeData.experiences.map((exp, idx) => (
                    <div key={exp.id} className="item-card">
                      <div className="card-top">
                        <strong>Job #{idx + 1}</strong>
                        <button className="delete-item-btn" onClick={() => removeExperience(exp.id)}>
                          <HiOutlineTrash />
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.experiences];
                            updated[idx].company = e.target.value;
                            setResumeData({ ...resumeData, experiences: updated });
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Role</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...resumeData.experiences];
                            updated[idx].title = e.target.value;
                            setResumeData({ ...resumeData, experiences: updated });
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...resumeData.experiences];
                            updated[idx].description = e.target.value;
                            setResumeData({ ...resumeData, experiences: updated });
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <button className="add-new-btn" onClick={addExperience}>
                    <HiOutlinePlus /> Add Employment
                  </button>
                </div>
              )}
            </div>

            {/* Education Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setExpandedSection(expandedSection === 'education' ? '' : 'education')}
              >
                <span>Education</span>
                {expandedSection === 'education' ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              </button>

              {expandedSection === 'education' && (
                <div className="accordion-content">
                  {resumeData.educations.map((edu, idx) => (
                    <div key={edu.id} className="item-card">
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...resumeData.educations];
                            updated[idx].degree = e.target.value;
                            setResumeData({ ...resumeData, educations: updated });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...resumeData.educations];
                            updated[idx].institution = e.target.value;
                            setResumeData({ ...resumeData, educations: updated });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills Accordion */}
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setExpandedSection(expandedSection === 'skills' ? '' : 'skills')}
              >
                <span>Skills</span>
                {expandedSection === 'skills' ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              </button>

              {expandedSection === 'skills' && (
                <div className="accordion-content">
                  <div className="skills-chip-container">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="editor-skill-chip">
                        {skill}
                        <button onClick={() => removeSkill(index)}>×</button>
                      </span>
                    ))}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Type a skill & hit Enter..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </aside>

        {/* CENTER CANVAS: LIVE RESUME PAPER */}
        <main className="editor-center-canvas">
          <div className="canvas-notice">
            Click preview icon to view full size resume and how it will look after downloading
          </div>

          <div
            className="canvas-paper-wrapper"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div
              className={`resume-paper layout-${template?.layoutStyle || template?.category || 'modern'}`}
              style={{
                fontFamily: styleConfig.fontFamily,
                '--accent': styleConfig.accentColor,
                '--text-color': styleConfig.fontColor
              }}
            >
              {/* DYNAMIC LAYOUT 1: ATS CLEAN SINGLE COLUMN */}
              {(template?.layoutStyle === 'ats' || template?.category === 'ats') && (
                <div className="paper-layout-ats">
                  <div className="ats-header">
                    <h1
                      className="paper-name"
                      style={{ color: styleConfig.fontColor, textAlign: styleConfig.alignment }}
                      onClick={() => setSelectedElement('fullName')}
                    >
                      {resumeData.fullName}
                    </h1>
                    <p className="paper-title" style={{ color: styleConfig.accentColor }}>
                      {resumeData.jobTitle}
                    </p>
                    <div className="ats-contact-bar">
                      <span>📞 {resumeData.phone}</span> | <span>✉️ {resumeData.email}</span> | <span>📍 {resumeData.address}</span> | <span>🌐 {resumeData.website}</span>
                    </div>
                  </div>

                  <div className="ats-section">
                    <h3 className="ats-section-heading" style={{ borderBottomColor: styleConfig.accentColor, color: styleConfig.accentColor }}>
                      PROFESSIONAL SUMMARY
                    </h3>
                    <p className="summary-paragraph">{resumeData.summary}</p>
                  </div>

                  <div className="ats-section">
                    <h3 className="ats-section-heading" style={{ borderBottomColor: styleConfig.accentColor, color: styleConfig.accentColor }}>
                      WORK EXPERIENCE
                    </h3>
                    {resumeData.experiences.map((exp) => (
                      <div key={exp.id} className="ats-exp-block">
                        <div className="ats-exp-row">
                          <strong className="exp-role-title">{exp.title}</strong>
                          <span className="exp-date">{exp.period}</span>
                        </div>
                        <div className="ats-company-name">{exp.company}</div>
                        <p className="exp-body">{exp.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="ats-section">
                    <h3 className="ats-section-heading" style={{ borderBottomColor: styleConfig.accentColor, color: styleConfig.accentColor }}>
                      EDUCATION
                    </h3>
                    {resumeData.educations.map((edu) => (
                      <div key={edu.id} className="ats-edu-block">
                        <div className="ats-exp-row">
                          <strong className="edu-degree">{edu.degree}</strong>
                          <span className="exp-date">{edu.year}</span>
                        </div>
                        <div className="edu-school">{edu.institution}</div>
                      </div>
                    ))}
                  </div>

                  <div className="ats-section">
                    <h3 className="ats-section-heading" style={{ borderBottomColor: styleConfig.accentColor, color: styleConfig.accentColor }}>
                      TECHNICAL SKILLS & COMPETENCIES
                    </h3>
                    <div className="ats-skills-wrap">
                      {resumeData.skills.map((s, i) => (
                        <span key={i} className="ats-skill-badge">
                          • {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC LAYOUT 2: EXECUTIVE LEADERSHIP LUXURY */}
              {(template?.layoutStyle === 'executive' || template?.category === 'executive') && (
                <div className="paper-layout-executive">
                  <div className="exec-top-banner" style={{ borderBottomColor: styleConfig.accentColor }}>
                    <h1 className="exec-name">{resumeData.fullName}</h1>
                    <p className="exec-title" style={{ color: styleConfig.accentColor }}>{resumeData.jobTitle}</p>
                    <div className="exec-contact-row">
                      <span>{resumeData.email}</span> • <span>{resumeData.phone}</span> • <span>{resumeData.address}</span> • <span>{resumeData.website}</span>
                    </div>
                  </div>

                  <div className="exec-summary-box">
                    <p className="exec-summary-text">{resumeData.summary}</p>
                  </div>

                  <div className="exec-grid-container">
                    <div className="exec-col-main">
                      <h3 className="exec-heading" style={{ color: styleConfig.accentColor, borderBottomColor: styleConfig.accentColor }}>
                        EXECUTIVE EXPERIENCE
                      </h3>
                      {resumeData.experiences.map((exp) => (
                        <div key={exp.id} className="exec-exp-card">
                          <div className="exec-card-head">
                            <strong className="exec-role">{exp.title}</strong>
                            <span className="exec-period">{exp.period}</span>
                          </div>
                          <span className="exec-company">{exp.company}</span>
                          <p className="exec-desc">{exp.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="exec-col-side">
                      <h3 className="exec-heading" style={{ color: styleConfig.accentColor, borderBottomColor: styleConfig.accentColor }}>
                        BOARD & EDUCATION
                      </h3>
                      {resumeData.educations.map((edu) => (
                        <div key={edu.id} className="exec-edu-card">
                          <strong>{edu.degree}</strong>
                          <div className="exec-institution">{edu.institution} ({edu.year})</div>
                        </div>
                      ))}

                      <h3 className="exec-heading" style={{ color: styleConfig.accentColor, borderBottomColor: styleConfig.accentColor, marginTop: '1.25rem' }}>
                        CORE COMPETENCIES
                      </h3>
                      <ul className="exec-skills-list">
                        {resumeData.skills.map((s, i) => (
                          <li key={i}>❖ {s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC LAYOUT 3: CREATIVE CANVAS & PORTFOLIO */}
              {(template?.layoutStyle === 'creative' || template?.category === 'creative') && (
                <div className="paper-layout-creative">
                  <div className="creative-header-card" style={{ borderTopColor: styleConfig.accentColor }}>
                    {resumeData.profileImage && (
                      <div className="creative-avatar">
                        <img src={resumeData.profileImage} alt="User Avatar" />
                      </div>
                    )}
                    <div className="creative-header-info">
                      <h1 className="creative-name">{resumeData.fullName}</h1>
                      <p className="creative-job-title" style={{ color: styleConfig.accentColor }}>{resumeData.jobTitle}</p>
                      <div className="creative-contact">
                        <span>✉️ {resumeData.email}</span> | <span>📞 {resumeData.phone}</span> | <span>🌐 {resumeData.website}</span>
                      </div>
                    </div>
                  </div>

                  <div className="creative-body-grid">
                    <div className="creative-main-content">
                      <div className="creative-section-card">
                        <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>ABOUT ME</h3>
                        <p className="summary-paragraph">{resumeData.summary}</p>
                      </div>

                      <div className="creative-section-card">
                        <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>CAREER HIGHLIGHTS</h3>
                        {resumeData.experiences.map((exp) => (
                          <div key={exp.id} className="creative-exp-item">
                            <div className="creative-exp-head">
                              <strong>{exp.title}</strong>
                              <span className="creative-badge" style={{ backgroundColor: styleConfig.accentColor }}>{exp.period}</span>
                            </div>
                            <div className="creative-company">{exp.company}</div>
                            <p className="exp-body">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="creative-sidebar">
                      <div className="creative-section-card">
                        <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>SKILLS & TOOLS</h3>
                        <div className="creative-skills-grid">
                          {resumeData.skills.map((s, i) => (
                            <span key={i} className="creative-skill-pill" style={{ borderColor: styleConfig.accentColor }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="creative-section-card">
                        <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>EDUCATION</h3>
                        {resumeData.educations.map((edu) => (
                          <div key={edu.id} className="creative-edu-item">
                            <strong>{edu.degree}</strong>
                            <div className="edu-school">{edu.institution} • {edu.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC LAYOUT 4: MODERN 2-COLUMN (DEFAULT) */}
              {(!template?.layoutStyle || template?.layoutStyle === 'modern' || template?.category === 'modern') && (
                <div className="paper-two-column">
                  
                  {/* Left Column on Paper */}
                  <div className="paper-col-left">
                    {resumeData.profileImage && (
                      <div className="profile-photo-circle" style={{ borderColor: styleConfig.accentColor }}>
                        <img src={resumeData.profileImage} alt="User" />
                      </div>
                    )}

                    {/* Contact Block */}
                    <div className="paper-section-block">
                      <h3 className="section-title-icon" style={{ color: styleConfig.accentColor }}>
                        <span className="icon-dot" style={{ backgroundColor: styleConfig.accentColor }} />
                        CONTACT
                      </h3>
                      <ul className="contact-list">
                        <li>📞 {resumeData.phone}</li>
                        <li>✉️ {resumeData.email}</li>
                        <li>📍 {resumeData.address}</li>
                        <li>🌐 {resumeData.website}</li>
                      </ul>
                    </div>

                    {/* Skills Block */}
                    <div className="paper-section-block">
                      <h3 className="section-title-icon" style={{ color: styleConfig.accentColor }}>
                        <span className="icon-dot" style={{ backgroundColor: styleConfig.accentColor }} />
                        SKILLS
                      </h3>
                      <ul className="skills-list">
                        {resumeData.skills.map((s, i) => (
                          <li key={i} style={{ borderBottomColor: styleConfig.accentColor }}>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column on Paper */}
                  <div className="paper-col-right">
                    {/* Header Banner */}
                    <div className="paper-top-banner">
                      <h1
                        className="paper-name"
                        style={{
                          color: styleConfig.fontColor,
                          fontSize: `${styleConfig.fontSize + 12}px`,
                          letterSpacing: `${styleConfig.letterSpacing}px`,
                          textAlign: styleConfig.alignment,
                          opacity: styleConfig.opacity / 100
                        }}
                        onClick={() => setSelectedElement('fullName')}
                      >
                        {resumeData.fullName}
                      </h1>
                      <p
                        className="paper-title"
                        style={{
                          color: styleConfig.accentColor,
                          fontSize: `${styleConfig.fontSize}px`,
                          letterSpacing: '2px',
                          fontWeight: styleConfig.isBold ? 700 : 400
                        }}
                        onClick={() => setSelectedElement('jobTitle')}
                      >
                        {resumeData.jobTitle}
                      </p>
                      <div className="header-divider" style={{ backgroundColor: styleConfig.accentColor }} />
                    </div>

                    {/* Profile Summary */}
                    <div className="paper-section-block">
                      <h3 className="section-title-icon" style={{ color: styleConfig.accentColor }}>
                        <span className="icon-dot" style={{ backgroundColor: styleConfig.accentColor }} />
                        PROFILE
                      </h3>
                      <p className="summary-paragraph">{resumeData.summary}</p>
                    </div>

                    {/* Work Experience */}
                    <div className="paper-section-block">
                      <h3 className="section-title-icon" style={{ color: styleConfig.accentColor }}>
                        <span className="icon-dot" style={{ backgroundColor: styleConfig.accentColor }} />
                        WORK EXPERIENCE
                      </h3>
                      {resumeData.experiences.map((exp) => (
                        <div key={exp.id} className="exp-block">
                          <div className="exp-header">
                            <strong className="exp-company-name">{exp.company}</strong>
                            <span className="exp-date">{exp.period}</span>
                          </div>
                          <div className="exp-role-title">{exp.title}</div>
                          <p className="exp-body">{exp.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="paper-section-block">
                      <h3 className="section-title-icon" style={{ color: styleConfig.accentColor }}>
                        <span className="icon-dot" style={{ backgroundColor: styleConfig.accentColor }} />
                        EDUCATION
                      </h3>
                      {resumeData.educations.map((edu) => (
                        <div key={edu.id} className="edu-block">
                          <strong className="edu-degree">{edu.degree}</strong>
                          <div className="edu-school">{edu.institution} • {edu.year}</div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        </main>

        {/* RIGHT PANEL: STYLING & TYPOGRAPHY TOOLBAR */}
        <aside className="editor-right-panel">
          <div className="right-panel-header">
            <h4>Select an element to edit</h4>
            <div className="quick-toolbar">
              <button
                className={`tool-btn ${styleConfig.isBold ? 'active' : ''}`}
                onClick={() => updateStyle('isBold', !styleConfig.isBold)}
              >
                B
              </button>
              <button
                className={`tool-btn ${styleConfig.isItalic ? 'active' : ''}`}
                onClick={() => updateStyle('isItalic', !styleConfig.isItalic)}
              >
                <i>I</i>
              </button>
              <button
                className={`tool-btn ${styleConfig.alignment === 'left' ? 'active' : ''}`}
                onClick={() => updateStyle('alignment', 'left')}
              >
                ≡
              </button>
              <button
                className={`tool-btn ${styleConfig.alignment === 'center' ? 'active' : ''}`}
                onClick={() => updateStyle('alignment', 'center')}
              >
                ≎
              </button>
            </div>
          </div>

          <div className="style-section-box">
            <h5 className="section-subtitle">Edit Text</h5>
            <span className="target-element-name">Element: {selectedElement}</span>

            {/* Accent Color Palette */}
            <div className="style-control-group">
              <label>Theme Accent Color</label>
              <div className="color-palette-row">
                {['#244CEC', '#a855f7', '#06b6d4', '#10b981', '#f43f5e', '#0f172a'].map((c) => (
                  <button
                    key={c}
                    className={`color-swatch ${styleConfig.accentColor === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => updateStyle('accentColor', c)}
                  />
                ))}
              </div>
            </div>

            {/* Text Color Picker */}
            <div className="style-control-group">
              <label>Text Color</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={styleConfig.fontColor}
                  onChange={(e) => updateStyle('fontColor', e.target.value)}
                />
                <input
                  type="text"
                  value={styleConfig.fontColor}
                  onChange={(e) => updateStyle('fontColor', e.target.value)}
                  className="hex-input"
                />
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="style-control-group">
              <div className="label-with-val">
                <label>Size</label>
                <span>{styleConfig.fontSize} px</span>
              </div>
              <input
                type="range"
                min={10}
                max={28}
                value={styleConfig.fontSize}
                onChange={(e) => updateStyle('fontSize', Number(e.target.value))}
                className="style-slider"
              />
            </div>

            {/* Opacity Slider */}
            <div className="style-control-group">
              <div className="label-with-val">
                <label>Opacity</label>
                <span>{styleConfig.opacity}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={styleConfig.opacity}
                onChange={(e) => updateStyle('opacity', Number(e.target.value))}
                className="style-slider"
              />
            </div>

            {/* Letter Spacing Slider */}
            <div className="style-control-group">
              <div className="label-with-val">
                <label>Letter Spacing</label>
                <span>{styleConfig.letterSpacing}px</span>
              </div>
              <input
                type="range"
                min={-1}
                max={6}
                value={styleConfig.letterSpacing}
                onChange={(e) => updateStyle('letterSpacing', Number(e.target.value))}
                className="style-slider"
              />
            </div>
          </div>

          <div className="style-section-box">
            <h5 className="section-subtitle">Style Effects</h5>
            <div className="effect-options">
              <div className="effect-item">
                <span>Shape</span> <HiOutlineChevronRight />
              </div>
              <div className="effect-item">
                <span>Shadow</span> <HiOutlineChevronRight />
              </div>
              <div className="effect-item">
                <span>Outline</span> <HiOutlineChevronRight />
              </div>
            </div>
          </div>

          {/* Floating AI Helper Button */}
          <button className="floating-ai-widget-btn" title="Ask AI Co-pilot">
            <HiOutlineSparkles />
          </button>
        </aside>

      </div>
    </div>
  );
};

export default FullResumeEditor;
