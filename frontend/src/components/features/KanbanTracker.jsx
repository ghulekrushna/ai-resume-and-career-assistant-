import React, { useState } from 'react';
import {
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlineShieldCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiXMark,
  HiOutlineCheckCircle,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin
} from 'react-icons/hi2';
import './KanbanTracker.css';

const DEFAULT_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    company: 'Google',
    location: 'Mountain View, CA (Hybrid)',
    salary: '$185,000 - $210,000',
    status: 'offered',
    atsScore: 96,
    appliedDate: '2026-07-20',
    notes: 'Offer letter received! Finalizing equity package negotiation with recruiter.'
  },
  {
    id: 'job-2',
    title: 'AI Systems Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA (Remote)',
    salary: '$190,000 - $220,000',
    status: 'interviewing',
    atsScore: 94,
    appliedDate: '2026-07-25',
    notes: 'Technical STAR System Architecture interview scheduled for Thursday.'
  },
  {
    id: 'job-3',
    title: 'Lead Frontend Architect',
    company: 'Stripe',
    location: 'Remote',
    salary: '$175,000 - $195,000',
    status: 'applied',
    atsScore: 91,
    appliedDate: '2026-07-28',
    notes: 'Submitted customized ATS Resume tailored to React & TypeScript systems.'
  },
  {
    id: 'job-4',
    title: 'Product Engineer',
    company: 'Vercel',
    location: 'Remote',
    salary: '$165,000 - $185,000',
    status: 'wishlist',
    atsScore: 89,
    appliedDate: '2026-08-01',
    notes: 'Saved posting. Need to polish bullet points for Next.js infrastructure.'
  },
  {
    id: 'job-5',
    title: 'Backend Python Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$180,000 - $200,000',
    status: 'applied',
    atsScore: 88,
    appliedDate: '2026-08-02',
    notes: 'Applied via company portal with cover letter.'
  }
];

const STAGES = [
  { id: 'wishlist', label: 'Wishlist', class: 'col-tag-wishlist' },
  { id: 'applied', label: 'Applied', class: 'col-tag-applied' },
  { id: 'interviewing', label: 'Interviewing', class: 'col-tag-interviewing' },
  { id: 'offered', label: 'Offered 🎉', class: 'col-tag-offered' },
  { id: 'rejected', label: 'Archived', class: 'col-tag-rejected' }
];

export default function KanbanTracker({ gainXp, onNavigateToAts }) {
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('resuai_kanban_jobs');
      return saved ? JSON.parse(saved) : DEFAULT_JOBS;
    } catch (e) {
      return DEFAULT_JOBS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [draggedJobId, setDraggedJobId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    status: 'wishlist',
    atsScore: 92,
    notes: ''
  });

  const saveJobsToStorage = (newJobs) => {
    setJobs(newJobs);
    try {
      localStorage.setItem('resuai_kanban_jobs', JSON.stringify(newJobs));
    } catch (e) {
      console.error('Failed to save kanban jobs', e);
    }
  };

  // Move Job Card to adjacent stage
  const moveJobStage = (jobId, direction) => {
    const stageIds = STAGES.map((s) => s.id);
    const updated = jobs.map((job) => {
      if (job.id === jobId) {
        const currentIdx = stageIds.indexOf(job.status);
        const nextIdx = currentIdx + direction;
        if (nextIdx >= 0 && nextIdx < stageIds.length) {
          const newStatus = stageIds[nextIdx];
          if (gainXp) {
            gainXp(25, `Moved Application to ${newStatus.toUpperCase()}`);
          }
          return { ...job, status: newStatus };
        }
      }
      return job;
    });
    saveJobsToStorage(updated);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, jobId) => {
    setDraggedJobId(jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    setDragOverStage(null);
    if (!draggedJobId) return;

    const updated = jobs.map((job) => {
      if (job.id === draggedJobId && job.status !== targetStageId) {
        if (gainXp) {
          gainXp(30, `Moved Application to ${targetStageId.toUpperCase()}`);
        }
        return { ...job, status: targetStageId };
      }
      return job;
    });

    saveJobsToStorage(updated);
    setDraggedJobId(null);
  };

  // Modal Open & Submit Handlers
  const handleOpenAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      salary: '',
      status: 'wishlist',
      atsScore: 92,
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      status: job.status,
      atsScore: job.atsScore,
      notes: job.notes
    });
    setShowModal(true);
  };

  const handleDeleteJob = (jobId) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    saveJobsToStorage(updated);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    if (editingJob) {
      const updated = jobs.map((j) => (j.id === editingJob.id ? { ...j, ...formData } : j));
      saveJobsToStorage(updated);
    } else {
      const newJob = {
        id: `job-${Date.now()}`,
        ...formData,
        appliedDate: new Date().toISOString().split('T')[0]
      };
      saveJobsToStorage([newJob, ...jobs]);
      if (gainXp) {
        gainXp(50, 'Added New Job Application');
      }
    }

    setShowModal(false);
  };

  // Search Filter
  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const totalApps = jobs.length;
  const interviewingCount = jobs.filter((j) => j.status === 'interviewing').length;
  const offersCount = jobs.filter((j) => j.status === 'offered').length;
  const responseRate = totalApps > 0 ? Math.round(((interviewingCount + offersCount) / totalApps) * 100) : 0;

  return (
    <div className="kanban-container fade-in">
      {/* Header & Title */}
      <div className="kanban-header">
        <div className="kanban-title-box">
          <h2>
            <HiOutlineBriefcase /> Job Application Kanban Tracker
          </h2>
          <p>Organize, track, and optimize your job application pipeline linked with ATS scans.</p>
        </div>

        <div className="kanban-controls">
          <input
            type="text"
            className="kanban-search-input"
            placeholder="Search company or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-job-btn" onClick={handleOpenAddModal}>
            <HiOutlinePlus /> Add New Job
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats Row */}
      <div className="kanban-analytics-row">
        <div className="kanban-stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <HiOutlineBriefcase />
          </div>
          <div className="stat-details">
            <h4>{totalApps}</h4>
            <span>Total Applications</span>
          </div>
        </div>

        <div className="kanban-stat-card">
          <div className="stat-icon-wrapper stat-icon-cyan">
            <HiOutlineSparkles />
          </div>
          <div className="stat-details">
            <h4>{responseRate}%</h4>
            <span>Interview Response Rate</span>
          </div>
        </div>

        <div className="kanban-stat-card">
          <div className="stat-icon-wrapper stat-icon-yellow">
            <HiOutlineShieldCheck />
          </div>
          <div className="stat-details">
            <h4>{interviewingCount} Active</h4>
            <span>Interviews Scheduled</span>
          </div>
        </div>

        <div className="kanban-stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <HiOutlineCheckCircle />
          </div>
          <div className="stat-details">
            <h4>{offersCount} Offer</h4>
            <span>Offers Received</span>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="kanban-board">
        {STAGES.map((stage, stageIdx) => {
          const stageJobs = filteredJobs.filter((j) => j.status === stage.id);
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`kanban-column ${isOver ? 'is-drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="column-header">
                <span className={`column-title ${stage.class}`}>{stage.label}</span>
                <span className="column-count">{stageJobs.length}</span>
              </div>

              <div className="cards-container">
                {stageJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`kanban-card ${draggedJobId === job.id ? 'is-dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job.id)}
                  >
                    <div className="card-top-bar">
                      <span className="card-company">{job.company}</span>
                      <span className={`card-ats-badge ${job.atsScore >= 90 ? 'ats-high' : 'ats-mid'}`}>
                        <HiOutlineShieldCheck /> {job.atsScore}% ATS
                      </span>
                    </div>

                    <h4 className="card-job-title">{job.title}</h4>

                    <div className="card-meta-row">
                      {job.salary && <span>💰 {job.salary}</span>}
                      {job.location && <span>📍 {job.location}</span>}
                    </div>

                    {job.notes && <div className="card-notes">{job.notes}</div>}

                    <div className="card-footer">
                      <div className="move-buttons-group">
                        <button
                          className="card-action-btn"
                          disabled={stageIdx === 0}
                          onClick={() => moveJobStage(job.id, -1)}
                          title="Move stage left"
                        >
                          <HiOutlineChevronLeft />
                        </button>
                        <button
                          className="card-action-btn"
                          disabled={stageIdx === STAGES.length - 1}
                          onClick={() => moveJobStage(job.id, 1)}
                          title="Move stage right"
                        >
                          <HiOutlineChevronRight />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          className="ats-scan-link"
                          onClick={onNavigateToAts}
                          title="Scan ATS Score for this role"
                        >
                          <HiOutlineShieldCheck /> ATS
                        </button>
                        <button
                          className="card-action-btn"
                          onClick={() => handleOpenEditModal(job)}
                          title="Edit application"
                        >
                          <HiOutlinePencilSquare />
                        </button>
                        <button
                          className="card-action-btn"
                          onClick={() => handleDeleteJob(job.id)}
                          title="Delete application"
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Job Modal */}
      {showModal && (
        <div className="kanban-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="kanban-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="kanban-modal-header">
              <h3>{editingJob ? 'Edit Job Application' : 'Add New Job Application'}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="kanban-form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  className="kanban-form-input"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="kanban-form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  className="kanban-form-input"
                  placeholder="e.g. Google, Stripe"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="kanban-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="kanban-form-input"
                    placeholder="e.g. Remote / NYC"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="kanban-form-group">
                  <label>Salary Range</label>
                  <input
                    type="text"
                    className="kanban-form-input"
                    placeholder="e.g. $160,000/yr"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="kanban-form-group">
                  <label>Pipeline Stage</label>
                  <select
                    className="kanban-form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kanban-form-group">
                  <label>ATS Match Score (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    className="kanban-form-input"
                    value={formData.atsScore}
                    onChange={(e) => setFormData({ ...formData, atsScore: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="kanban-form-group">
                <label>Notes / Interview Links</label>
                <textarea
                  rows="3"
                  className="kanban-form-textarea"
                  placeholder="Add notes, interviewer names, or next steps..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="kanban-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="add-job-btn">
                  {editingJob ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
