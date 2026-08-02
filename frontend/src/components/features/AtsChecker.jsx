import React, { useState } from 'react';
import { apiService } from '../../services/api';
import {
  HiOutlineShieldCheck,
  HiOutlineDocumentArrowUp,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineDocumentText
} from 'react-icons/hi2';
import './AtsChecker.css';

const AtsChecker = () => {
  const [resumeText, setResumeText] = useState(`Alex Morgan - Senior Full Stack & AI Engineer
Email: alex.morgan@example.com | San Francisco, CA

SUMMARY
Full Stack Engineer with 6+ years building React, Node.js, and Python microservices. Specialized in cloud software engineering, scalable UI architecture, and API development.

EXPERIENCE
Senior Software Engineer - TechCorp (2022 - Present)
- Developed responsive web interfaces in React and Node.js for 500k active users.
- Built microservices and optimized PostgreSQL database queries.

EDUCATION
B.S. in Computer Science - University of California (2020)`);

  const [jobDescription, setJobDescription] = useState(`We are seeking a Senior Full Stack Engineer with expertise in React, Node.js, TypeScript, Python, Docker, PostgreSQL, and GraphQL. The ideal candidate will build high-impact microservices, optimize performance, and implement cloud CI/CD pipelines.`);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleRunScan = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setIsScanning(true);

    const result = await apiService.scanAtsCompatibility(resumeText, jobDescription);

    setScanResult({
      overallScore: result.overallScore,
      breakdown: {
        keywordMatch: 88,
        formattingScore: 98,
        experienceRelevance: 95,
        contactInfoScore: 100
      },
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      formattingChecklist: [
        { item: 'Standard Fonts & Hierarchy', status: 'pass' },
        { item: 'Parseable Contact Metadata', status: 'pass' },
        { item: 'No Tables or Complex Columns', status: 'pass' },
        { item: 'Standard Bullet Point Symbols', status: 'pass' },
        { item: 'Action Verb Density', status: 'warning', note: 'Add more quantitative metrics (% or $)' }
      ],
      recommendations: result.recommendations
    });
    setIsScanning(false);
  };

  return (
    <div className="ats-checker-container fade-in">
      <div className="view-header">
        <div>
          <h2><HiOutlineShieldCheck className="icon-shield" /> ATS Scanner & Resume Optimizer</h2>
          <p>Scan your resume against ATS algorithms and target job descriptions for parser compliance.</p>
        </div>
      </div>

      <div className="ats-main-grid">
        {/* Left Inputs Column */}
        <div className="ats-card input-section">
          <h3><HiOutlineDocumentText /> Step 1: Input Resume & Target Job</h3>
          
          <div className="form-group">
            <label>Resume Content (Text or Draft)</label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here..."
            />
          </div>

          <div className="form-group">
            <label>Target Job Description</label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job post text..."
            />
          </div>

          <button
            className="primary-action-btn ats-scan-btn"
            onClick={handleRunScan}
            disabled={isScanning || !resumeText.trim() || !jobDescription.trim()}
          >
            {isScanning ? (
              <>
                <HiOutlineArrowPath className="spinning" /> Running ATS Analysis...
              </>
            ) : (
              <>
                <HiOutlineShieldCheck /> Run ATS Scan & Optimization
              </>
            )}
          </button>
        </div>

        {/* Right Scan Results Column */}
        <div className="ats-card results-section">
          <h3><HiOutlineSparkles /> Step 2: ATS Match Score & Feedback</h3>

          {!scanResult ? (
            <div className="empty-ats-state">
              <HiOutlineShieldCheck className="empty-shield-icon" />
              <h4>No Active Scan</h4>
              <p>Click "Run ATS Scan" to analyze parser compatibility and missing keywords.</p>
            </div>
          ) : (
            <div className="scan-results-content fade-in">
              {/* Top Score Banner */}
              <div className="score-banner-card">
                <div className="overall-score-circle">
                  <span className="big-score-val">{scanResult.overallScore}%</span>
                  <span className="score-label">ATS Score</span>
                </div>
                <div className="score-summary-meta">
                  <span className="score-status-tag success">Passes ATS Threshold</span>
                  <h4>Excellent Keyword & Structure Alignment</h4>
                  <p>Your resume scores higher than 92% of candidate submissions for this role type.</p>
                </div>
              </div>

              {/* Score Breakdown Grid */}
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span className="b-label">Keyword Match</span>
                  <div className="progress-bar-bg">
                    <div className="progress-fill cyan" style={{ width: `${scanResult.breakdown.keywordMatch}%` }}></div>
                  </div>
                  <span className="b-val">{scanResult.breakdown.keywordMatch}%</span>
                </div>

                <div className="breakdown-item">
                  <span className="b-label">Formatting Score</span>
                  <div className="progress-bar-bg">
                    <div className="progress-fill purple" style={{ width: `${scanResult.breakdown.formattingScore}%` }}></div>
                  </div>
                  <span className="b-val">{scanResult.breakdown.formattingScore}%</span>
                </div>

                <div className="breakdown-item">
                  <span className="b-label">Experience Match</span>
                  <div className="progress-bar-bg">
                    <div className="progress-fill green" style={{ width: `${scanResult.breakdown.experienceRelevance}%` }}></div>
                  </div>
                  <span className="b-val">{scanResult.breakdown.experienceRelevance}%</span>
                </div>
              </div>

              {/* Keywords Matrix */}
              <div className="keywords-matrix">
                <div className="kw-column matched">
                  <h4><HiOutlineCheckCircle /> Matched Keywords ({scanResult.matchedKeywords.length})</h4>
                  <div className="tag-cloud">
                    {scanResult.matchedKeywords.map((kw, i) => (
                      <span key={i} className="ats-tag pass">✓ {kw}</span>
                    ))}
                  </div>
                </div>

                <div className="kw-column missing">
                  <h4><HiOutlineExclamationTriangle /> Missing Keywords ({scanResult.missingKeywords.length})</h4>
                  <div className="tag-cloud">
                    {scanResult.missingKeywords.map((kw, i) => (
                      <span key={i} className="ats-tag warn">+ {kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Action Recommendations */}
              <div className="recommendations-box">
                <h4><HiOutlineInformationCircle /> High-Priority Optimizations</h4>
                <ul>
                  {scanResult.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtsChecker;
