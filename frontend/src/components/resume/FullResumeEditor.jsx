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
  HiOutlineCheckCircle,
  HiArrowLeft,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiBars3BottomLeft,
  HiOutlineChevronLeft,
  HiArrowUp,
  HiArrowDown,
  HiBars3
} from 'react-icons/hi2';
import './FullResumeEditor.css';

/**
 * Full-Screen 3-Panel Interactive Resume Editor with Drag-and-Drop Section Reordering
 */
const FullResumeEditor = ({ template, onClose, onSave }) => {
  // Zoom level state
  const [zoomLevel, setZoomLevel] = useState(100);

  // Mobile mode tab state & window width listener
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview' | 'styles'
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Radix Animated Sidebar Collapsed State & Shortcut (Ctrl+B / Cmd+B)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  // Active accordion section on Left Panel
  const [expandedSection, setExpandedSection] = useState('personal');


  const handleSaveDraft = () => {
    if (onSave) {
      onSave({
        id: template?.id || `tmpl-saved-${Date.now()}`,
        name: resumeData.fullName ? `${resumeData.fullName}'s Resume` : 'Saved Custom Resume',
        category: 'my-resumes',
        atsScore: '98%',
        tag: 'Saved Resume',
        tagClass: 'tag-ats',
        description: `Last updated ${new Date().toLocaleDateString()}`,
        initialData: resumeData
      });
    }
  };

  const handleBackToTemplates = () => {
    handleSaveDraft();
    onClose();
  };

  // Radix Sidebar keyboard shortcut listener (Ctrl+B / Cmd+B)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsLeftSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to extract initial data from template prop or localStorage
  const getInitialResumeData = (tmpl) => {
    try {
      const savedData = localStorage.getItem('resuai_saved_resume_data');
      if (savedData && !tmpl?.overrideDraft) {
        return JSON.parse(savedData);
      }
    } catch (e) {}

    if (tmpl?.initialData) {
      return {
        sectionOrder: ['summary', 'employment', 'education', 'skills'],
        ...tmpl.initialData
      };
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
      sectionOrder: tmpl?.sectionOrder || ['summary', 'employment', 'education', 'skills'],
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
          institution: 'STANFORD UNIVERSITY',
          degree: 'B.S. in Computer Science',
          year: '2016 - 2020'
        }
      ],
      skills: tmpl?.skills || ['React.js', 'Node.js', 'TypeScript', 'FastAPI', 'AWS Cloud', 'Docker', 'System Architecture']
    };
  };

  // Resume Content State
  const [resumeData, setResumeData] = useState(() => getInitialResumeData(template));

  // Reset or update resume data when a new template is selected
  React.useEffect(() => {
    if (template) {
      setResumeData(getInitialResumeData(template));
      if (template.accentColors?.[0]) {
        setStyleConfig((prev) => ({ ...prev, accentColor: template.accentColors[0] }));
      }
    }
  }, [template]);

  // Auto-save resumeData state to localStorage on every change
  React.useEffect(() => {
    if (resumeData) {
      try {
        localStorage.setItem('resuai_saved_resume_data', JSON.stringify(resumeData));
      } catch (e) {}
    }
  }, [resumeData]);

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

  // Drag-and-Drop state for Reordering
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const [draggedExpIndex, setDraggedExpIndex] = useState(null);
  const [draggedEduIndex, setDraggedEduIndex] = useState(null);
  const [draggedSkillIndex, setDraggedSkillIndex] = useState(null);

  const sectionOrder = resumeData.sectionOrder || ['summary', 'employment', 'education', 'skills'];

  // Handlers for section reordering
  const moveSection = (index, direction, e) => {
    if (e) e.stopPropagation();
    const currentOrder = [...sectionOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
    
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    setResumeData((prev) => ({ ...prev, sectionOrder: currentOrder }));
  };

  const handleSectionDragStart = (e, index) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSectionDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === dropIndex) return;

    const currentOrder = [...sectionOrder];
    const draggedItem = currentOrder[draggedSectionIndex];
    currentOrder.splice(draggedSectionIndex, 1);
    currentOrder.splice(dropIndex, 0, draggedItem);

    setResumeData((prev) => ({ ...prev, sectionOrder: currentOrder }));
    setDraggedSectionIndex(null);
  };

  // Reorder Experiences
  const moveExperience = (index, direction, e) => {
    if (e) e.stopPropagation();
    const updated = [...resumeData.experiences];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setResumeData((prev) => ({ ...prev, experiences: updated }));
  };

  const handleExpDragStart = (e, index) => {
    setDraggedExpIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleExpDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedExpIndex === null || draggedExpIndex === dropIndex) return;

    const updated = [...resumeData.experiences];
    const draggedItem = updated[draggedExpIndex];
    updated.splice(draggedExpIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    setResumeData((prev) => ({ ...prev, experiences: updated }));
    setDraggedExpIndex(null);
  };

  // Reorder Educations
  const moveEducation = (index, direction, e) => {
    if (e) e.stopPropagation();
    const updated = [...resumeData.educations];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setResumeData((prev) => ({ ...prev, educations: updated }));
  };

  const handleEduDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedEduIndex === null || draggedEduIndex === dropIndex) return;

    const updated = [...resumeData.educations];
    const draggedItem = updated[draggedEduIndex];
    updated.splice(draggedEduIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    setResumeData((prev) => ({ ...prev, educations: updated }));
    setDraggedEduIndex(null);
  };

  // Reorder Skills
  const moveSkill = (index, direction, e) => {
    if (e) e.stopPropagation();
    const updated = [...resumeData.skills];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setResumeData((prev) => ({ ...prev, skills: updated }));
  };

  const handleSkillDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedSkillIndex === null || draggedSkillIndex === dropIndex) return;

    const updated = [...resumeData.skills];
    const draggedItem = updated[draggedSkillIndex];
    updated.splice(draggedSkillIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    setResumeData((prev) => ({ ...prev, skills: updated }));
    setDraggedSkillIndex(null);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));

  const updateStyle = (key, value) => {
    setStyleConfig((prev) => ({ ...prev, [key]: value }));
  };

  const imageInputRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeData((prev) => ({
        ...prev,
        profileImage: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

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

  // Generate Download HTML respecting user section order
  const handleDownload = () => {
    const rawName = resumeData.fullName || 'Selected_Resume';
    const formattedName = rawName.replace(/\s+/g, '_');
    
    // Map section blocks according to user's sectionOrder
    const sectionHtmlMap = {
      summary: resumeData.summary ? `<div class="section-title">Professional Summary</div><div class="summary">${resumeData.summary}</div>` : '',
      employment: (resumeData.experiences && resumeData.experiences.length > 0) ? `
        <div class="section-title">Work Experience</div>
        ${resumeData.experiences.map(exp => `
          <div class="exp-item">
            <div class="exp-row"><span>${exp.title || ''}</span> <span>${exp.period || ''}</span></div>
            <div class="exp-company">${exp.company || ''}</div>
            <div class="exp-desc">${exp.description || ''}</div>
          </div>
        `).join('')}
      ` : '',
      education: (resumeData.educations && resumeData.educations.length > 0) ? `
        <div class="section-title">Education</div>
        ${resumeData.educations.map(edu => `
          <div class="exp-item">
            <div class="exp-row"><span>${edu.degree || ''}</span> <span>${edu.year || ''}</span></div>
            <div class="exp-company">${edu.institution || ''}</div>
          </div>
        `).join('')}
      ` : '',
      skills: (resumeData.skills && resumeData.skills.length > 0) ? `
        <div class="section-title">Core Technical Skills</div>
        <div class="skills-flex">
          ${resumeData.skills.map(s => `<span class="skill-badge">${s}</span>`).join('')}
        </div>
      ` : ''
    };

    const reorderedBodyHtml = sectionOrder.map(key => sectionHtmlMap[key] || '').join('');

    const selectedResumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${formattedName}_Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${styleConfig.fontFamily || 'Plus Jakarta Sans, sans-serif'}; background: #ffffff; color: #0f172a; padding: 40px; }
    .resume-container { max-width: 800px; margin: 0 auto; }
    .header { border-left: 4px solid ${styleConfig.accentColor || '#2563eb'}; padding-left: 20px; margin-bottom: 24px; }
    .name { font-size: 30px; font-weight: 800; color: ${styleConfig.fontColor || '#0f172a'}; }
    .title { font-size: 15px; font-weight: 700; color: ${styleConfig.accentColor || '#2563eb'}; text-transform: uppercase; margin-top: 4px; }
    .contact { font-size: 13.5px; color: #64748b; margin-top: 6px; }
    .section-title { font-size: 14px; font-weight: 800; color: ${styleConfig.accentColor || '#2563eb'}; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin: 20px 0 12px; }
    .summary { font-size: 14px; line-height: 1.6; color: #334155; }
    .exp-item { margin-bottom: 16px; }
    .exp-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; }
    .exp-company { font-size: 13.5px; color: ${styleConfig.accentColor || '#2563eb'}; font-weight: 600; margin-bottom: 4px; }
    .exp-desc { font-size: 13.5px; color: #334155; line-height: 1.5; }
    .skills-flex { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-badge { background: #f1f5f9; border: 1px solid #cbd5e1; font-size: 12.5px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="header">
      <div class="name">${resumeData.fullName || 'User Resume'}</div>
      <div class="title">${resumeData.jobTitle || ''}</div>
      <div class="contact">${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.address || ''}</div>
    </div>
    ${reorderedBodyHtml}
  </div>
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>`;

    const blob = new Blob([selectedResumeHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formattedName}_Selected_Resume.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Section title mapping
  const sectionMeta = {
    summary: { title: 'Professional Summary', icon: <HiOutlineDocumentText /> },
    employment: { title: 'Employment History', icon: <HiOutlineBriefcase /> },
    education: { title: 'Education', icon: <HiOutlineAcademicCap /> },
    skills: { title: 'Skills', icon: <HiOutlineSparkles /> }
  };

  return (
    <div className="full-resume-editor-viewport">
      {/* 1. TOP NAVBAR HEADER */}
      <header className="editor-top-navbar">
        <div className="navbar-left">
          <button className="back-to-templates-btn" onClick={handleBackToTemplates} title="Back to Resume Templates">
            <HiArrowLeft /> Back to Templates
          </button>

          <button
            className={`sidebar-trigger-btn ${isLeftSidebarCollapsed ? 'is-collapsed' : ''}`}
            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            title="Toggle Information Sidebar (Ctrl+B)"
          >
            <HiBars3BottomLeft />
          </button>

          <div className="brand-badge">
            <HiOutlineSparkles className="sparkle-icon" />
          </div>
          <div className="editor-breadcrumbs">
            <span>Dashboard</span> <HiOutlineChevronRight /> <span>Resume Templates</span> <HiOutlineChevronRight /> <span className="current-crumb">{template?.name || 'My Resume'}</span>
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
            <div className="zoom-presets" style={{ display: 'flex', gap: '4px', marginLeft: '6px' }}>
              {[50, 75, 100, 125].map((preset) => (
                <button
                  key={preset}
                  className={`zoom-preset-btn ${zoomLevel === preset ? 'active' : ''}`}
                  onClick={() => setZoomLevel(preset)}
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: zoomLevel === preset ? '#2563eb' : '#ffffff',
                    color: zoomLevel === preset ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <button className="navbar-icon-btn" title="Toggle Full Preview">
            <HiOutlineEye />
          </button>

          <button className="action-btn download-btn" onClick={handleDownload} title="Download Resume PDF">
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

      {/* Mobile View Switcher Tabs (<768px) */}
      {isMobile && (
        <div className="mobile-editor-tabs-bar">
          <button
            type="button"
            className={`mobile-editor-tab-btn ${mobileTab === 'editor' ? 'active' : ''}`}
            onClick={() => setMobileTab('editor')}
          >
            <HiOutlineDocumentText /> Form Content
          </button>
          <button
            type="button"
            className={`mobile-editor-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileTab('preview')}
          >
            <HiOutlineEye /> Paper Preview
          </button>
          <button
            type="button"
            className={`mobile-editor-tab-btn ${mobileTab === 'styles' ? 'active' : ''}`}
            onClick={() => setMobileTab('styles')}
          >
            <HiOutlineSparkles /> Style & Export
          </button>
        </div>
      )}

      {/* 2. THREE-PANEL CONTAINER */}
      <div className="editor-panels-container">
        
        {/* LEFT PANEL: CONTENT BUILDER */}
        <aside className={`editor-left-panel ${isLeftSidebarCollapsed ? 'collapsed' : ''} ${isMobile && mobileTab !== 'editor' ? 'mobile-hidden' : ''} ${isMobile && mobileTab === 'editor' ? 'mobile-full-width' : ''}`}>

          <div
            className="sidebar-rail"
            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            title="Toggle Sidebar Rail Handle"
          />

          {isLeftSidebarCollapsed ? (
            <div className="collapsed-sidebar-nav">
              <button
                className={`collapsed-nav-btn ${expandedSection === 'personal' ? 'active' : ''}`}
                onClick={() => {
                  setExpandedSection('personal');
                  setIsLeftSidebarCollapsed(false);
                }}
                title="Personal Information"
              >
                <HiOutlineUser />
                <span className="sidebar-tooltip-popup">Personal Information</span>
              </button>

              {sectionOrder.map((key) => (
                <button
                  key={key}
                  className={`collapsed-nav-btn ${expandedSection === key ? 'active' : ''}`}
                  onClick={() => {
                    setExpandedSection(key);
                    setIsLeftSidebarCollapsed(false);
                  }}
                  title={sectionMeta[key]?.title}
                >
                  {sectionMeta[key]?.icon}
                  <span className="sidebar-tooltip-popup">{sectionMeta[key]?.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="panel-tab-header">
                <button className="panel-tab active">Create</button>
                <button className="panel-tab">Templates</button>
              </div>

              {/* Drag and Drop Instruction Banner */}
              <div className="section-reorder-banner">
                <strong>
                  <HiBars3 /> Drag or use ↑ ↓ to reorder sections
                </strong>
              </div>

              <div className="accordion-wrapper">
                {/* Personal Information Accordion (Fixed Header) */}
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
                          <img
                            src={resumeData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                            alt="Profile"
                            className="user-thumb"
                          />
                          <input
                            type="file"
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <button
                            type="button"
                            className="upload-btn"
                            onClick={() => imageInputRef.current?.click()}
                            title="Upload profile photo"
                          >
                            <HiOutlineCloudArrowUp /> Upload Image
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

                {/* DYNAMIC DRAGGABLE ACCORDION SECTIONS */}
                {sectionOrder.map((sectionKey, idx) => {
                  const isDragging = draggedSectionIndex === idx;

                  return (
                    <div
                      key={sectionKey}
                      className={`accordion-item ${isDragging ? 'is-dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleSectionDragStart(e, idx)}
                      onDragOver={handleSectionDragOver}
                      onDrop={(e) => handleSectionDrop(e, idx)}
                    >
                      <div
                        className="accordion-header"
                        onClick={() => setExpandedSection(expandedSection === sectionKey ? '' : sectionKey)}
                      >
                        <span className="drag-handle-btn" title="Drag to reorder section">
                          <HiBars3 />
                        </span>

                        <span style={{ flex: 1, marginLeft: 6 }}>{sectionMeta[sectionKey]?.title}</span>

                        {/* Reorder Action Buttons */}
                        <div className="reorder-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="reorder-btn"
                            disabled={idx === 0}
                            onClick={(e) => moveSection(idx, -1, e)}
                            title="Move section up"
                          >
                            <HiArrowUp />
                          </button>
                          <button
                            className="reorder-btn"
                            disabled={idx === sectionOrder.length - 1}
                            onClick={(e) => moveSection(idx, 1, e)}
                            title="Move section down"
                          >
                            <HiArrowDown />
                          </button>
                        </div>

                        {expandedSection === sectionKey ? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
                      </div>

                      {/* SUMMARY CONTENT */}
                      {sectionKey === 'summary' && expandedSection === 'summary' && (
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

                      {/* EMPLOYMENT CONTENT */}
                      {sectionKey === 'employment' && expandedSection === 'employment' && (
                        <div className="accordion-content">
                          {resumeData.experiences.map((exp, expIdx) => (
                            <div
                              key={exp.id}
                              className={`item-card ${draggedExpIndex === expIdx ? 'is-dragging' : ''}`}
                              draggable
                              onDragStart={(e) => handleExpDragStart(e, expIdx)}
                              onDragOver={handleSectionDragOver}
                              onDrop={(e) => handleExpDrop(e, expIdx)}
                            >
                              <div className="card-top">
                                <span className="drag-handle-btn" title="Drag to reorder job">
                                  <HiBars3 />
                                </span>
                                <strong>Job #{expIdx + 1}</strong>

                                <div className="reorder-actions" style={{ marginLeft: 'auto' }}>
                                  <button
                                    className="reorder-btn"
                                    disabled={expIdx === 0}
                                    onClick={(e) => moveExperience(expIdx, -1, e)}
                                    title="Move job up"
                                  >
                                    <HiArrowUp />
                                  </button>
                                  <button
                                    className="reorder-btn"
                                    disabled={expIdx === resumeData.experiences.length - 1}
                                    onClick={(e) => moveExperience(expIdx, 1, e)}
                                    title="Move job down"
                                  >
                                    <HiArrowDown />
                                  </button>
                                </div>

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
                                    updated[expIdx].company = e.target.value;
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
                                    updated[expIdx].title = e.target.value;
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
                                    updated[expIdx].description = e.target.value;
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

                      {/* EDUCATION CONTENT */}
                      {sectionKey === 'education' && expandedSection === 'education' && (
                        <div className="accordion-content">
                          {resumeData.educations.map((edu, eduIdx) => (
                            <div
                              key={edu.id}
                              className={`item-card ${draggedEduIndex === eduIdx ? 'is-dragging' : ''}`}
                              draggable
                              onDragStart={() => setDraggedEduIndex(eduIdx)}
                              onDragOver={handleSectionDragOver}
                              onDrop={(e) => handleEduDrop(e, eduIdx)}
                            >
                              <div className="card-top">
                                <span className="drag-handle-btn">
                                  <HiBars3 />
                                </span>
                                <strong>Education #{eduIdx + 1}</strong>

                                <div className="reorder-actions">
                                  <button
                                    className="reorder-btn"
                                    disabled={eduIdx === 0}
                                    onClick={(e) => moveEducation(eduIdx, -1, e)}
                                  >
                                    <HiArrowUp />
                                  </button>
                                  <button
                                    className="reorder-btn"
                                    disabled={eduIdx === resumeData.educations.length - 1}
                                    onClick={(e) => moveEducation(eduIdx, 1, e)}
                                  >
                                    <HiArrowDown />
                                  </button>
                                </div>
                              </div>

                              <div className="form-group">
                                <label>Degree</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const updated = [...resumeData.educations];
                                    updated[eduIdx].degree = e.target.value;
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
                                    updated[eduIdx].institution = e.target.value;
                                    setResumeData({ ...resumeData, educations: updated });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SKILLS CONTENT */}
                      {sectionKey === 'skills' && expandedSection === 'skills' && (
                        <div className="accordion-content">
                          <div className="skills-chip-container">
                            {resumeData.skills.map((skill, skillIdx) => (
                              <span
                                key={skillIdx}
                                className="editor-skill-chip-draggable"
                                draggable
                                onDragStart={() => setDraggedSkillIndex(skillIdx)}
                                onDragOver={handleSectionDragOver}
                                onDrop={(e) => handleSkillDrop(e, skillIdx)}
                              >
                                <span className="drag-handle-btn" style={{ padding: 0 }}>
                                  <HiBars3 />
                                </span>
                                {skill}
                                <button className="reorder-btn" style={{ width: 18, height: 18 }} onClick={(e) => moveSkill(skillIdx, -1, e)} disabled={skillIdx === 0}>‹</button>
                                <button className="reorder-btn" style={{ width: 18, height: 18 }} onClick={(e) => moveSkill(skillIdx, 1, e)} disabled={skillIdx === resumeData.skills.length - 1}>›</button>
                                <button onClick={() => removeSkill(skillIdx)}>×</button>
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
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/* CENTER CANVAS: LIVE RESUME PAPER (DYNAMIC SECTION ORDERING) */}
        <main className={`editor-center-canvas ${isMobile && mobileTab !== 'preview' ? 'mobile-hidden' : ''} ${isMobile && mobileTab === 'preview' ? 'mobile-full-width' : ''}`}>
          <div className="canvas-notice">
            Click preview icon to view full size resume and how it will look after downloading
          </div>

          <div
            className="canvas-paper-wrapper"
            style={{ transform: `scale(${(zoomLevel / 100) * (isMobile ? Math.min(1, (window.innerWidth - 24) / 670) : 1)})` }}
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

                  {sectionOrder.map((key) => {
                    if (key === 'summary' && resumeData.summary) {
                      return (
                        <div key="summary" className="ats-section">
                          <h3 className="ats-section-heading" style={{ borderBottomColor: styleConfig.accentColor, color: styleConfig.accentColor }}>
                            PROFESSIONAL SUMMARY
                          </h3>
                          <p className="summary-paragraph">{resumeData.summary}</p>
                        </div>
                      );
                    }
                    if (key === 'employment' && resumeData.experiences?.length > 0) {
                      return (
                        <div key="employment" className="ats-section">
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
                      );
                    }
                    if (key === 'education' && resumeData.educations?.length > 0) {
                      return (
                        <div key="education" className="ats-section">
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
                      );
                    }
                    if (key === 'skills' && resumeData.skills?.length > 0) {
                      return (
                        <div key="skills" className="ats-section">
                          <h3 className="ats-section-heading" style={{ borderBottomColor: styleConfig.accentColor, color: styleConfig.accentColor }}>
                            TECHNICAL SKILLS & COMPETENCIES
                          </h3>
                          <div className="ats-skills-wrap">
                            {resumeData.skills.map((s, i) => (
                              <span key={i} className="ats-skill-badge">• {s}</span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
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

                  {sectionOrder.map((key) => {
                    if (key === 'summary' && resumeData.summary) {
                      return (
                        <div key="summary" className="exec-summary-box">
                          <p className="exec-summary-text">{resumeData.summary}</p>
                        </div>
                      );
                    }
                    if (key === 'employment' && resumeData.experiences?.length > 0) {
                      return (
                        <div key="employment" style={{ marginBottom: '1.25rem' }}>
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
                      );
                    }
                    if (key === 'education' && resumeData.educations?.length > 0) {
                      return (
                        <div key="education" style={{ marginBottom: '1.25rem' }}>
                          <h3 className="exec-heading" style={{ color: styleConfig.accentColor, borderBottomColor: styleConfig.accentColor }}>
                            BOARD & EDUCATION
                          </h3>
                          {resumeData.educations.map((edu) => (
                            <div key={edu.id} className="exec-edu-card">
                              <strong>{edu.degree}</strong>
                              <div className="exec-institution">{edu.institution} ({edu.year})</div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (key === 'skills' && resumeData.skills?.length > 0) {
                      return (
                        <div key="skills" style={{ marginBottom: '1.25rem' }}>
                          <h3 className="exec-heading" style={{ color: styleConfig.accentColor, borderBottomColor: styleConfig.accentColor }}>
                            CORE COMPETENCIES
                          </h3>
                          <ul className="exec-skills-list">
                            {resumeData.skills.map((s, i) => (
                              <li key={i}>❖ {s}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return null;
                  })}
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
                      {sectionOrder.map((key) => {
                        if (key === 'summary' && resumeData.summary) {
                          return (
                            <div key="summary" className="creative-section-card">
                              <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>ABOUT ME</h3>
                              <p className="summary-paragraph">{resumeData.summary}</p>
                            </div>
                          );
                        }
                        if (key === 'employment' && resumeData.experiences?.length > 0) {
                          return (
                            <div key="employment" className="creative-section-card">
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
                          );
                        }
                        return null;
                      })}
                    </div>

                    <div className="creative-sidebar">
                      {sectionOrder.map((key) => {
                        if (key === 'skills' && resumeData.skills?.length > 0) {
                          return (
                            <div key="skills" className="creative-section-card">
                              <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>SKILLS & TOOLS</h3>
                              <div className="creative-skills-grid">
                                {resumeData.skills.map((s, i) => (
                                  <span key={i} className="creative-skill-pill" style={{ borderColor: styleConfig.accentColor }}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (key === 'education' && resumeData.educations?.length > 0) {
                          return (
                            <div key="education" className="creative-section-card">
                              <h3 className="creative-heading" style={{ color: styleConfig.accentColor }}>EDUCATION</h3>
                              {resumeData.educations.map((edu) => (
                                <div key={edu.id} className="creative-edu-item">
                                  <strong>{edu.degree}</strong>
                                  <div className="edu-school">{edu.institution} • {edu.year}</div>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })}
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

                    {/* Skills Block (if skills is ordered to left sidebar) */}
                    {resumeData.skills?.length > 0 && (
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
                    )}
                  </div>

                  {/* Right Column on Paper - Dynamic Section Order */}
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

                    {/* Dynamically Rendered Reorderable Main Sections */}
                    {sectionOrder.map((sectionKey) => {
                      if (sectionKey === 'summary' && resumeData.summary) {
                        return (
                          <div key="summary" className="paper-section-block">
                            <h3 className="section-title-icon" style={{ color: styleConfig.accentColor }}>
                              <span className="icon-dot" style={{ backgroundColor: styleConfig.accentColor }} />
                              PROFILE
                            </h3>
                            <p className="summary-paragraph">{resumeData.summary}</p>
                          </div>
                        );
                      }
                      if (sectionKey === 'employment' && resumeData.experiences?.length > 0) {
                        return (
                          <div key="employment" className="paper-section-block">
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
                        );
                      }
                      if (sectionKey === 'education' && resumeData.educations?.length > 0) {
                        return (
                          <div key="education" className="paper-section-block">
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
                        );
                      }
                      return null;
                    })}
                  </div>

                </div>
              )}

            </div>

            {/* Visual A4 Printable Page Break Guide Line */}
            <div className="a4-page-break-line" />
          </div>

          {/* Floating Mobile Download Button (Visible when in Paper Preview Tab) */}
          {isMobile && (
            <button
              className="mobile-canvas-floating-download"
              onClick={handleDownload}
              title="Download Resume PDF"
            >
              <HiOutlineArrowDownTray /> Download Resume (PDF)
            </button>
          )}
        </main>

        {/* RIGHT PANEL: STYLING & TYPOGRAPHY TOOLBAR */}
        <aside className={`editor-right-panel ${isMobile && mobileTab !== 'styles' ? 'mobile-hidden' : ''} ${isMobile && mobileTab === 'styles' ? 'mobile-full-width' : ''}`}>

          {/* Prominent Export Button */}
          <div className="style-export-banner">
            <button className="primary-download-action-btn" onClick={handleDownload}>
              <HiOutlineArrowDownTray /> Download Resume PDF
            </button>
          </div>

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

          <button className="floating-ai-widget-btn" title="Ask AI Co-pilot">
            <HiOutlineSparkles />
          </button>
        </aside>

      </div>
    </div>
  );
};

export default FullResumeEditor;

