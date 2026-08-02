import React, { useState } from 'react';
import {
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
  HiOutlineFunnel,
  HiOutlineArrowUpRight,
  HiOutlineBuildingOffice2,
  HiOutlineBookmark,
  HiOutlineCheck
} from 'react-icons/hi2';
import './JobRecommendations.css';

const JobRecommendations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'remote', 'high-match'
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [activeJobModal, setActiveJobModal] = useState(null);

  const mockJobs = [
    {
      id: 'job-1',
      title: 'Staff Software Engineer - AI Systems',
      company: 'OpenAI',
      location: 'San Francisco, CA (Remote)',
      salary: '$220,000 - $290,000 / year',
      matchScore: 98,
      type: 'Full-time',
      experience: 'Senior / Lead',
      posted: '2 hours ago',
      skills: ['React', 'TypeScript', 'Python', 'LLM Infrastructure', 'System Architecture'],
      description: 'OpenAI is looking for a Staff Software Engineer to build scalable frontend architectures and API platforms powering next-generation generative AI models.'
    },
    {
      id: 'job-2',
      title: 'Lead Full Stack Architect',
      company: 'Vercel',
      location: 'Remote (Global)',
      salary: '$195,000 - $245,000 / year',
      matchScore: 95,
      type: 'Full-time',
      experience: 'Senior Level',
      posted: '1 day ago',
      skills: ['Next.js', 'React 19', 'Node.js', 'Serverless', 'TailwindCSS'],
      description: 'Join Vercel to lead web architecture and developer tools supporting millions of frontend applications worldwide.'
    },
    {
      id: 'job-3',
      title: 'Senior AI Engineer & Full Stack',
      company: 'Anthropic',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$210,000 - $275,000 / year',
      matchScore: 92,
      type: 'Full-time',
      experience: '5+ Years',
      posted: '3 days ago',
      skills: ['Python', 'React', 'FastAPI', 'PyTorch', 'TypeScript'],
      description: 'Work alongside frontier AI researchers to build user-facing applications and evaluation harnesses for Claude.'
    },
    {
      id: 'job-4',
      title: 'Principal Software Architect',
      company: 'Stripe',
      location: 'Seattle, WA (Remote)',
      salary: '$230,000 - $310,000 / year',
      matchScore: 89,
      type: 'Full-time',
      experience: '8+ Years',
      posted: '4 days ago',
      skills: ['Distributed Systems', 'Node.js', 'PostgreSQL', 'API Design'],
      description: 'Drive strategic architecture for Stripe payment APIs and financial platform infrastructure globally.'
    }
  ];

  const handleToggleSave = (id) => {
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter(jId => jId !== id));
    } else {
      setSavedJobIds([...savedJobIds, id]);
    }
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
          <h2><HiOutlineBriefcase className="icon-briefcase" /> AI Job Recommendations</h2>
          <p>Hand-picked career opportunities matched against your resume skills and experience profile.</p>
        </div>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="job-filters-bar">
        <div className="search-input-box">
          <HiOutlineMagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title, company, or skill..."
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
            🌐 Remote Only
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
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card-wrapper fade-in">
              <div className="job-card-header">
                <div className="company-logo-avatar">
                  <HiOutlineBuildingOffice2 />
                </div>
                <div className="job-title-group">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company} • <span className="posted-time">{job.posted}</span></p>
                </div>

                <div className="match-badge-pill">
                  <HiOutlineSparkles /> {job.matchScore}% Match
                </div>
              </div>

              <div className="job-details-pills">
                <span><HiOutlineMapPin /> {job.location}</span>
                <span><HiOutlineCurrencyDollar /> {job.salary}</span>
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
                  className="primary-action-btn view-job-btn"
                  onClick={() => setActiveJobModal(job)}
                >
                  View Details & Tailor Resume <HiOutlineArrowUpRight />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Job Details & Tailoring */}
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

              <h4>Salary Range</h4>
              <p className="highlight-text">{activeJobModal.salary}</p>

              <h4>Matched Skills in Your Profile</h4>
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
                className="primary-action-btn"
                onClick={() => {
                  alert(`Tailoring active resume for ${activeJobModal.company}...`);
                  setActiveJobModal(null);
                }}
              >
                Tailor Resume For This Job Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
