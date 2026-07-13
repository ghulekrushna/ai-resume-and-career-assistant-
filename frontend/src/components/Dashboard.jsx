import React, { useState, useEffect } from 'react';
import modernProfessional from '../assets/resume-templates/modern-professional.svg';
import atsFriendly from '../assets/resume-templates/ats-friendly.svg';
import minimal from '../assets/resume-templates/minimal.svg';
import creative from '../assets/resume-templates/creative.svg';
import executive from '../assets/resume-templates/executive.svg';
import studentEntryLevel from '../assets/resume-templates/student-entry-level.svg';
import techLead from '../assets/resume-templates/tech-lead.svg';
import dataScientist from '../assets/resume-templates/data-scientist.svg';
import marketing from '../assets/resume-templates/marketing.svg';
import sales from '../assets/resume-templates/sales.svg';

/**
 * Dashboard Component
 * The central workspace for logged-in users. Features include:
 * - Overview tab with career scorecard & achievements.
 * - Create Resume tab with a template chooser & dynamic AI-suggested fields editor.
 * - Job Match Analyzer with description parser.
 * - STAR Method AI Mock Interview simulator.
 * - Interactive AI Learning Roadmap tracker.
 * - Interactive Career Analytics graphs.
 * - Integrated AI Chat Copilot panel.
 */
export default function Dashboard({ user, onLogout, theme, toggleTheme }) {
  
  // ==========================================
  // 1. APPLICATION & UI STATE HOOKS
  // ==========================================
  const [activeTab, setActiveTab] = useState('overview');          // Current active workspace tab
  const [atsScore, setAtsScore] = useState(74);                    // Current resume score out of 100
  const [completionPercent, setCompletionPercent] = useState(80);  // Profile completion status
  const [matchPercent, setMatchPercent] = useState(0);              // ATS Job Match score percentage
  const [jobDescription, setJobDescription] = useState('');        // Job description target string
  const [isAnalyzing, setIsAnalyzing] = useState(false);            // Loading state for ATS analyzer
  const [showMatchResult, setShowMatchResult] = useState(false);    // Toggle ATS score view
  const [toasts, setToasts] = useState([]);                        // Notification toast items array
  
  // ==========================================
  // 2. RESUME DRAFT DATA
  // ==========================================
  const [resumeText, setResumeText] = useState({
    summary: 'Enthusiastic Software Engineer with 2 years of experience building web applications. Skilled in HTML, CSS, JavaScript, and React.',
    experience: 'Software Engineer at WebTech Solutions (2024-Present). Developed user interfaces and optimized site performance by 15%. Worked closely with designers and product managers.',
    skills: 'React, JavaScript, HTML5, CSS3, Git, REST APIs',
    projects: 'Personal Portfolio Website, Weather App using React'
  });

  // ==========================================
  // 3. EDITOR & CUSTOMIZER STATE
  // ==========================================
  const [selectedTemplate, setSelectedTemplate] = useState(null);  // Selected active template
  const [previewTemplate, setPreviewTemplate] = useState(null);    // Template modal preview trigger
  const [activeSuggestionsField, setActiveSuggestionsField] = useState(null); // Highlighting active input fields
  const [aiSuggestionsLog, setAiSuggestionsLog] = useState('');    // AI optimization feedback logs

  // ==========================================
  // 4. MOCK INTERVIEW SIMULATOR STATE
  // ==========================================
  const [interviewStarted, setInterviewStarted] = useState(false);  // Interview simulation trigger
  const [interviewType, setInterviewType] = useState('technical');  // Technical vs. Behavioral
  const [interviewStep, setInterviewStep] = useState(0);            // Question index counter
  const [userAnswers, setUserAnswers] = useState(['', '', '']);      // Answer repository
  const [currentAnswer, setCurrentAnswer] = useState('');          // Buffer for typing active answer
  const [interviewReport, setInterviewReport] = useState(null);      // Evaluation results object

  // ==========================================
  // 5. COPILOT AI CHATBOT STATE
  // ==========================================
  const [botOpen, setBotOpen] = useState(false);                    // Copilot drawer toggle
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: `Hi ${user?.name || user?.username || 'there'}! I'm your AI Career Assistant. How can I help you accelerate your career today?` }
  ]);
  const [chatInput, setChatInput] = useState('');                  // Message input field string
  const [isBotTyping, setIsBotTyping] = useState(false);            // Simulated typing spinner toggle

  // ==========================================
  // 6. UTILITY FUNCTIONS & TOASTS
  // ==========================================
  
  // Displays temporary alert messages on the top-right corner
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper to extract initials for user profile avatar icons
  const getInitials = (user) => {
    if (!user) return 'US';
    if (user.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user.username) return user.username.slice(0, 2).toUpperCase();
    return 'US';
  };

  // ==========================================
  // 7. CORE AI LOGIC HANDLERS
  // ==========================================

  // 7a. Dynamic Resume Improvement Handler (Simulates LLM suggestion & rewrites)
  const handleImproveWithAI = (field, suggestionType) => {
    addToast('Analyzing resume with AI...', 'info');
    setTimeout(() => {
      let improvement = '';
      if (field === 'summary') {
        improvement = '🚀 Stated-of-the-art summary optimized:\n"Senior-leaning Full Stack Engineer specializing in React ecosystem and performant interface development. Proven track record of scaling user engagement by 25% and cutting load times using modern Server-Side Render architectures."';
        setResumeText(prev => ({ ...prev, summary: 'Senior-leaning Full Stack Engineer specializing in React ecosystem and performant interface development. Proven track record of scaling user engagement by 25% and cutting load times using modern Server-Side Render architectures.' }));
      } else if (field === 'experience') {
        improvement = '🔥 Experience bullet-points rewritten for impact:\n"• Engineered responsive user interfaces using React and optimized bundles, reducing page load latency by 25%.\n• Collaborated closely in cross-functional agile teams of developers, designers, and PMs to implement scalable design systems."';
        setResumeText(prev => ({ ...prev, experience: 'Engineered responsive user interfaces using React and optimized bundles, reducing page load latency by 25%. Collaborated closely in cross-functional agile teams of developers, designers, and PMs to implement scalable design systems.' }));
      } else if (field === 'skills') {
        improvement = '💡 Added high-value ATS keywords: Node.js, Next.js, Redux Toolkit, TypeScript, Webpack, Responsive Design.';
        setResumeText(prev => ({ ...prev, skills: prev.skills + ', Next.js, TypeScript, Node.js, Redux Toolkit' }));
      } else if (field === 'projects') {
        improvement = '🌟 Added new AI Project suggestion:\n"AI Resume & Career Coach Dashboard: Built a responsive SaaS dashboard using React, customized CSS variables for dark/light themes, and custom SVGs. Achieved 100% build validity."';
        setResumeText(prev => ({ ...prev, projects: prev.projects + '\n• AI Resume & Career Coach Dashboard: Built a responsive SaaS dashboard using React with customized light/dark CSS variables.' }));
      }

      setAiSuggestionsLog(improvement);
      setAtsScore(prev => Math.min(prev + 8, 100));
      setCompletionPercent(prev => Math.min(prev + 5, 100));
      addToast('Resume improved with AI!', 'success');
    }, 1200);
  };

  // 7b. Job Match Description Parser Handler
  const handleAnalyzeJobDescription = (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      addToast('Please enter a Job Description', 'error');
      return;
    }
    setIsAnalyzing(true);
    setShowMatchResult(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowMatchResult(true);
      setMatchPercent(86);
      addToast('Job description analysis complete!', 'success');
    }, 1500);
  };

  // 7c. Key-Word Injector & Optimizer (Increases ATS score match)
  const handleOptimizeResumeForJob = () => {
    addToast('Injecting missing keywords...', 'info');
    setTimeout(() => {
      setAtsScore(95);
      setCompletionPercent(100);
      setMatchPercent(98);
      setResumeText(prev => ({
        ...prev,
        skills: prev.skills + ', Next.js, CI/CD, AWS, System Design'
      }));
      addToast('Resume optimized successfully! Match rate is now 98%!', 'success');
    }, 1500);
  };

  // ==========================================
  // 8. MOCK INTERVIEW SIMULATOR QUESTION POOL
  // ==========================================
  const interviewQuestions = {
    technical: [
      "Explain the difference between Virtual DOM and Real DOM in React.",
      "How do you optimize page rendering speed in a high-traffic web application?",
      "What is your strategy for state management when scaling a React codebase?"
    ],
    hr: [
      "Tell me about a time you handled a severe conflict inside a development team.",
      "Where do you see yourself professionally in five years?",
      "Why are you interested in joining our company as a Software Engineer?"
    ],
    behavioral: [
      "Describe a situation where you had to quickly adapt to a brand-new technology framework.",
      "Tell me about a time you made a major development mistake. How did you fix it?",
      "How do you manage short deadlines and prioritize features under pressure?"
    ]
  };

  // 8a. Starts the Mock Interview evaluation flow
  const handleStartInterview = (type) => {
    setInterviewType(type);
    setInterviewStarted(true);
    setInterviewStep(0);
    setUserAnswers(['', '', '']);
    setCurrentAnswer('');
    setInterviewReport(null);
    addToast(`Starting ${type} Mock Interview...`, 'info');
  };

  // 8b. Handles step progression / final evaluation report compiling
  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    const updated = [...userAnswers];
    updated[interviewStep] = currentAnswer;
    setUserAnswers(updated);

    if (interviewStep < 2) {
      setInterviewStep(prev => prev + 1);
      setCurrentAnswer('');
      addToast('Answer submitted. Next question loaded.', 'success');
    } else {
      // Evaluate results
      addToast('Evaluating responses with AI...', 'info');
      setTimeout(() => {
        setInterviewStarted(false);
        setInterviewReport({
          type: interviewType,
          confidenceScore: 92,
          communicationScore: 88,
          feedback: "Outstanding answers! You demonstrated deep familiarity with the ecosystem. Keep your project descriptions concise and structured using the STAR method (Situation, Task, Action, Result).",
          unlockedAchievement: true
        });
        addToast('Mock interview report generated!', 'success');
      }, 1800);
    }
  };

  // ==========================================
  // 9. COPILOT AI CHATBOT LOGIC
  // ==========================================
  const handleChatSubmit = (e, presetText = null) => {
    if (e) e.preventDefault();
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    // AI Simulated Reply
    setTimeout(() => {
      let replyText = "That is a great question. We recommend listing that on your experience section and highlighting measurable achievements (e.g. 'reduced latency by 20%').";
      const query = textToSend.toLowerCase();
      if (query.includes('project') || query.includes('suggest')) {
        replyText = "💡 **AI Suggested Projects:**\n1. *AI Resume & Career Coach Dashboard* with interactive React tabs and styled glassmorphic widgets.\n2. *ATS Keyword Parser Service* built with Node.js and python to score resume match rates.\n3. *Mock Interview STAR evaluation bot* using generative model feedback.";
      } else if (query.includes('summary')) {
        replyText = "✍️ **AI Summary Tip:**\nKeep your summary under 3 sentences. Highlight: your exact role title, years of experience, primary tech stack (e.g., React, Node), and 1 major achievement (e.g., 'improved SEO performance by 30%').";
      } else if (query.includes('salary') || query.includes('guidance')) {
        replyText = "💰 **AI Salary Guidance (Software Engineer):**\n- *Junior/Mid-level:* $85k - $125k based on location & equity options.\n- *Senior-level:* $140k - $210k+.\nFocus on mastering system design and cloud deployments to negotiate high-end bands.";
      } else if (query.includes('roadmap') || query.includes('learn')) {
        replyText = "🛣️ **AI Learning Path:**\n- Step 1: Intermediate JavaScript & Async Design.\n- Step 2: React State, Context, Hooks, and Next.js.\n- Step 3: CI/CD workflows, Docker containerization, and AWS hosting.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: replyText }]);
      setIsBotTyping(false);
    }, 1500);
  };

  // Preset Template Database
  const templates = [
    { id: 'software-engineer', name: 'Software Engineer', category: 'Product / Systems', rating: 'Popular', image: modernProfessional },
    { id: 'web-developer', name: 'Web Developer', category: 'Frontend / React', rating: 'Recommended', image: atsFriendly },
    { id: 'frontend-developer', name: 'Frontend Developer', category: 'UI / JavaScript', rating: 'Clean', image: minimal },
    { id: 'uiux-developer', name: 'UI/UX Developer', category: 'Design Systems', rating: 'Modern', image: creative },
    { id: 'backend-developer', name: 'Backend Developer', category: 'APIs / Node.js', rating: 'Senior', image: executive },
    { id: 'fullstack-developer', name: 'Full Stack Developer', category: 'End-to-End Products', rating: 'Modern', image: studentEntryLevel },
    { id: 'mobile-developer', name: 'Mobile App Developer', category: 'iOS / Android', rating: 'Trending', image: techLead },
    { id: 'data-engineer', name: 'Data Engineer', category: 'Python / SQL', rating: 'Growing', image: dataScientist },
    { id: 'devops-engineer', name: 'DevOps Engineer', category: 'Cloud / CI-CD', rating: 'High Demand', image: marketing },
    { id: 'product-manager', name: 'Product Manager', category: 'Strategy / Delivery', rating: 'Leadership', image: sales }
  ];

  const applyTemplateContent = (templateId) => {
    const presetContent = {
      'software-engineer': {
        summary: 'Software Engineer with strong experience building scalable web products and modern user interfaces using React, JavaScript, and Node.js.',
        experience: 'Software Engineer at Productive Labs (2023-Present). Built features for a SaaS dashboard used by 10k+ customers and improved release speed through CI/CD automation.',
        skills: 'React, JavaScript, TypeScript, Node.js, REST APIs, Git, AWS',
        projects: 'SaaS Analytics Dashboard • Built a responsive React platform with real-time reporting and dark/light theme support.'
      },
      'web-developer': {
        summary: 'Web Developer focused on converting product ideas into polished, responsive websites and web apps using HTML, CSS, and modern JavaScript frameworks.',
        experience: 'Web Developer at BrightPixel Studio (2022-Present). Developed marketing sites and client portals with strong SEO and accessibility practices.',
        skills: 'HTML5, CSS3, JavaScript, React, Tailwind CSS, Figma, SEO',
        projects: 'E-commerce Landing Page • Rebuilt the site experience to increase conversions by 18%.'
      },
      'frontend-developer': {
        summary: 'Frontend Developer specializing in interactive interfaces, design systems, and fast-loading React applications.',
        experience: 'Frontend Developer at Nova UI (2021-Present). Built reusable components and design tokens for a multi-brand product suite.',
        skills: 'React, Redux, SCSS, Accessibility, Performance Optimization, Jest',
        projects: 'Design System Library • Created shared UI components adopted across three product teams.'
      },
      'uiux-developer': {
        summary: 'UI/UX Developer blending front-end engineering with thoughtful interface design and accessible user flows.',
        experience: 'UI/UX Developer at Studio North (2022-Present). Designed and implemented polished user experiences for B2B dashboards and mobile products.',
        skills: 'Figma, React, CSS, Animation, UX Research, Wireframing',
        projects: 'Dashboard Redesign • Improved onboarding completion by 22% with clearer interactions and smoother navigation.'
      },
      'backend-developer': {
        summary: 'Backend Developer experienced in building reliable APIs, data services, and scalable server-side logic for modern applications.',
        experience: 'Backend Developer at DataFlow Systems (2022-Present). Designed RESTful services and optimized database queries for high-volume traffic.',
        skills: 'Node.js, Express, MongoDB, PostgreSQL, Docker, Redis',
        projects: 'Order Management API • Built a resilient backend service supporting 100k+ requests per day.'
      },
      'fullstack-developer': {
        summary: 'Full Stack Developer with end-to-end experience from database design and API development to polished front-end delivery.',
        experience: 'Full Stack Developer at BuildSphere (2023-Present). Delivered customer-facing features across both backend services and React interfaces.',
        skills: 'React, Node.js, PostgreSQL, REST APIs, GraphQL, CI/CD',
        projects: 'Project Collaboration App • Built a full-stack workspace app with real-time updates and role-based access.'
      },
      'mobile-developer': {
        summary: 'Mobile App Developer creating performant, user-focused apps for iOS and Android with a strong emphasis on modern UI patterns.',
        experience: 'Mobile App Developer at AppForge (2022-Present). Released cross-platform apps with smooth animations and offline-ready experiences.',
        skills: 'React Native, Swift, Kotlin, Firebase, Mobile UI, App Store Optimization',
        projects: 'Fitness Tracker App • Launched a mobile app with push notifications and personalized plans.'
      },
      'data-engineer': {
        summary: 'Data Engineer focused on building reliable data pipelines, warehouse workflows, and analytics-ready systems for business intelligence teams.',
        experience: 'Data Engineer at Insight Labs (2022-Present). Built ETL pipelines and improved data quality for reporting at scale.',
        skills: 'Python, SQL, Airflow, Spark, ETL, Data Warehousing',
        projects: 'Sales Data Pipeline • Automated data ingestion and reduced reporting delays by 40%.'
      },
      'devops-engineer': {
        summary: 'DevOps Engineer specializing in deployment automation, cloud infrastructure, and reliable delivery practices for production systems.',
        experience: 'DevOps Engineer at CloudWorks (2023-Present). Automated infrastructure provisioning and improved deployment reliability across microservices.',
        skills: 'AWS, Docker, Kubernetes, CI/CD, Terraform, Linux',
        projects: 'Cloud Deployment Platform • Reduced deployment time from 45 minutes to 8 minutes with automation.'
      },
      'product-manager': {
        summary: 'Product Manager combining technical understanding with customer insight to lead product delivery and cross-functional execution.',
        experience: 'Product Manager at LayerOne Tech (2022-Present). Guided roadmap planning, stakeholder communication, and launch coordination for new features.',
        skills: 'Roadmapping, Analytics, Agile, User Research, Stakeholder Management',
        projects: 'Customer Onboarding Redesign • Shipped a simplified onboarding flow that improved activation rates by 25%.'
      }
    };

    const content = presetContent[templateId];
    if (content) {
      setResumeText(prev => ({ ...prev, ...content }));
    }
  };

  return (
    <div className="dashboard-layout animate-fade">
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} animate-fade`}>
            {toast.type === 'success' && '✓ '}
            {toast.type === 'info' && '🛈 '}
            {toast.type === 'error' && '✗ '}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Left Sidebar Navigation */}
      <aside className="db-sidebar">
        <div className="db-sidebar-header">
          <div className="landing-logo">✧</div>
          <span className="landing-brand-name">ResuAI Coach</span>
        </div>

        {/* Left Sidebar Menu Items */}
        <nav className="db-nav">
          <button className={`db-nav-item ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => { setActiveTab('templates'); setSelectedTemplate(null); }}>
            <span className="db-nav-icon">📄</span> Create Resume
          </button>
          <button className={`db-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span className="db-nav-icon">📊</span> Overview
          </button>
          <button className={`db-nav-item ${activeTab === 'jobmatch' ? 'active' : ''}`} onClick={() => setActiveTab('jobmatch')}>
            <span className="db-nav-icon">🎯</span> Job Match Analyzer
          </button>
          <button className={`db-nav-item ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => setActiveTab('interviews')}>
            <span className="db-nav-icon">🎤</span> Mock Interview
          </button>
          <button className={`db-nav-item ${activeTab === 'roadmaps' ? 'active' : ''}`} onClick={() => setActiveTab('roadmaps')}>
            <span className="db-nav-icon">🛣</span> Learning Roadmap
          </button>
          <button className={`db-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <span className="db-nav-icon">📈</span> Career Analytics
          </button>
        </nav>

        {/* Sidebar Footer (Profile Info & Theme/Logout Controls) */}
        <div className="db-sidebar-footer">
          <div className="db-user-profile">
            <div className="avatar" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
              {getInitials(user)}
            </div>
            <div className="db-user-info">
              <span className="db-user-name">{user?.name || user?.username || 'User'}</span>
              <span className="db-user-role">Premium Member</span>
            </div>
          </div>
          <div className="db-sidebar-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'inherit' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="db-logout-btn" onClick={onLogout} title="Log Out">
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Display Content */}
      <main className="db-content">
        
        {/* Workspace Top Header (Displays Active Tab Title & Date) */}
        <header className="db-content-header">
          <h1 className="db-content-title">
            {activeTab === 'overview' && "Dashboard Overview"}
            {activeTab === 'templates' && "Create Resume & Editor"}
            {activeTab === 'jobmatch' && "Job Match Analyzer"}
            {activeTab === 'interviews' && "AI Mock Interview Prep"}
            {activeTab === 'roadmaps' && "Your AI Learning Roadmap"}
            {activeTab === 'analytics' && "Detailed Career Analytics"}
          </h1>
          <span className="db-header-date">Local: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </header>

        {/* ==========================================
            TAB VIEW SWITCHER PANELS
            ========================================== */}

        {/* TAB 1: OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="db-tab-panel animate-fade">
            {/* Top Stats Grid */}
            <div className="db-stats-grid">
              <div className="glass-card db-stat-card">
                <div className="stat-header">
                  <span className="stat-label">ATS Optimization Score</span>
                  <span className="stat-badge success">Excellent</span>
                </div>
                <div className="stat-main">
                  <span className="stat-value">{atsScore}%</span>
                  <span className="stat-trend positive">+12% this week</span>
                </div>
              </div>
              <div className="glass-card db-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Profile Strength</span>
                  <span className="stat-badge info">Level 3</span>
                </div>
                <div className="stat-main">
                  <span className="stat-value">{completionPercent}%</span>
                  <span className="stat-trend positive">5 milestones complete</span>
                </div>
              </div>
              <div className="glass-card db-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Job Match Rate</span>
                  <span className="stat-badge warning">Pending</span>
                </div>
                <div className="stat-main">
                  <span className="stat-value">{matchPercent > 0 ? `${matchPercent}%` : '--'}</span>
                  <span className="stat-trend">{matchPercent > 0 ? 'High relevance' : 'Upload description to scan'}</span>
                </div>
              </div>
              <div className="glass-card db-stat-card">
                <div className="stat-header">
                  <span className="stat-label">Applications Sent</span>
                  <span className="stat-badge">Active</span>
                </div>
                <div className="stat-main">
                  <span className="stat-value">12</span>
                  <span className="stat-trend positive">3 response rate</span>
                </div>
              </div>
            </div>

            {/* Circular score widget & Quick Actions Row */}
            <div className="db-double-column">
              {/* Score indicators */}
              <div className="glass-card flex-col-container">
                <h3>🔥 AI Resume Score Analytics</h3>
                <div className="gauge-row">
                  <div className="gauge-item">
                    <svg viewBox="0 0 100 100" className="progress-ring">
                      <circle cx="50" cy="50" r="40" className="progress-ring-bg"></circle>
                      <circle cx="50" cy="50" r="40" className="progress-ring-fill" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * atsScore) / 100} style={{ stroke: 'var(--primary)' }}></circle>
                    </svg>
                    <span className="gauge-val">{atsScore}%</span>
                    <span className="gauge-label">ATS Score</span>
                  </div>

                  <div className="gauge-item">
                    <svg viewBox="0 0 100 100" className="progress-ring">
                      <circle cx="50" cy="50" r="40" className="progress-ring-bg"></circle>
                      <circle cx="50" cy="50" r="40" className="progress-ring-fill" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * completionPercent) / 100} style={{ stroke: 'var(--secondary)' }}></circle>
                    </svg>
                    <span className="gauge-val">{completionPercent}%</span>
                    <span className="gauge-label">Completion</span>
                  </div>

                  <div className="gauge-item">
                    <svg viewBox="0 0 100 100" className="progress-ring">
                      <circle cx="50" cy="50" r="40" className="progress-ring-bg"></circle>
                      <circle cx="50" cy="50" r="40" className="progress-ring-fill" strokeDasharray="251.2" strokeDashoffset="37.6" style={{ stroke: '#10b981' }}></circle>
                    </svg>
                    <span className="gauge-val">85%</span>
                    <span className="gauge-label">Keywords</span>
                  </div>

                  <div className="gauge-item">
                    <svg viewBox="0 0 100 100" className="progress-ring">
                      <circle cx="50" cy="50" r="40" className="progress-ring-bg"></circle>
                      <circle cx="50" cy="50" r="40" className="progress-ring-fill" strokeDasharray="251.2" strokeDashoffset="50.2" style={{ stroke: '#f59e0b' }}></circle>
                    </svg>
                    <span className="gauge-val">80%</span>
                    <span className="gauge-label">Readability</span>
                  </div>
                </div>
              </div>

              {/* Quick actions panel */}
              <div className="glass-card">
                <h3>⚡ Quick Actions</h3>
                <div className="quick-actions-grid">
                  <button className="qa-btn" onClick={() => setActiveTab('templates')}>
                    <span className="qa-icon">📄</span> Create Resume
                  </button>
                  <button className="qa-btn" onClick={() => addToast('Upload resume trigger mocked', 'info')}>
                    <span className="qa-icon">📤</span> Upload Resume
                  </button>
                  <button className="qa-btn highlight" onClick={() => handleImproveWithAI('summary')}>
                    <span className="qa-icon">✨</span> Improve with AI
                  </button>
                  <button className="qa-btn" onClick={() => addToast('Cover letter generated and copied!', 'success')}>
                    <span className="qa-icon">✉️</span> Generate Cover Letter
                  </button>
                  <button className="qa-btn" onClick={() => addToast('Downloading resume PDF...', 'success')}>
                    <span className="qa-icon">⬇️</span> Download PDF
                  </button>
                  <button className="qa-btn" onClick={() => addToast('Resume public link copied to clipboard!', 'success')}>
                    <span className="qa-icon">🔗</span> Share Resume
                  </button>
                  <button className="qa-btn" onClick={() => addToast('Portfolio site generated!', 'success')}>
                    <span className="qa-icon">💼</span> Create Portfolio
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements & Activities */}
            <div className="db-double-column" style={{ marginTop: '24px' }}>
              {/* Achievement system */}
              <div className="glass-card flex-col-container">
                <h3>🏆 Achievements & Rewards</h3>
                <div className="achievements-grid">
                  <div className="achievement-card unlocked">
                    <span className="ach-badge">✨</span>
                    <div className="ach-info">
                      <strong className="ach-title">First Resume Created</strong>
                      <span className="ach-desc">Drafted your initial template profile.</span>
                    </div>
                  </div>
                  <div className="achievement-card unlocked">
                    <span className="ach-badge">🎯</span>
                    <div className="ach-info">
                      <strong className="ach-title">Profile 100% Complete</strong>
                      <span className="ach-desc">Filled all skill fields & details.</span>
                    </div>
                  </div>
                  <div className={`achievement-card ${atsScore >= 90 ? 'unlocked' : 'locked'}`}>
                    <span className="ach-badge">💯</span>
                    <div className="ach-info">
                      <strong className="ach-title">ATS Score 90+</strong>
                      <span className="ach-desc">Optimize resume keyword match metrics.</span>
                    </div>
                    {atsScore < 90 && <span className="ach-status">Locked</span>}
                  </div>
                  <div className={`achievement-card ${interviewReport ? 'unlocked' : 'locked'}`}>
                    <span className="ach-badge">🎤</span>
                    <div className="ach-info">
                      <strong className="ach-title">Interview Ready</strong>
                      <span className="ach-desc">Complete your first mock session.</span>
                    </div>
                    {!interviewReport && <span className="ach-status">Locked</span>}
                  </div>
                </div>
              </div>

              {/* Recent activities */}
              <div className="glass-card">
                <h3>📋 Recent Activities</h3>
                <div className="activities-list">
                  <div className="act-item">
                    <span className="act-dot green"></span>
                    <div className="act-details">
                      <strong>Modern Professional Resume Draft</strong>
                      <span>Edited 12 minutes ago • ATS score 74%</span>
                    </div>
                  </div>
                  {interviewReport && (
                    <div className="act-item">
                      <span className="act-dot purple"></span>
                      <div className="act-details">
                        <strong>Mock Interview Completed</strong>
                        <span>Type: {interviewReport.type} • Score: {interviewReport.confidenceScore}%</span>
                      </div>
                    </div>
                  )}
                  {showMatchResult && (
                    <div className="act-item">
                      <span className="act-dot cyan"></span>
                      <div className="act-details">
                        <strong>Job Scan Match Scored</strong>
                        <span>Analyzed match rate: {matchPercent}%</span>
                      </div>
                    </div>
                  )}
                  <div className="act-item">
                    <span className="act-dot yellow"></span>
                    <div className="act-details">
                      <strong>AI Recommendations Scan</strong>
                      <span>Discovered 3 grammar gaps & 2 missing certifications.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: CREATE RESUME PANEL
            ========================================== */}
        {activeTab === 'templates' && (
          <div className="db-tab-panel animate-fade">
            {!selectedTemplate ? (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Choose a role-based template for software, web development, backend, data, and more. We will tailor the draft to match your selected path.</p>
                <div className="templates-grid">
                  {templates.map(tpl => (
                    <div key={tpl.id} className="glass-card tpl-card">
                      <div className="tpl-card-header">
                        <span className="tpl-badge">{tpl.rating}</span>
                        <span className="tpl-category">{tpl.category}</span>
                      </div>
                      <div className="tpl-preview-box">
                        <img src={tpl.image} alt={`${tpl.name} preview`} className="tpl-preview-image" />
                      </div>
                      <div className="tpl-card-footer">
                        <h4>{tpl.name}</h4>
                        <div className="tpl-actions">
                          <button className="tpl-btn-sec" onClick={() => setPreviewTemplate(tpl)}>Preview</button>
                          <button className="tpl-btn-pri" onClick={() => { setSelectedTemplate(tpl); applyTemplateContent(tpl.id); }}>Use Template</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* More Options Card */}
                  <div className="glass-card tpl-card more-templates-card" onClick={() => addToast('More premium templates will be loaded! Access 50+ templates.', 'info')}>
                    <div className="more-templates-icon">＋</div>
                    <h4 style={{ color: 'var(--primary)', fontWeight: '600' }}>More Options</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                      Unlock 50+ premium designs, custom layout generators & custom imports.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // Active Template Customizer & Editor
              <div className="editor-container animate-fade">
                <div className="editor-back-header">
                  <button className="editor-back-btn" onClick={() => setSelectedTemplate(null)}>
                    &larr; Back to Templates
                  </button>
                  <span className="editor-title">Editing: <strong>{selectedTemplate.name}</strong></span>
                </div>

                <div className="editor-split-grid">
                  {/* Left Resume Editable Fields */}
                  <div className="editor-form-panel glass-card">
                    <h3>Resume Draft Fields</h3>
                    <div className="form-group" style={{ marginTop: '15px' }}>
                      <div className="editor-field-header">
                        <label className="form-label">Professional Summary</label>
                        <button className="editor-ai-hint" onClick={() => { setActiveSuggestionsField('summary'); handleImproveWithAI('summary'); }}>
                          ✨ Rewrite summary
                        </button>
                      </div>
                      <textarea 
                        className="form-control" 
                        style={{ height: '110px', resize: 'vertical' }}
                        value={resumeText.summary} 
                        onChange={(e) => setResumeText({ ...resumeText, summary: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <div className="editor-field-header">
                        <label className="form-label">Work Experience</label>
                        <button className="editor-ai-hint" onClick={() => { setActiveSuggestionsField('experience'); handleImproveWithAI('experience'); }}>
                          ✨ Improve phrasing
                        </button>
                      </div>
                      <textarea 
                        className="form-control" 
                        style={{ height: '120px', resize: 'vertical' }}
                        value={resumeText.experience} 
                        onChange={(e) => setResumeText({ ...resumeText, experience: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <div className="editor-field-header">
                        <label className="form-label">Technical Skills</label>
                        <button className="editor-ai-hint" onClick={() => { setActiveSuggestionsField('skills'); handleImproveWithAI('skills'); }}>
                          ✨ Suggest keywords
                        </button>
                      </div>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={resumeText.skills} 
                        onChange={(e) => setResumeText({ ...resumeText, skills: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <div className="editor-field-header">
                        <label className="form-label">Key Projects</label>
                        <button className="editor-ai-hint" onClick={() => { setActiveSuggestionsField('projects'); handleImproveWithAI('projects'); }}>
                          ✨ Inject project
                        </button>
                      </div>
                      <textarea 
                        className="form-control" 
                        style={{ height: '100px', resize: 'vertical' }}
                        value={resumeText.projects} 
                        onChange={(e) => setResumeText({ ...resumeText, projects: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Right Realtime AI Suggestions & Output */}
                  <div className="editor-suggestions-panel glass-card">
                    <h3>💡 AI Suggestions Pane</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Click any field's helper button to generate recommendations using our resume model.</p>
                    
                    <div className="suggestions-button-shelf" style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button className="sug-pill" onClick={() => handleImproveWithAI('summary')}>Improve Summary</button>
                      <button className="sug-pill" onClick={() => handleImproveWithAI('experience')}>Rewrite Experience</button>
                      <button className="sug-pill" onClick={() => handleImproveWithAI('skills')}>Add Missing Skills</button>
                      <button className="sug-pill" onClick={() => handleImproveWithAI('skills')}>Optimize Keywords</button>
                      <button className="sug-pill" onClick={() => addToast('Grammar check completed! Clear & correct.', 'success')}>Fix Grammar</button>
                      <button className="sug-pill" onClick={() => handleImproveWithAI('projects')}>Suggest Projects</button>
                      <button className="sug-pill" onClick={() => addToast('Generated new professional summary!', 'success')}>Generate Summary</button>
                      <button className="sug-pill" onClick={() => addToast('Added AWS & Certified Developer suggestions!', 'success')}>Suggest Certifications</button>
                    </div>

                    <div className="suggestions-output-box">
                      <strong>AI Suggestion Engine Output Log:</strong>
                      <pre className="suggestions-pre">
                        {aiSuggestionsLog || 'Select a field rewrite option to generate AI recommendations.'}
                      </pre>
                    </div>

                    <div className="sug-actions-row" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                      <button className="btn-primary" style={{ flexGrow: 1, justifyContent: 'center' }} onClick={() => addToast('Changes saved to cloud!', 'success')}>
                        Save Draft
                      </button>
                      <button className="tpl-btn-sec" style={{ width: 'auto' }} onClick={() => addToast('Exporting to PDF file format...', 'success')}>
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Template Modal Popup */}
            {previewTemplate && (
              <div className="modal-overlay" onClick={() => setPreviewTemplate(null)}>
                <div className="glass-card auth-modal-card tpl-preview-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="auth-close-btn" onClick={() => setPreviewTemplate(null)}>&times;</button>
                  <h2 style={{ marginBottom: '10px' }}>Preview: {previewTemplate.name}</h2>
                  <div className="tpl-modal-paper" style={{ padding: '24px', background: 'var(--bg-dark)', border: '1px solid var(--border-light)', borderRadius: '12px', minHeight: '300px' }}>
                    <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px' }}>
                      <h1 style={{ fontSize: '24px', margin: 0 }}>{user?.name || user?.username || 'John Doe'}</h1>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{previewTemplate.name} | {user?.username}@gmail.com | Portfolio Link</p>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '5px' }}>Summary</h4>
                      <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.5' }}>{resumeText.summary}</p>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <h4 style={{ textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '5px' }}>Experience</h4>
                      <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.5' }}>{resumeText.experience}</p>
                    </div>
                    <div>
                      <h4 style={{ textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '5px' }}>Technical Skills</h4>
                      <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.5' }}>{resumeText.skills}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="tpl-btn-sec" onClick={() => setPreviewTemplate(null)}>Close Preview</button>
                    <button className="btn-primary" onClick={() => { setSelectedTemplate(previewTemplate); setPreviewTemplate(null); }}>Use Template</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: JOB MATCH ANALYZER PANEL
            ========================================== */}
        {activeTab === 'jobmatch' && (
          <div className="db-tab-panel animate-fade">
            <div className="glass-card">
              <h3>🎯 Job Match & ATS Optimization Scan</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 20px 0' }}>Paste the target job description to match it against your current active resume draft. AI will automatically evaluate keywords and relevancy metrics.</p>

              <form onSubmit={handleAnalyzeJobDescription}>
                <div className="form-group">
                  <label className="form-label">Paste Job Description</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Require at least 2+ years of experience with React, Next.js, Redux, Node.js, and CI/CD tools. Solid understanding of system architecture and web performance optimizations..." 
                    style={{ height: '160px', resize: 'vertical' }}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={isAnalyzing}>
                  {isAnalyzing ? 'Scanning & Scoring...' : 'Analyze Match Rate'}
                </button>
              </form>
            </div>

            {/* Loading Skeleton */}
            {isAnalyzing && (
              <div className="skeleton-loading-container style-card" style={{ marginTop: '24px' }}>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line text"></div>
                <div className="skeleton-line text"></div>
                <div className="skeleton-line text"></div>
              </div>
            )}

            {/* Results display */}
            {showMatchResult && !isAnalyzing && (
              <div className="glass-card animate-fade" style={{ marginTop: '24px' }}>
                <div className="match-results-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Scan Results</h3>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Resume vs Job Description relevance details</span>
                  </div>
                  <div className="match-score-badge" style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '10px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>{matchPercent}%</div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Match Rate</div>
                  </div>
                </div>

                <div className="match-results-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Missing Keywords list */}
                  <div>
                    <h4 style={{ color: 'var(--accent)', marginBottom: '10px' }}>🚨 Missing Keywords ({atsScore >= 95 ? 0 : 4})</h4>
                    {atsScore >= 95 ? (
                      <div className="empty-state-message">All keywords match! Well optimized.</div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span className="keyword-chip red">Next.js</span>
                        <span className="keyword-chip red">Node.js</span>
                        <span className="keyword-chip red">CI/CD</span>
                        <span className="keyword-chip red">AWS</span>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 style={{ color: '#f59e0b', marginBottom: '10px' }}>💡 Recommended Improvements</h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li>Integrate missing framework terms (e.g. Next.js, AWS) into your technical skills section.</li>
                      <li>Refactor summary text to mention system design.</li>
                      <li>Quantify your performance optimization metrics in the experience section (e.g. "reduced latency by 15%").</li>
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Want to inject missing keywords and boost match score immediately?</span>
                  <button className="btn-primary" onClick={handleOptimizeResumeForJob}>
                    ⚡ One-Click Optimize Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 4: MOCK INTERVIEW SIMULATOR PANEL
            ========================================== */}
        {activeTab === 'interviews' && (
          <div className="db-tab-panel animate-fade">
            {!interviewStarted ? (
              // Setup Panel
              <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px' }}>
                <span style={{ fontSize: '48px' }}>🎙️</span>
                <h2 style={{ marginTop: '15px' }}>AI Mock Interview Simulations</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0 30px 0' }}>Practice technical, HR, and behavioral interview questions and get evaluated instantly by our career coach model.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  <button className={`tpl-btn-sec ${interviewType === 'technical' ? 'active' : ''}`} style={{ justifyContent: 'center' }} onClick={() => setInterviewType('technical')}>
                    💻 Technical Interview (React & JS Systems)
                  </button>
                  <button className={`tpl-btn-sec ${interviewType === 'hr' ? 'active' : ''}`} style={{ justifyContent: 'center' }} onClick={() => setInterviewType('hr')}>
                    👥 HR Interview (Culture & Fit)
                  </button>
                  <button className={`tpl-btn-sec ${interviewType === 'behavioral' ? 'active' : ''}`} style={{ justifyContent: 'center' }} onClick={() => setInterviewType('behavioral')}>
                    🧠 Behavioral Interview (STAR method scenarios)
                  </button>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleStartInterview(interviewType)}>
                  Start Interview Session &rarr;
                </button>

                {interviewReport && (
                  <div className="glass-card report-card" style={{ marginTop: '30px', textAlign: 'left' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Last Session Report ({interviewReport.type.toUpperCase()})</h3>
                    <div style={{ display: 'flex', gap: '20px', margin: '15px 0' }}>
                      <div className="score-widget">
                        <strong>{interviewReport.confidenceScore}%</strong>
                        <span>Confidence Score</span>
                      </div>
                      <div className="score-widget">
                        <strong>{interviewReport.communicationScore}%</strong>
                        <span>Communication Score</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{interviewReport.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              // Active Interview Chat Window
              <div className="glass-card interview-active-card animate-fade" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="interview-active-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Active Interview: {interviewType.toUpperCase()}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Evaluating STAR structure responses</span>
                  </div>
                  <span className="interview-badge">Question {interviewStep + 1} of 3</span>
                </div>

                <div className="interview-chat-bubble interviewer" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--primary)', borderRadius: '0 12px 12px 12px', marginBottom: '24px' }}>
                  <strong>AI Interviewer:</strong>
                  <p style={{ fontSize: '15px', marginTop: '6px', lineHeight: '1.5' }}>{interviewQuestions[interviewType][interviewStep]}</p>
                </div>

                <form onSubmit={handleSubmitAnswer}>
                  <div className="form-group">
                    <label className="form-label">Your Response</label>
                    <textarea 
                      className="form-control" 
                      placeholder="Type your response here..." 
                      style={{ height: '120px', resize: 'vertical' }}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="button" className="tpl-btn-sec" style={{ width: 'auto' }} onClick={() => setInterviewStarted(false)}>
                      Exit Session
                    </button>
                    <button type="submit" className="btn-primary">
                      {interviewStep === 2 ? 'Finish & Generate Report' : 'Submit & Next Question &rarr;'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 5: DYNAMIC LEARNING ROADMAP PANEL
            ========================================== */}
        {activeTab === 'roadmaps' && (
          <div className="db-tab-panel animate-fade">
            <div className="db-double-column">
              {/* Timeline Roadmap */}
              <div className="glass-card">
                <h3>🛣 AI-Generated Career Roadmap</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 25px 0' }}>Interactive timeline milestones tailored to full stack engineer career growth path.</p>

                <div className="timeline-container">
                  <div className="timeline-node">
                    <div className="node-marker active">1</div>
                    <div className="node-content">
                      <strong>React Hooks & Performance Optimization</strong>
                      <p>Learn bundle splitting, lazy loading, and useMemo configurations. (Current Focus)</p>
                    </div>
                  </div>
                  <div className="timeline-node">
                    <div className="node-marker">2</div>
                    <div className="node-content">
                      <strong>Next.js App Directory & RSC</strong>
                      <p>Master React Server Components, server actions, and metadata optimization.</p>
                    </div>
                  </div>
                  <div className="timeline-node">
                    <div className="node-marker">3</div>
                    <div className="node-content">
                      <strong>Advanced Node.js & Dockerization</strong>
                      <p>Design microservice layouts, REST endpoint optimizations, and Docker containers.</p>
                    </div>
                  </div>
                  <div className="timeline-node">
                    <div className="node-marker">4</div>
                    <div className="node-content">
                      <strong>Cloud Deployments (AWS/CI-CD)</strong>
                      <p>Architect auto-scaling VPCs, deploy S3 static hosts, and configure pipeline YAMLs.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course suggestions & Trending technologies */}
              <div className="flex-col-container" style={{ gap: '20px' }}>
                <div className="glass-card">
                  <h3>🔍 Skill Gap Analysis</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span>Frontend Engineering</span>
                        <span>80% Complete</span>
                      </div>
                      <div className="skill-meter-bg"><div className="skill-meter-fill" style={{ width: '80%', background: 'var(--secondary)' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span>Backend Design (Node/Express)</span>
                        <span>50% Complete</span>
                      </div>
                      <div className="skill-meter-bg"><div className="skill-meter-fill" style={{ width: '50%', background: 'var(--primary)' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span>DevOps & Infrastructure</span>
                        <span>20% Complete</span>
                      </div>
                      <div className="skill-meter-bg"><div className="skill-meter-fill" style={{ width: '20%', background: 'var(--accent)' }}></div></div>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3>📚 Recommended Learning Courses</h3>
                  <div className="course-list" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="course-item" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>Next.js 15: Production-Ready Masterclass</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Skill target: Server Components • 8h duration</div>
                    </div>
                    <div className="course-item" style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>AWS VPC & DevOps Infrastructure Pipelines</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Skill target: CI/CD, S3 Hosting • 12h duration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 6: CAREER ANALYTICS PANEL
            ========================================== */}
        {activeTab === 'analytics' && (
          <div className="db-tab-panel animate-fade">
            <div className="db-double-column">
              {/* Analytics bar charts */}
              <div className="glass-card">
                <h3>📈 Weekly Improvement Score Analytics</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 20px 0' }}>Tracking resume rating metrics and weekly mock sessions average.</p>
                <div className="chart-bar-container">
                  <div className="chart-bar-col">
                    <div className="chart-bar-fill" style={{ height: '60%' }}>
                      <span className="bar-hover-val">60%</span>
                    </div>
                    <span className="chart-label">Mon</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar-fill" style={{ height: '65%' }}>
                      <span className="bar-hover-val">65%</span>
                    </div>
                    <span className="chart-label">Tue</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar-fill" style={{ height: '70%' }}>
                      <span className="bar-hover-val">70%</span>
                    </div>
                    <span className="chart-label">Wed</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar-fill" style={{ height: `${atsScore}%` }}>
                      <span className="bar-hover-val">{atsScore}%</span>
                    </div>
                    <span className="chart-label">Thu</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar-fill" style={{ height: `${atsScore}%` }}>
                      <span className="bar-hover-val">{atsScore}%</span>
                    </div>
                    <span className="chart-label">Fri</span>
                  </div>
                  <div className="chart-bar-col">
                    <div className="chart-bar-fill" style={{ height: `${atsScore}%` }}>
                      <span className="bar-hover-val">{atsScore}%</span>
                    </div>
                    <span className="chart-label">Sat</span>
                  </div>
                </div>
              </div>

              {/* Sparkline stats */}
              <div className="flex-col-container" style={{ gap: '20px' }}>
                <div className="glass-card">
                  <h3>📊 Application Funnel Metrics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '13px' }}>Applications Sent</span>
                      <strong style={{ color: 'var(--primary)' }}>12</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '13px' }}>ATS Report Downloads</span>
                      <strong style={{ color: 'var(--secondary)' }}>8</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '13px' }}>Interviews Scheduled</span>
                      <strong style={{ color: '#10b981' }}>2</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px' }}>Avg response rate</span>
                      <strong style={{ color: '#f59e0b' }}>25%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING AI ASSISTANT CHATBOT */}
      <div className={`floating-chat-container ${botOpen ? 'expanded' : ''}`}>
        {!botOpen ? (
          <button className="chat-trigger-btn" onClick={() => setBotOpen(true)} title="AI Career Assistant">
            💬 <span className="trigger-text">AI Coach</span>
          </button>
        ) : (
          <div className="glass-card chat-window animate-fade">
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>AI Career Coach</h4>
                  <span style={{ fontSize: '10px', color: '#10b981' }}>Online • Ready to evaluation</span>
                </div>
              </div>
              <button className="chat-close-x" onClick={() => setBotOpen(false)}>
                &times;
              </button>
            </div>

            <div className="chat-body-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message-bubble ${msg.sender}`}>
                  <p style={{ margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              ))}
              {isBotTyping && (
                <div className="chat-message-bubble bot typing">
                  <div className="typing-dots"><span>.</span><span>.</span><span>.</span></div>
                </div>
              )}
            </div>

            {/* Quick helper prompts */}
            <div className="chat-quick-shelf">
              <button onClick={() => handleChatSubmit(null, 'Suggest projects for my Resume')}>Projects ideas</button>
              <button onClick={() => handleChatSubmit(null, 'Help me rewrite my summary')}>Summary tip</button>
              <button onClick={() => handleChatSubmit(null, 'Give salary guidance for software engineer')}>Salary bands</button>
              <button onClick={() => handleChatSubmit(null, 'What is the recommended roadmap?')}>Career roadmap</button>
            </div>

            <form onSubmit={handleChatSubmit} className="chat-input-form">
              <input 
                type="text" 
                placeholder="Ask career advice or optimize summary..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                required
              />
              <button type="submit">&rarr;</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
