import React, { useState, useRef } from 'react';
import {
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineCurrencyRupee,
  HiOutlineSparkles,
  HiOutlineFunnel,
  HiOutlineArrowUpRight,
  HiOutlineBuildingOffice2,
  HiOutlineBookmark,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineArrowUpTray,
  HiOutlineCheckCircle,
  HiOutlinePaperClip,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone
} from 'react-icons/hi2';
import './JobRecommendations.css';

const JobRecommendations = ({ onGainXp, user, onNavigateToTracker }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'remote', 'high-match'
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [activeJobModal, setActiveJobModal] = useState(null);

  // Application state
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('resuai_applied_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Resume selection state in Apply Modal
  const [resumeMode, setResumeMode] = useState('saved'); // 'saved' or 'upload'
  const [selectedResumeId, setSelectedResumeId] = useState('res-1');
  const [uploadedResumeFile, setUploadedResumeFile] = useState(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [successPopData, setSuccessPopData] = useState(null);

  const fileInputRef = useRef(null);

  // Candidate contact details
  const [applicantForm, setApplicantForm] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@example.com',
    phone: '+91 98765 43210',
    coverNote: ''
  });

  // Preset saved resumes available in candidate's profile
  const savedResumesList = [
    {
      id: 'res-1',
      title: 'Senior_FullStack_AI_Developer.pdf',
      atsScore: 98,
      lastUpdated: 'Updated 2 days ago',
      targetRole: 'Full Stack & AI Systems'
    },
    {
      id: 'res-2',
      title: 'Lead_Frontend_Architect_Resume.pdf',
      atsScore: 95,
      lastUpdated: 'Updated 1 week ago',
      targetRole: 'React, Next.js & Web UI'
    },
    {
      id: 'res-3',
      title: 'Cloud_Platform_Engineer_Profile.pdf',
      atsScore: 92,
      lastUpdated: 'Updated 2 weeks ago',
      targetRole: 'Python, DevOps & Cloud'
    }
  ];

  const mockJobs = [
    {
      id: 'job-1',
      title: 'Senior AI & Full Stack Engineer',
      company: 'Razorpay',
      location: 'Bengaluru, Karnataka (Hybrid)',
      salary: '₹32,00,000 - ₹45,00,000 / year',
      matchScore: 98,
      type: 'Full-time',
      experience: '4+ Years',
      posted: '2 hours ago',
      skills: ['React', 'TypeScript', 'Python', 'FastAPI', 'Payment Systems', 'System Architecture'],
      description: 'Razorpay is looking for a Senior AI & Full Stack Engineer to build next-gen payment gateways, intelligent checkout journeys, and AI-driven automated merchant fraud detection.'
    },
    {
      id: 'job-2',
      title: 'Lead Full Stack Architect',
      company: 'Flipkart',
      location: 'Bengaluru, Karnataka (Remote / Hybrid)',
      salary: '₹42,00,000 - ₹58,00,000 / year',
      matchScore: 95,
      type: 'Full-time',
      experience: 'Senior Level',
      posted: '1 day ago',
      skills: ['Next.js', 'React 19', 'Node.js', 'Distributed Systems', 'Microservices', 'TailwindCSS'],
      description: 'Join Flipkart to lead e-commerce web platform architectures, high-concurrency order processing microservices, and modern UI engineering serving millions of daily shoppers across India.'
    },
    {
      id: 'job-3',
      title: 'Principal AI & Cloud Solutions Architect',
      company: 'TCS (Tata Consultancy Services)',
      location: 'Hyderabad / Pune (Hybrid)',
      salary: '₹28,00,000 - ₹38,00,000 / year',
      matchScore: 92,
      type: 'Full-time',
      experience: '6+ Years',
      posted: '3 days ago',
      skills: ['Python', 'LLM Infrastructure', 'Cloud Architecture', 'AWS', 'PyTorch', 'GenAI'],
      description: 'Work with TCS AI Labs and premier enterprise customers to architect Generative AI workflows, automated document intelligence engines, and scalable multi-cloud microservices.'
    },
    {
      id: 'job-4',
      title: 'Senior Software Engineer - Platform',
      company: 'Swiggy',
      location: 'Bengaluru, Karnataka (Remote)',
      salary: '₹30,00,000 - ₹44,00,000 / year',
      matchScore: 91,
      type: 'Full-time',
      experience: '3-6 Years',
      posted: '4 days ago',
      skills: ['Node.js', 'Go', 'Distributed Systems', 'Redis', 'Kafka', 'API Design'],
      description: 'Build ultra-low latency routing engines, instant delivery dispatch platforms, and resilient real-time microservices at Swiggy.'
    },
    {
      id: 'job-5',
      title: 'Staff Frontend / Full Stack Architect',
      company: 'Zoho Corporation',
      location: 'Chennai, Tamil Nadu (On-site / Hybrid)',
      salary: '₹26,00,000 - ₹36,00,000 / year',
      matchScore: 89,
      type: 'Full-time',
      experience: '5+ Years',
      posted: '5 days ago',
      skills: ['React', 'JavaScript', 'Java', 'Cloud Architecture', 'Web Security'],
      description: 'Drive strategic architecture and high-performance frontend platforms powering Zoho’s global suite of business productivity tools used by millions worldwide.'
    },
    {
      id: 'job-6',
      title: 'Senior AI/ML Platform Engineer',
      company: 'Jio Platforms',
      location: 'Mumbai, Maharashtra (Hybrid)',
      salary: '₹34,00,000 - ₹48,00,000 / year',
      matchScore: 87,
      type: 'Full-time',
      experience: '5+ Years',
      posted: '1 week ago',
      skills: ['Python', 'PyTorch', 'Kubernetes', 'MLOps', 'Big Data', 'Docker'],
      description: 'Develop high-throughput AI inference pipelines and nationwide digital ecosystem services reaching over 450 million Indian users across telecom and digital commerce.'
    },
    {
      id: 'job-7',
      title: 'Senior Web & Mobile Engineer',
      company: 'Zomato',
      location: 'Gurugram, Haryana (On-site / Hybrid)',
      salary: '₹32,00,000 - ₹46,00,000 / year',
      matchScore: 85,
      type: 'Full-time',
      experience: '4+ Years',
      posted: '1 week ago',
      skills: ['React', 'React Native', 'TypeScript', 'GraphQL', 'Web Performance'],
      description: 'Craft seamless consumer interfaces, rapid ordering flows, and live tracking experiences for millions of food and grocery delivery orders across India.'
    },
    {
      id: 'job-8',
      title: 'Lead Cloud & Full Stack Consultant',
      company: 'Infosys',
      location: 'Pune / Bengaluru (Hybrid)',
      salary: '₹24,00,000 - ₹34,00,000 / year',
      matchScore: 84,
      type: 'Full-time',
      experience: '5+ Years',
      posted: '1 week ago',
      skills: ['React', 'Angular', 'Java Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
      description: 'Deliver modern cloud-native systems, scalable microservice architectures, and responsive web platforms for top-tier global enterprise clients.'
    }
  ];

  const handleToggleSave = (id) => {
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter(jId => jId !== id));
    } else {
      setSavedJobIds([...savedJobIds, id]);
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.some(app => app.jobId === jobId);
  };

  const handleOpenApplyModal = (job) => {
    setActiveJobModal(null);
    setApplyModalJob(job);
    setUploadedResumeFile(null);
    setResumeMode('saved');
    setSelectedResumeId('res-1');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedResumeFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        lastModified: new Date().toLocaleDateString()
      });
      setResumeMode('upload');
    }
  };

  const handleConfirmSubmitApplication = () => {
    if (!applyModalJob) return;

    let attachedResumeName = '';
    if (resumeMode === 'upload' && uploadedResumeFile) {
      attachedResumeName = uploadedResumeFile.name;
    } else {
      const found = savedResumesList.find(r => r.id === selectedResumeId);
      attachedResumeName = found ? found.title : 'Resume_Profile.pdf';
    }

    setIsSubmittingApp(true);

    // Simulate direct applicant upload to company ATS
    setTimeout(() => {
      const newAppRef = `IND-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      const applicationRecord = {
        jobId: applyModalJob.id,
        jobTitle: applyModalJob.title,
        company: applyModalJob.company,
        location: applyModalJob.location,
        salary: applyModalJob.salary,
        resumeName: attachedResumeName,
        appRef: newAppRef,
        appliedDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        status: 'applied',
        atsScore: applyModalJob.matchScore
      };

      const updatedApplied = [applicationRecord, ...appliedJobs.filter(a => a.jobId !== applyModalJob.id)];
      setAppliedJobs(updatedApplied);
      try {
        localStorage.setItem('resuai_applied_jobs', JSON.stringify(updatedApplied));

        // Sync with Kanban Tracker jobs so it appears directly on the board
        const existingKanban = localStorage.getItem('resuai_kanban_jobs');
        const kanbanList = existingKanban ? JSON.parse(existingKanban) : [];
        const newKanbanJob = {
          id: `kanban-${Date.now()}`,
          title: applyModalJob.title,
          company: applyModalJob.company,
          location: applyModalJob.location,
          salary: applyModalJob.salary,
          status: 'applied',
          atsScore: applyModalJob.matchScore,
          appliedDate: new Date().toISOString().split('T')[0],
          notes: `Applied with resume: ${attachedResumeName} (Ref: ${newAppRef})`
        };
        localStorage.setItem('resuai_kanban_jobs', JSON.stringify([newKanbanJob, ...kanbanList.filter(k => k.company !== applyModalJob.company || k.title !== applyModalJob.title)]));
      } catch (err) {
        console.error('Failed saving application', err);
      }

      // Gain XP
      if (typeof onGainXp === 'function') {
        onGainXp(30, `Applied to ${applyModalJob.company}!`);
      }

      setIsSubmittingApp(false);
      setApplyModalJob(null);

      // Trigger Celebration Pop Message Modal
      setSuccessPopData({
        ...applicationRecord,
        candidateName: applicantForm.name
      });
    }, 850);
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'remote') return matchesSearch && job.location.includes('Remote');
    if (selectedFilter === 'high-match') return matchesSearch && job.matchScore >= 95;
    return matchesSearch;
  });

  return (
    <div className="job-recs-container fade-in">
      <div className="view-header">
        <div>
          <h2><HiOutlineBriefcase className="icon-briefcase" /> AI Job Recommendations & Applications</h2>
          <p>Explore opportunities with premier Indian tech companies and apply with one click using your tailored ATS resume.</p>
        </div>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="job-filters-bar">
        <div className="search-input-box">
          <HiOutlineMagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title, Indian company, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Recommended ({mockJobs.length})
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'high-match' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('high-match')}
          >
            🔥 95%+ Match Only
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'remote' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('remote')}
          >
            🌐 Remote / Hybrid
          </button>
        </div>
      </div>

      {/* Job Cards List */}
      <div className="jobs-list-grid">
        {filteredJobs.length === 0 ? (
          <div className="empty-jobs-state">
            <HiOutlineBriefcase className="empty-icon" />
            <p>No jobs found matching your search filter.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const hasApplied = isJobApplied(job.id);
            return (
              <div key={job.id} className={`job-card-wrapper fade-in ${hasApplied ? 'job-applied-border' : ''}`}>
                <div className="job-card-header">
                  <div className="company-logo-avatar">
                    <HiOutlineBuildingOffice2 />
                  </div>
                  <div className="job-title-group">
                    <div className="title-applied-row">
                      <h3>{job.title}</h3>
                      {hasApplied && (
                        <span className="applied-pill-badge">
                          <HiOutlineCheckCircle /> Applied
                        </span>
                      )}
                    </div>
                    <p className="company-name">{job.company} • <span className="posted-time">{job.posted}</span></p>
                  </div>

                  <div className="match-badge-pill">
                    <HiOutlineSparkles /> {job.matchScore}% Match
                  </div>
                </div>

                <div className="job-details-pills">
                  <span><HiOutlineMapPin /> {job.location}</span>
                  <span><HiOutlineCurrencyRupee /> {job.salary}</span>
                  <span className="job-type-pill">{job.type}</span>
                </div>

                <p className="job-short-desc">{job.description}</p>

                <div className="job-skills-tags">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="skill-chip">{skill}</span>
                  ))}
                </div>

                <div className="job-card-actions">
                  <button
                    className={`save-btn ${savedJobIds.includes(job.id) ? 'saved' : ''}`}
                    onClick={() => handleToggleSave(job.id)}
                  >
                    <HiOutlineBookmark /> {savedJobIds.includes(job.id) ? 'Saved' : 'Save'}
                  </button>

                  <button
                    className="icon-btn-secondary view-details-btn"
                    onClick={() => setActiveJobModal(job)}
                  >
                    View Details <HiOutlineArrowUpRight />
                  </button>

                  {hasApplied ? (
                    <button
                      className="primary-action-btn apply-btn already-applied-btn"
                      onClick={() => {
                        const app = appliedJobs.find(a => a.jobId === job.id);
                        if (app) setSuccessPopData(app);
                      }}
                    >
                      <HiOutlineCheckCircle /> View Application
                    </button>
                  ) : (
                    <button
                      className="primary-action-btn apply-btn"
                      onClick={() => handleOpenApplyModal(job)}
                    >
                      <HiOutlineArrowUpTray /> Apply to Company
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Job Details */}
      {activeJobModal && (
        <div className="modal-backdrop fade-in" onClick={() => setActiveJobModal(null)}>
          <div className="job-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{activeJobModal.title}</h2>
                <p className="modal-subtitle">{activeJobModal.company} • {activeJobModal.location}</p>
              </div>
              <span className="match-badge-pill large">
                <HiOutlineSparkles /> {activeJobModal.matchScore}% Match
              </span>
            </div>

            <div className="modal-body">
              <h4>Job Overview</h4>
              <p>{activeJobModal.description}</p>

              <h4>Compensation & Experience</h4>
              <p className="highlight-text">{activeJobModal.salary} • {activeJobModal.experience}</p>

              <h4>Required & Matched Skills</h4>
              <div className="job-skills-tags">
                {activeJobModal.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip matched">✓ {skill}</span>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="icon-btn-secondary" onClick={() => setActiveJobModal(null)}>
                Close
              </button>
              <button
                className="primary-action-btn apply-btn"
                onClick={() => handleOpenApplyModal(activeJobModal)}
              >
                <HiOutlineArrowUpTray /> Apply to {activeJobModal.company} Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply to Company Modal (Select Resume & Upload) */}
      {applyModalJob && (
        <div className="modal-backdrop fade-in" onClick={() => !isSubmittingApp && setApplyModalJob(null)}>
          <div className="job-modal-box apply-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="apply-modal-tag">Job Application</span>
                <h2>Apply to {applyModalJob.company}</h2>
                <p className="modal-subtitle">{applyModalJob.title} • {applyModalJob.location}</p>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setApplyModalJob(null)}
                disabled={isSubmittingApp}
              >
                <HiOutlineXMark />
              </button>
            </div>

            <div className="modal-body apply-modal-body">
              {/* Resume Selection Section */}
              <div className="apply-section-group">
                <label className="section-label">
                  <HiOutlineDocumentText /> Step 1: Select or Upload Resume for {applyModalJob.company}
                </label>

                <div className="resume-mode-switch">
                  <button
                    type="button"
                    className={`mode-btn ${resumeMode === 'saved' ? 'active' : ''}`}
                    onClick={() => setResumeMode('saved')}
                  >
                    Select Saved Resume
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${resumeMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setResumeMode('upload')}
                  >
                    Upload New Resume File
                  </button>
                </div>

                {resumeMode === 'saved' ? (
                  <div className="saved-resumes-selector">
                    {savedResumesList.map((res) => (
                      <div
                        key={res.id}
                        className={`saved-resume-card ${selectedResumeId === res.id ? 'selected' : ''}`}
                        onClick={() => setSelectedResumeId(res.id)}
                      >
                        <div className="resume-card-left">
                          <input
                            type="radio"
                            name="selectedResume"
                            checked={selectedResumeId === res.id}
                            onChange={() => setSelectedResumeId(res.id)}
                          />
                          <div className="resume-info">
                            <span className="resume-file-title">{res.title}</span>
                            <span className="resume-file-meta">{res.targetRole} • {res.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="resume-ats-pill">
                          ATS Score: <strong>{res.atsScore}%</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="upload-dropzone-box"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.doc"
                      style={{ display: 'none' }}
                    />
                    <HiOutlineArrowUpTray className="upload-icon-large" />
                    {uploadedResumeFile ? (
                      <div className="uploaded-file-details">
                        <span className="uploaded-filename"><HiOutlinePaperClip /> {uploadedResumeFile.name}</span>
                        <span className="uploaded-meta">{uploadedResumeFile.size} • Verified ATS Ready ✓</span>
                        <button
                          type="button"
                          className="change-file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div className="dropzone-text">
                        <p className="dropzone-main-text">Click to browse or drop your resume here</p>
                        <p className="dropzone-sub-text">Supported formats: PDF, DOCX (Max 10MB)</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Applicant Contact Details */}
              <div className="apply-section-group">
                <label className="section-label">
                  <HiOutlineUser /> Step 2: Applicant Information
                </label>
                <div className="apply-grid-inputs">
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <HiOutlineUser className="field-icon" />
                      <input
                        type="text"
                        value={applicantForm.name}
                        onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                        placeholder="e.g. Krushna Sharma"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <HiOutlineEnvelope className="field-icon" />
                      <input
                        type="email"
                        value={applicantForm.email}
                        onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                        placeholder="e.g. krushna@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '0.75rem' }}>
                  <label>Phone Number (India)</label>
                  <div className="input-with-icon">
                    <HiOutlinePhone className="field-icon" />
                    <input
                      type="text"
                      value={applicantForm.phone}
                      onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '0.75rem' }}>
                  <label>Short Note to {applyModalJob.company} Hiring Team (Optional)</label>
                  <textarea
                    rows={2}
                    className="cover-textarea"
                    placeholder={`Hello ${applyModalJob.company} team, I am eager to apply my full-stack and AI skills to this role...`}
                    value={applicantForm.coverNote}
                    onChange={(e) => setApplicantForm({ ...applicantForm, coverNote: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="icon-btn-secondary"
                onClick={() => setApplyModalJob(null)}
                disabled={isSubmittingApp}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-action-btn submit-app-btn"
                onClick={handleConfirmSubmitApplication}
                disabled={isSubmittingApp || (resumeMode === 'upload' && !uploadedResumeFile)}
              >
                {isSubmittingApp ? (
                  <>
                    <span className="spinner-dot"></span> Uploading & Submitting...
                  </>
                ) : (
                  <>
                    <HiOutlineCheck /> Submit Application to {applyModalJob.company}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP MESSAGE MODAL: Application Submitted Successfully */}
      {successPopData && (
        <div className="modal-backdrop fade-in" onClick={() => setSuccessPopData(null)}>
          <div className="job-modal-box success-pop-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-pop-icon-wrapper">
              <div className="success-icon-pulse">
                <HiOutlineCheckCircle />
              </div>
              <div className="sparkle-decoration">
                <HiOutlineSparkles />
              </div>
            </div>

            <div className="success-pop-header">
              <h3>Application Submitted Successfully! 🎉</h3>
              <p>Your resume and candidate profile have been uploaded and delivered directly to the hiring team at <strong>{successPopData.company}</strong>.</p>
            </div>

            <div className="success-app-receipt">
              <div className="receipt-row">
                <span className="receipt-label">Company:</span>
                <span className="receipt-val highlight">{successPopData.company}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Role:</span>
                <span className="receipt-val">{successPopData.jobTitle}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Attached Resume:</span>
                <span className="receipt-val resume-badge"><HiOutlineDocumentText /> {successPopData.resumeName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Application ID:</span>
                <span className="receipt-val mono-val">{successPopData.appRef}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status:</span>
                <span className="receipt-val status-val"><span className="status-dot"></span> Applied & Received</span>
              </div>
            </div>

            <div className="success-pop-actions">
              {onNavigateToTracker && (
                <button
                  type="button"
                  className="icon-btn-secondary track-kanban-btn"
                  onClick={() => {
                    setSuccessPopData(null);
                    onNavigateToTracker();
                  }}
                >
                  <HiOutlineBriefcase /> View in Application Tracker
                </button>
              )}
              <button
                type="button"
                className="primary-action-btn done-pop-btn"
                onClick={() => setSuccessPopData(null)}
              >
                Done & Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;

