import { useState, useEffect, useRef } from 'react'
import { HiOutlineArrowUp } from 'react-icons/hi2'
import './LandingPage.css'
import AuthModal from '../components/login/AuthModal'
import CardNav from '../components/navigation/CardNav'
import TrueFocus from '../components/focus/TrueFocus'
import LaserFlow from '../components/LaserFlow/LaserFlow'

import resumeMockup from '../assets/resume_builder_mockup.png'
import templateModernProfessional from '../assets/template_modern_professional.png'
import templateAtsFriendly from '../assets/template_ats_friendly.png'
import templateCreative from '../assets/template_creative.png'
import templateExecutive from '../assets/template_executive.png'
import resumeSoftwareEngineer from '../assets/resume_software_engineer.png'
import resumeFullStackDeveloper from '../assets/resume_full_stack_developer.png'
import resumeDataScientist from '../assets/resume_data_scientist.png'
import resumeProductManager from '../assets/resume_product_manager.png'

const templates = [
  { name: "Software Engineer", src: resumeSoftwareEngineer },
  { name: "Full Stack Developer", src: resumeFullStackDeveloper },
  { name: "Data Scientist / AI", src: resumeDataScientist },
  { name: "Product Manager", src: resumeProductManager },
  { name: "Modern Professional", src: templateModernProfessional },
  { name: "ATS Friendly Standard", src: templateAtsFriendly },
  { name: "Creative & Branding", src: templateCreative },
  { name: "Premium Executive", src: templateExecutive }
]

/**
 * LandingPage Component
 * The main public-facing landing page of ResuAI Coach. Features product showcase, pricing links,
 * fluid smooth scrolling, scroll reading progress bar, and user authentication.
 */
export default function LandingPage({ onLoginSuccess, onGoToDashboard }) {
  
  // ==========================================
  // 1. STATE INITIALIZATION & CONFIGURATION
  // ==========================================
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const theme = 'dark'
  const revealImgRef = useRef(null)

  const handleLaserMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
    }
  };

  const handleLaserMouseLeave = () => {
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  };

  // Smooth Section Scroll Helpers
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll Progress & Floating Back-To-Top listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          setScrollProgress(progress);
          setShowScrollTop(currentScroll > 320);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Reveal Intersection Observer with natural threshold and margin
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  // ==========================================
  // 4. PUBLIC LANDING PAGE LAYOUT RENDER
  // ==========================================
  const brandLogo = (
    <div className="landing-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' }}>
      <img src="/favicon.svg" alt="AI Resume & Career Assistant Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
      <span className="landing-brand-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: theme === 'dark' ? '#fff' : '#000', letterSpacing: '-0.5px' }}>AI Resume &amp; Career Assistant</span>
    </div>
  )

  const navItems = [
    {
      label: "Features",
      bgColor: theme === 'dark' ? '#1B1722' : '#f3f4f6',
      textColor: theme === 'dark' ? '#fff' : '#1f2937',
      links: [
        { label: "ATS Resume Builder", ariaLabel: "ATS Resume Builder", onClick: () => scrollToSection('resume-builder') },
        { label: "AI Laser Scanner", ariaLabel: "AI Laser Scanner", onClick: () => scrollToSection('laser-scanner') },
        { label: "Career Assessment", ariaLabel: "Career Assessment", onClick: () => scrollToSection('how-it-works') },
        { label: "Resume Templates", ariaLabel: "Resume Templates", onClick: () => scrollToSection('resume-templates') }
      ]
    },
    {
      label: "Tools & Prep",
      bgColor: theme === 'dark' ? '#2F293A' : '#e5e7eb',
      textColor: theme === 'dark' ? '#fff' : '#1f2937',
      links: [
        { label: "Mock Interview Prep", ariaLabel: "Mock Interview Prep", onClick: () => setShowAuthModal(true) },
        { label: "AI Job Recommendations", ariaLabel: "AI Job Recommendations", onClick: () => setShowAuthModal(true) },
        { label: "Kanban Job Tracker", ariaLabel: "Kanban Job Tracker", onClick: () => setShowAuthModal(true) }
      ]
    },
    {
      label: "Explore",
      bgColor: theme === 'dark' ? '#3e354f' : '#d1d5db',
      textColor: theme === 'dark' ? '#fff' : '#1f2937',
      links: [
        { label: "Templates Library", ariaLabel: "Templates Library", onClick: () => scrollToSection('resume-templates') },
        { label: "Start Free Evaluation", ariaLabel: "Start Free Evaluation", onClick: () => setShowAuthModal(true) }
      ]
    }
  ];

  return (
    <div className="landing-container">
      {/* Top Scroll Reading Progress Bar */}
      <div className="landing-scroll-progress-container">
        <div className="landing-scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Floating Back to Top Button */}
      <button
        type="button"
        className={`back-to-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Scroll to top"
      >
        <HiOutlineArrowUp />
      </button>

      {/* Spacer for absolute positioned CardNav */}
      <div className="landing-navbar-spacer" style={{ height: '120px' }}></div>
      
      <CardNav
        logo={brandLogo}
        items={navItems}
        baseColor={theme === 'dark' ? '#110c1a' : '#ffffff'}
        menuColor={theme === 'dark' ? '#ffffff' : '#000000'}
        buttonBgColor={theme === 'dark' ? '#8b5cf6' : '#111827'}
        buttonTextColor="#ffffff"
        onLoginClick={() => setShowAuthModal(true)}
        onCtaClick={() => setShowAuthModal(true)}
        ctaText="Get Started"
      />

      {/* 4b. Hero Showcase Section */}
      <section id="hero" className="landing-hero reveal-section animate-fade">
        <div className="landing-hero-laserflow-bg">
          <LaserFlow
            horizontalBeamOffset={0.1}
            verticalBeamOffset={0.0}
            color="#8b5cf6"
            fogIntensity={0.45}
            wispDensity={1.2}
            flowSpeed={0.35}
          />
        </div>
        <div className="landing-hero-left reveal-item">
          <div className="landing-pill">
            AI feeling unfamiliar? Start with the fundamentals &rarr;
          </div>
          <h1 className="landing-title">
            The smarter way <br />
            to grow your <br />
            career with AI
          </h1>
          <p className="landing-subtitle">
            First, let's find your baseline. Get your free AI Readiness Score in 5 minutes to see your strengths, close skill gaps, and unlock your personalized growth plan.
          </p>
          <div className="landing-hero-actions">
            <button className="btn-primary landing-cta-btn" onClick={() => setShowAuthModal(true)}>
              Get Your Free AI Readiness Score
            </button>
            <a href="#how-it-works" className="landing-link-text" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
              What does this check measure? &darr;
            </a>
          </div>
        </div>

        {/* Floating 3D Dashboard Mockup Graphic */}
        <div className="landing-hero-right reveal-item reveal-delay-2">
          <div className="glow-trail"></div>
          <div className="dashboard-mockup-wrapper">
            <div className="mockup-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
              <div className="mockup-address">resuai-coach.io/dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-side-logo">✧</div>
                <div className="mockup-side-item active"></div>
                <div className="mockup-side-item"></div>
                <div className="mockup-side-item"></div>
                <div className="mockup-side-item"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-row">
                  <div className="mockup-card" style={{ width: '40%' }}>
                    <div className="mockup-circle-gauge">
                      <div className="gauge-text">70%</div>
                    </div>
                    <div className="mockup-line" style={{ width: '80%', marginTop: '5px' }}></div>
                    <div className="mockup-line" style={{ width: '60%' }}></div>
                  </div>
                  <div className="mockup-card" style={{ width: '60%' }}>
                    <div className="mockup-chart-header" style={{ display: 'flex', justifyContent: 'space-between', height: '10px' }}>
                      <div className="mockup-line" style={{ width: '40%', height: '5px' }}></div>
                      <div className="mockup-line" style={{ width: '20%', height: '5px' }}></div>
                    </div>
                    <div className="mockup-chart-curve" style={{ marginTop: '10px' }}></div>
                    <div className="mockup-line" style={{ width: '90%', marginTop: '10px' }}></div>
                  </div>
                </div>
                <div className="mockup-row">
                  <div className="mockup-card" style={{ width: '100%' }}>
                    <div className="mockup-line" style={{ width: '95%', height: '12px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div className="mockup-line" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4c. Feature Steps / Process Section */}
      <section id="how-it-works" className="landing-steps reveal-section animate-fade">
        <div className="section-divider reveal-item"></div>
        <div className="step-card reveal-item">
          <div className="step-icon">📋</div>
          <h3>Assess</h3>
          <p>Discover how prepared you are with a quick AI-powered assessment.</p>
        </div>
        <div className="step-divider reveal-item reveal-delay-1">&rarr;</div>
        <div className="step-card reveal-item reveal-delay-2">
          <div className="step-icon">📈</div>
          <h3>Build skills</h3>
          <p>Get tailored growth recommendations and stay consistent with streaks.</p>
        </div>
        <div className="step-divider reveal-item reveal-delay-3">&rarr;</div>
        <div className="step-card reveal-item reveal-delay-4">
          <div className="step-icon">🏆</div>
          <h3>Show the world</h3>
          <p>Share your badge, optimise your CV, and apply to roles that fit your growth.</p>
        </div>
      </section>

      {/* 4d. Interactive LaserFlow Reveal Showcase */}
      <section id="laser-scanner" className="laser-flow-showcase-section reveal-section animate-fade">
        <h2 className="reveal-item laser-showcase-title">
          Interactive AI Career Scanner
        </h2>
        <p className="section-subtitle reveal-item reveal-delay-1 laser-showcase-subtitle">
          Hover over the interactive canvas below to reveal how our AI scans your experience against real-world job requirements.
        </p>
        <div 
          className="laser-flow-box-container reveal-item reveal-delay-2"
          onMouseMove={handleLaserMouseMove}
          onMouseLeave={handleLaserMouseLeave}
        >
          <LaserFlow
            horizontalBeamOffset={0.1}
            verticalBeamOffset={0.0}
            color="#FF79C6"
          />
          
          <div className="laser-flow-card-overlay">
            <div className="laser-flow-card-inner">
              <span className="laser-flow-badge">✧ AI LASER SCANNER</span>
              <h3>Real-time Skill &amp; ATS Reveal</h3>
              <p>Move your cursor across the container to trigger the laser reveal effect on our AI dashboard preview.</p>
              <button className="btn-primary" onClick={() => setShowAuthModal(true)} style={{ marginTop: '12px' }}>
                Try AI Scanner Now
              </button>
            </div>
          </div>

          <img
            ref={revealImgRef}
            src={resumeMockup}
            alt="Reveal effect"
            className="laser-flow-reveal-image"
          />
        </div>
      </section>

      {/* New AI Resume Showcase Section */}
      <section id="resume-builder" className="landing-features-resume reveal-section animate-fade">
        <div className="resume-features-left reveal-item">
          <TrueFocus 
            sentence="Build Resume with our Web"
            manualMode={false}
            blurAmount={4}
            borderColor="var(--primary)"
            glowColor="var(--primary-glow)"
            animationDuration={0.8}
            pauseBetweenAnimations={1}
          />
          <p className="section-subtitle">
            Most companies use Automated Tracking Systems (ATS) to filter out resumes. Our AI Optimizer scores your CV, identifies missing keywords, and optimizes your layout to get you past the screening.
          </p>
          <div className="resume-feature-cards">
            <div className="resume-feature-card" onClick={() => setShowAuthModal(true)}>
              <div className="resume-feature-icon">📊</div>
              <div className="resume-feature-info">
                <h3>ATS Score Analyzer</h3>
                <p>Instantly compare your resume against any job description to get a compatibility score out of 100.</p>
              </div>
            </div>
            <div className="resume-feature-card" onClick={() => setShowAuthModal(true)}>
              <div className="resume-feature-icon">✨</div>
              <div className="resume-feature-info">
                <h3>Smart Keyword Suggestions</h3>
                <p>Find the exact industry phrases and skills missing from your resume and insert them in one click.</p>
              </div>
            </div>
            <div className="resume-feature-card" onClick={() => setShowAuthModal(true)}>
              <div className="resume-feature-icon">🚀</div>
              <div className="resume-feature-info">
                <h3>STAR Formula Enhancer</h3>
                <p>Turn plain bullet points into high-impact, outcome-based statements that highlight your achievements.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="resume-features-right reveal-item reveal-delay-2">
          <div className="resume-mockup-container">
            <img src={resumeMockup} alt="AI Resume Builder & ATS Scorer Mockup" className="resume-mockup-image" />
          </div>
        </div>
      </section>

      {/* Resume Templates Section */}
      <section id="resume-templates" className="resume-templates-section reveal-section animate-fade">
        <h2 className="reveal-item">Expert-Crafted Resume Templates</h2>
        <p className="section-subtitle reveal-item reveal-delay-1">
          Choose from our library of recruiter-approved, 100% ATS-compliant templates designed to help you stand out.
        </p>
        <div className="templates-grid reveal-item reveal-delay-2">
          {templates.map((tpl, i) => (
            <div key={i} className="template-preview-card" onClick={() => setShowAuthModal(true)}>
              <div className="template-svg-wrapper">
                <img src={tpl.src} alt={tpl.name} />
              </div>
              <span className="template-name">{tpl.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4d. Authentication Overlay Modal Dialog */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={(userData) => {
            setShowAuthModal(false);
            if (onLoginSuccess) {
              onLoginSuccess(userData);
            } else if (onGoToDashboard) {
              onGoToDashboard();
            }
          }}
        />
      )}
    </div>
  )
}
