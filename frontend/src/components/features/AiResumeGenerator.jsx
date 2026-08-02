import React, { useState } from 'react';
import { apiService } from '../../services/api';
import {
  HiOutlineSparkles,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowPath,
  HiOutlineBriefcase,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineLightBulb
} from 'react-icons/hi2';
import './AiResumeGenerator.css';

const AiResumeGenerator = () => {
  const [activeSubTab, setActiveSubTab] = useState('bullet'); // 'bullet', 'summary', 'tailor'
  const [bulletInput, setBulletInput] = useState('Responsible for writing React code and maintaining backend APIs.');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBullets, setGeneratedBullets] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Summary Generator state
  const [summaryRole, setSummaryRole] = useState('Senior Full Stack & AI Engineer');
  const [experienceYears, setExperienceYears] = useState('5+ years');
  const [keySkillsInput, setKeySkillsInput] = useState('React, Node.js, Python, TypeScript, System Architecture');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Job Description Matcher state
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredResult, setTailoredResult] = useState(null);
  const [isTailoring, setIsTailoring] = useState(false);

  const handleGenerateBullets = async () => {
    if (!bulletInput.trim()) return;
    setIsGenerating(true);
    const bullets = await apiService.enhanceBulletPoint(bulletInput, targetRole);
    setGeneratedBullets(bullets);
    setIsGenerating(false);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const summary = await apiService.generateExecutiveSummary(summaryRole, experienceYears, keySkillsInput);
    setGeneratedSummary(summary);
    setIsGeneratingSummary(false);
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    const result = await apiService.scanAtsCompatibility(bulletInput, jobDescription);
    setTailoredResult({
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      atsCompatibility: result.overallScore,
      tailoredBullets: [
        'Implemented containerized CI/CD workflows and REST API microservices matching cloud performance specifications.',
        'Developed responsive React components with strict TypeScript type safety, enhancing application maintainability.'
      ]
    });
    setIsTailoring(false);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="ai-generator-container fade-in">
      <div className="view-header">
        <div>
          <h2><HiOutlineSparkles className="icon-gradient" /> AI Resume Studio & Generator</h2>
          <p>Supercharge your resume bullet points, executive summary, and target job matching using AI.</p>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="ai-tabs">
        <button
          className={`ai-tab-btn ${activeSubTab === 'bullet' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bullet')}
        >
          <HiOutlineSparkles /> Bullet Point Enhancer
        </button>
        <button
          className={`ai-tab-btn ${activeSubTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('summary')}
        >
          <HiOutlineDocumentText /> Executive Summary AI
        </button>
        <button
          className={`ai-tab-btn ${activeSubTab === 'tailor' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('tailor')}
        >
          <HiOutlineBriefcase /> Job Description Matcher
        </button>
      </div>

      {/* TAB 1: Bullet Point Enhancer */}
      {activeSubTab === 'bullet' && (
        <div className="ai-tab-content grid-layout">
          <div className="ai-card input-card">
            <h3><HiOutlineAdjustmentsHorizontal /> Input Draft Experience</h3>
            <p className="card-subtitle">Paste a rough draft of your responsibilities or achievements.</p>

            <div className="form-group">
              <label>Target Role Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
              />
            </div>

            <div className="form-group">
              <label>Original Bullet Point / Draft Text</label>
              <textarea
                rows={4}
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                placeholder="e.g. Created web app pages and fixed bugs for clients."
              />
            </div>

            <button
              className="primary-action-btn ai-btn"
              onClick={handleGenerateBullets}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <HiOutlineArrowPath className="spinning" /> AI Rewriting...
                </>
              ) : (
                <>
                  <HiOutlineSparkles /> Polish Bullet Points
                </>
              )}
            </button>
          </div>

          <div className="ai-card output-card">
            <h3><HiOutlineLightBulb /> High-Impact AI Output</h3>
            <p className="card-subtitle">Quantified, action-packed variations optimized for recruiters.</p>

            {generatedBullets.length === 0 ? (
              <div className="empty-ai-state">
                <HiOutlineSparkles className="empty-icon" />
                <p>Click "Polish Bullet Points" to generate tailored, ATS-friendly variations.</p>
              </div>
            ) : (
              <div className="bullets-list">
                {generatedBullets.map((bullet, idx) => (
                  <div key={idx} className="bullet-option-card">
                    <div className="bullet-option-header">
                      <span className="bullet-badge">Option #{idx + 1} • High Impact</span>
                      <button
                        className="icon-btn-secondary"
                        onClick={() => handleCopy(bullet, idx)}
                      >
                        {copiedIndex === idx ? (
                          <><HiOutlineCheck className="success-icon" /> Copied!</>
                        ) : (
                          <><HiOutlineClipboardDocumentCheck /> Copy</>
                        )}
                      </button>
                    </div>
                    <p className="bullet-text">{bullet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Executive Summary AI */}
      {activeSubTab === 'summary' && (
        <div className="ai-tab-content grid-layout">
          <div className="ai-card input-card">
            <h3><HiOutlineDocumentText /> Executive Summary Generator</h3>
            <p className="card-subtitle">Generate a compelling 3-4 sentence professional summary.</p>

            <div className="form-group">
              <label>Target Role</label>
              <input
                type="text"
                value={summaryRole}
                onChange={(e) => setSummaryRole(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              >
                <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                <option value="5+ years">Senior Level (5+ yrs)</option>
                <option value="10+ years">Executive / Director (10+ yrs)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Key Technical Skills (comma separated)</label>
              <input
                type="text"
                value={keySkillsInput}
                onChange={(e) => setKeySkillsInput(e.target.value)}
              />
            </div>

            <button
              className="primary-action-btn ai-btn"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary ? (
                <>
                  <HiOutlineArrowPath className="spinning" /> Generating Summary...
                </>
              ) : (
                <>
                  <HiOutlineSparkles /> Generate Summary
                </>
              )}
            </button>
          </div>

          <div className="ai-card output-card">
            <h3><HiOutlineLightBulb /> Generated Professional Summary</h3>
            <p className="card-subtitle">Ready to paste directly into your resume template.</p>

            {!generatedSummary ? (
              <div className="empty-ai-state">
                <HiOutlineDocumentText className="empty-icon" />
                <p>Fill out parameters on the left to generate an executive summary.</p>
              </div>
            ) : (
              <div className="summary-result-box">
                <p className="summary-text">{generatedSummary}</p>
                <div className="summary-actions">
                  <button
                    className="primary-action-btn"
                    onClick={() => handleCopy(generatedSummary, 'summary')}
                  >
                    {copiedIndex === 'summary' ? (
                      <><HiOutlineCheck /> Summary Copied!</>
                    ) : (
                      <><HiOutlineClipboardDocumentCheck /> Copy to Clipboard</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Job Description Matcher */}
      {activeSubTab === 'tailor' && (
        <div className="ai-tab-content">
          <div className="ai-card full-card">
            <h3><HiOutlineBriefcase /> Target Job Description Matcher</h3>
            <p className="card-subtitle">Paste a target job posting below to get tailored bullet points and keyword gap insights.</p>

            <div className="form-group">
              <label>Paste Target Job Description</label>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. We are looking for a Senior Engineer proficient in React, Node.js, GraphQL, and AWS microservices..."
              />
            </div>

            <button
              className="primary-action-btn ai-btn"
              onClick={handleTailorResume}
              disabled={isTailoring || !jobDescription.trim()}
            >
              {isTailoring ? (
                <>
                  <HiOutlineArrowPath className="spinning" /> Analyzing Job Spec & Tailoring...
                </>
              ) : (
                <>
                  <HiOutlineSparkles /> Tailor My Resume For This Job
                </>
              )}
            </button>

            {tailoredResult && (
              <div className="tailor-results-container fade-in">
                <div className="tailor-score-card">
                  <div className="score-ring">
                    <span className="score-val">{tailoredResult.atsCompatibility}%</span>
                  </div>
                  <div>
                    <h4>ATS Match Alignment</h4>
                    <p>High match probability for target job description.</p>
                  </div>
                </div>

                <div className="keywords-grid">
                  <div className="kw-box matched">
                    <h4>Matched Keywords ({tailoredResult.matchedKeywords.length})</h4>
                    <div className="tags-wrapper">
                      {tailoredResult.matchedKeywords.map((kw, i) => (
                        <span key={i} className="kw-tag matched-tag">✓ {kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="kw-box missing">
                    <h4>Missing Keywords ({tailoredResult.missingKeywords.length})</h4>
                    <div className="tags-wrapper">
                      {tailoredResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="kw-tag missing-tag">+ {kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tailored-bullets-section">
                  <h4>Recommended Tailored Bullets:</h4>
                  {tailoredResult.tailoredBullets.map((tb, i) => (
                    <div key={i} className="bullet-option-card">
                      <p className="bullet-text">• {tb}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiResumeGenerator;
