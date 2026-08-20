import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import {
  HiOutlineArrowUp,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineArrowTrendingUp,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2'
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

const statsData = [
  { icon: HiOutlineShieldCheck, value: "98.4%", label: "ATS Screening Pass Rate", color: "#34d399" },
  { icon: HiOutlineBuildingOffice2, value: "500+", label: "Top Indian Tech Companies", color: "#38bdf8" },
  { icon: HiOutlineSparkles, value: "15,000+", label: "Tailored AI Resumes", color: "#a855f7" },
  { icon: HiOutlineArrowTrendingUp, value: "3.5x", label: "Higher Interview Callbacks", color: "#f43f5e" }
]

/**
 * LandingPage Component
 * Features rich scroll-linked parallax physics, 3D tilt effects, interactive step animations,
 * and high-performance viewport reveals powered by Motion for React.
 */
export default function LandingPage({ onLoginSuccess, onGoToDashboard }) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const theme = 'dark'
  const revealImgRef = useRef(null)
  const heroRef = useRef(null)

  // Scroll Progress and Spring Physics
  const { scrollYProgress, scrollY } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001
  })

  // Hero Section Parallax Transforms
  const heroMockupY = useTransform(scrollYProgress, [0, 0.25], [0, 90])
  const heroMockupRotateX = useTransform(scrollYProgress, [0, 0.25], [12, 22])
  const heroMockupRotateY = useTransform(scrollYProgress, [0, 0.25], [-18, -8])
  const heroMockupScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96])
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, -30])
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.5])
  
  // Ambient floating background glow parallax
  const bgOrb1Y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const bgOrb2Y = useTransform(scrollYProgress, [0, 1], [0, 300])

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

  // Floating Back-To-Top listener
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setShowScrollTop(latest > 320)
    })
    return () => unsubscribe()
  }, [scrollY])

  // ==========================================
  // BRAND & NAVIGATION
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
      {/* Background Floating Parallax Glowing Orbs */}
      <motion.div
        className="parallax-ambient-orb orb-1"
        style={{ y: bgOrb1Y }}
        aria-hidden="true"
      />
      <motion.div
        className="parallax-ambient-orb orb-2"
        style={{ y: bgOrb2Y }}
        aria-hidden="true"
      />

      {/* Spring Physics Top Scroll Reading Progress Bar */}
      <div className="landing-scroll-progress-container">
        <motion.div
          className="landing-scroll-progress-bar"
          style={{ scaleX: smoothProgress, transformOrigin: '0%' }}
        />
      </div>

      {/* Floating Back to Top Button with Spring Scale */}
      <motion.button
        type="button"
        className={`back-to-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Scroll to top"
        whileHover={{ scale: 1.12, y: -4 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
        transition={{ duration: 0.25 }}
      >
        <HiOutlineArrowUp />
      </motion.button>

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

      {/* 4b. Hero Showcase Section with Parallax Depth */}
      <section id="hero" ref={heroRef} className="landing-hero">
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

        <motion.div
          className="landing-hero-left"
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="landing-pill">
            <HiOutlineSparkles style={{ marginRight: '6px', color: '#fb7185' }} /> AI feeling unfamiliar? Start with the fundamentals &rarr;
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
              <HiOutlineSparkles /> Get Your Free AI Readiness Score
            </button>
            <a href="#how-it-works" className="landing-link-text" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
              What does this check measure? &darr;
            </a>
          </div>
        </motion.div>

        {/* Floating 3D Dashboard Mockup Graphic with Parallax Spring */}
        <motion.div
          className="landing-hero-right"
          style={{
            y: heroMockupY,
            rotateX: heroMockupRotateX,
            rotateY: heroMockupRotateY,
            scale: heroMockupScale
          }}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
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
                      <div className="gauge-text">98%</div>
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
        </motion.div>
      </section>

      {/* Live AI Career Stats Strip (Scroll Animated) */}
      <motion.section
        className="landing-stats-strip"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="stats-strip-grid">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className="stat-card"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="stat-icon-box" style={{ color: stat.color }}>
                  <Icon />
                </div>
                <div className="stat-content">
                  <h4 className="stat-number">{stat.value}</h4>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 4c. Feature Steps / Process Section */}
      <section id="how-it-works" className="landing-steps">
        <motion.div
          className="section-divider"
          initial={{ width: '0%', opacity: 0 }}
          whileInView={{ width: '100%', opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        
        <motion.div
          className="step-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="step-icon">📋</div>
          <h3>Assess</h3>
          <p>Discover how prepared you are with a quick AI-powered assessment.</p>
        </motion.div>

        <motion.div
          className="step-divider"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          &rarr;
        </motion.div>

        <motion.div
          className="step-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="step-icon">📈</div>
          <h3>Build skills</h3>
          <p>Get tailored growth recommendations and stay consistent with streaks.</p>
        </motion.div>

        <motion.div
          className="step-divider"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          &rarr;
        </motion.div>

        <motion.div
          className="step-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="step-icon">🏆</div>
          <h3>Show the world</h3>
          <p>Share your badge, optimise your CV, and apply to roles that fit your growth.</p>
        </motion.div>
      </section>

      {/* 4d. Interactive LaserFlow Reveal Showcase */}
      <section id="laser-scanner" className="laser-flow-showcase-section">
        <motion.h2
          className="laser-showcase-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Interactive AI Career Scanner
        </motion.h2>
        <motion.p
          className="section-subtitle laser-showcase-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Hover over the interactive canvas below to reveal how our AI scans your experience against real-world job requirements.
        </motion.p>
        <motion.div 
          className="laser-flow-box-container"
          onMouseMove={handleLaserMouseMove}
          onMouseLeave={handleLaserMouseLeave}
          initial={{ opacity: 0, scale: 0.96, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                <HiOutlineSparkles /> Try AI Scanner Now
              </button>
            </div>
          </div>

          <img
            ref={revealImgRef}
            src={resumeMockup}
            alt="Reveal effect"
            className="laser-flow-reveal-image"
          />
        </motion.div>
      </section>

      {/* New AI Resume Showcase Section */}
      <section id="resume-builder" className="landing-features-resume">
        <motion.div
          className="resume-features-left"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
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
            <motion.div
              className="resume-feature-card"
              onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.02, x: 6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <div className="resume-feature-icon">📊</div>
              <div className="resume-feature-info">
                <h3>ATS Score Analyzer</h3>
                <p>Instantly compare your resume against any job description to get a compatibility score out of 100.</p>
              </div>
            </motion.div>
            <motion.div
              className="resume-feature-card"
              onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.02, x: 6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <div className="resume-feature-icon">✨</div>
              <div className="resume-feature-info">
                <h3>Smart Keyword Suggestions</h3>
                <p>Find the exact industry phrases and skills missing from your resume and insert them in one click.</p>
              </div>
            </motion.div>
            <motion.div
              className="resume-feature-card"
              onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.02, x: 6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            >
              <div className="resume-feature-icon">🚀</div>
              <div className="resume-feature-info">
                <h3>STAR Formula Enhancer</h3>
                <p>Turn plain bullet points into high-impact, outcome-based statements that highlight your achievements.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div
          className="resume-features-right"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="resume-mockup-container">
            <img src={resumeMockup} alt="AI Resume Builder & ATS Scorer Mockup" className="resume-mockup-image" />
          </div>
        </motion.div>
      </section>

      {/* Resume Templates Section */}
      <section id="resume-templates" className="resume-templates-section">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Expert-Crafted Resume Templates
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Choose from our library of recruiter-approved, 100% ATS-compliant templates designed to help you stand out.
        </motion.p>
        <div className="templates-grid">
          {templates.map((tpl, i) => (
            <motion.div
              key={i}
              className="template-preview-card"
              onClick={() => setShowAuthModal(true)}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className="template-svg-wrapper">
                <img src={tpl.src} alt={tpl.name} />
              </div>
              <span className="template-name">{tpl.name}</span>
            </motion.div>
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
