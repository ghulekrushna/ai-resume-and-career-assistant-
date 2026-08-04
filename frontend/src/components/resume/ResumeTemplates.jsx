import React, { useState } from 'react';
import {
  HiOutlineSparkles,
  HiOutlineCheck,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineArrowDownTray,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineShieldCheck,
  HiOutlineDocumentArrowUp,
  HiOutlinePlus,
  HiOutlineStar,
  HiXMark,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineUser
} from 'react-icons/hi2';
import FullResumeEditor from './FullResumeEditor';
import { apiService } from '../../services/api';
import './ResumeTemplates.css';

// Import template asset images from assets
import modernProfImg from '../../assets/template_modern_professional.png';
import atsFriendlyImg from '../../assets/template_ats_friendly.png';
import executiveImg from '../../assets/template_executive.png';
import creativeImg from '../../assets/template_creative.png';
import resumeSoftwareEngImg from '../../assets/resume_software_engineer.png';
import resumeDataScientistImg from '../../assets/resume_data_scientist.png';

/**
 * Temporary Resume Templates Component
 * Renders interactive resume templates gallery, category filter, live template preview modal,
 * and quick customization tools for the 'Create Resume' sidebar view.
 */
const ResumeTemplates = ({ onGainXp }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [fullScreenEditorTemplate, setFullScreenEditorTemplate] = useState(null);
  const [activeThemeColor, setActiveThemeColor] = useState('#a855f7');
  const [sampleData, setSampleData] = useState({
    name: 'Alex Morgan',
    title: 'Senior Full Stack & AI Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    summary: 'Innovative Full Stack Software Engineer with 6+ years of experience building scalable web applications, cloud microservices, and AI-driven career tools.',
    skills: ['React.js', 'Node.js', 'Python', 'TypeScript', 'TailwindCSS', 'PostgreSQL', 'GraphQL', 'Docker'],
    experience: [
      {
        company: 'TechCorp Solutions',
        role: 'Senior Software Engineer',
        period: '2022 - Present',
        description: 'Architected cloud microservices handling 2M+ monthly active requests. Led frontend performance optimization by 40%.'
      },
      {
        company: 'Innovate AI Labs',
        role: 'Full Stack Engineer',
        period: '2020 - 2022',
        description: 'Designed interactive dashboards and NLP text engines for automated resume parsing.'
      }
    ]
  });

  const [customUploadedTemplates, setCustomUploadedTemplates] = useState([]);

  const resumeFileInputRef = React.useRef(null);

  const handleResumeFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const textContent = event.target.result;
      const uploadedName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      const uploadedTemplate = {
        id: `tmpl-uploaded-${Date.now()}`,
        name: `Uploaded: ${uploadedName}`,
        category: 'ats',
        atsScore: '97%',
        tag: 'Uploaded Resume',
        tagClass: 'tag-ats',
        description: `Imported from ${file.name}`,
        image: atsFriendlyImg,
        accentColors: ['#2563eb', '#7c3aed', '#059669', '#0f172a'],
        initialData: {
          profileImage: '',
          fullName: uploadedName.toUpperCase(),
          jobTitle: 'IMPORTED RESUME CANDIDATE',
          email: 'candidate@example.com',
          phone: '+1 (555) 123-4567',
          address: 'City, State',
          website: '',
          summary: typeof textContent === 'string' && textContent.length > 20
            ? textContent.slice(0, 300) + '...'
            : 'Successfully imported content from your uploaded resume file.',
          experiences: [
            {
              id: 'exp-1',
              company: 'Previous Company',
              title: 'Previous Role',
              period: '2021 - Present',
              description: typeof textContent === 'string' && textContent.length > 50
                ? textContent.slice(0, 200)
                : 'Key responsibilities and achievements extracted from uploaded file.'
            }
          ],
          educations: [
            {
              id: 'edu-1',
              institution: 'University Name',
              degree: 'Degree / Program',
              year: '2021'
            }
          ],
          skills: ['Uploaded Skill 1', 'Uploaded Skill 2', 'Uploaded Skill 3']
        }
      };

      // Save to Backend Database (FastAPI SQLite DB)
      try {
        await apiService.saveResume({
          title: uploadedTemplate.name,
          template_id: uploadedTemplate.id,
          initialData: uploadedTemplate.initialData,
          atsScore: 97
        });
      } catch (err) {
        console.warn('Backend save notice:', err);
      }

      // Prepend to Create Resume gallery state
      setCustomUploadedTemplates((prev) => [uploadedTemplate, ...prev]);

      if (onGainXp) {
        onGainXp(75, 'Resume File Upload');
      }

      // Open in Full Resume Editor
      setFullScreenEditorTemplate(uploadedTemplate);
    };

    reader.readAsText(file);
  };

  const blankTemplate = {
    id: 'tmpl-blank-custom',
    name: 'Blank Custom Resume',
    category: 'ats',
    atsScore: '100%',
    tag: 'Blank Slate',
    tagClass: 'tag-ats',
    description: 'Fresh clean slate template to build your resume completely from scratch.',
    image: atsFriendlyImg,
    accentColors: ['#2563eb', '#7c3aed', '#059669', '#0f172a'],
    initialData: {
      profileImage: '',
      fullName: 'Your Full Name',
      jobTitle: 'YOUR TARGET JOB TITLE',
      email: 'email@example.com',
      phone: '+1 (555) 000-0000',
      address: 'City, State',
      website: 'linkedin.com/in/yourname',
      summary: 'Enter a brief professional summary highlighting your key background and career goals...',
      experiences: [
        {
          id: 'exp-1',
          company: 'Company Name',
          title: 'Position / Role Title',
          period: '2023 - Present',
          description: 'Add your key responsibilities, projects, and achievements here.'
        }
      ],
      educations: [
        {
          id: 'edu-1',
          institution: 'University / Institution Name',
          degree: 'Degree & Major',
          year: '2023'
        }
      ],
      skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4']
    }
  };

  const templatesData = [
    ...customUploadedTemplates,
    blankTemplate,
    {
      id: 'tmpl-software-engineer',
      name: 'Senior Full Stack & AI Engineer',
      category: 'modern',
      atsScore: '98%',
      tag: 'Most Popular',
      tagClass: 'tag-popular',
      description: 'Clean two-column layout with tech stack highlights for Full Stack & AI Engineers.',
      image: resumeSoftwareEngImg,
      accentColors: ['#a855f7', '#06b6d4', '#2563eb', '#10b981'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        fullName: 'Alex Morgan',
        jobTitle: 'SENIOR FULL STACK & AI ENGINEER',
        email: 'alex.morgan@techmail.com',
        phone: '+1 (555) 234-5678',
        address: 'San Francisco, CA',
        website: 'https://github.com/alexmorgan-ai',
        summary: 'Innovative Full Stack & AI Software Engineer with 6+ years of experience building high-concurrency cloud services, React web applications, and LLM-powered enterprise microservices.',
        experiences: [
          {
            id: 'exp-1',
            company: 'TechCorp AI Solutions',
            title: 'Senior Full Stack Engineer',
            period: '2022 - Present',
            description: 'Architected microservices handling 3.5M+ daily requests using Node.js, Python, and React. Optimized web bundle size by 42% and reduced cloud deployment costs by $85k annually.'
          },
          {
            id: 'exp-2',
            company: 'Nexus Scale Labs',
            title: 'Full Stack Developer',
            period: '2020 - 2022',
            description: 'Built real-time streaming analytics dashboards with WebSockets, GraphQL, and PostgreSQL. Spearheaded CI/CD pipelines reducing deployment times from 45m to 8m.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'Stanford University',
            degree: 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
            year: '2020'
          }
        ],
        skills: ['React.js', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'TailwindCSS']
      }
    },
    {
      id: 'tmpl-ats',
      name: 'ATS Clean Scannable Standard',
      category: 'ats',
      atsScore: '99%',
      tag: 'Highest ATS Pass',
      tagClass: 'tag-ats',
      description: 'Single column fail-proof layout designed specifically to pass ATS parsers seamlessly.',
      image: atsFriendlyImg,
      accentColors: ['#0f172a', '#2563eb', '#059669', '#d97706'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        fullName: 'Jordan Lee',
        jobTitle: 'SYSTEMS ARCHITECT & ATS LEAD',
        email: 'jordan.lee@systems.io',
        phone: '+1 (555) 876-5432',
        address: 'Seattle, WA',
        website: 'https://linkedin.com/in/jordanlee-tech',
        summary: 'Accomplished Systems Architect specializing in distributed backend architecture, fault-tolerant infrastructure, and scalable cloud engineering.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Enterprise Cloud Systems',
            title: 'Lead Systems Architect',
            period: '2021 - Present',
            description: 'Designed multi-region Kubernetes clusters with 99.99% uptime. Managed $1.2M cloud budget across AWS and Azure infrastructure.'
          },
          {
            id: 'exp-2',
            company: 'DataStream Core',
            title: 'Senior Backend Engineer',
            period: '2018 - 2021',
            description: 'Engineered high-throughput Go and Rust gRPC microservices processing 10,000+ events per second.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'University of Washington',
            degree: 'MASTER OF SCIENCE IN COMPUTER ENGINEERING',
            year: '2018'
          }
        ],
        skills: ['Go', 'Rust', 'Kubernetes', 'Docker', 'AWS', 'Terraform', 'gRPC', 'Distributed Systems']
      }
    },
    {
      id: 'tmpl-data-science',
      name: 'Data Scientist & AI Specialist',
      category: 'ats',
      atsScore: '97%',
      tag: 'AI & ML Roles',
      tagClass: 'tag-ats',
      description: 'Structured layout emphasizing research metrics, machine learning models, & data pipelines.',
      image: resumeDataScientistImg,
      accentColors: ['#0f766e', '#4f46e5', '#ca8a04', '#9333ea'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        fullName: 'Elena Rostova',
        jobTitle: 'LEAD DATA SCIENTIST & ML ENGINEER',
        email: 'elena.rostova@ai-research.org',
        phone: '+1 (555) 998-1122',
        address: 'Boston, MA',
        website: 'https://github.com/elena-ai-data',
        summary: 'Data Scientist with 5+ years of experience training deep learning models, fine-tuning LLMs, and building end-to-end MLOps pipelines.',
        experiences: [
          {
            id: 'exp-1',
            company: 'DeepMind ML Labs',
            title: 'Lead ML Engineer',
            period: '2022 - Present',
            description: 'Trained transformer-based NLP models improving sentiment classification accuracy by 18%. Deployed real-time inference endpoints serving 50M+ requests.'
          },
          {
            id: 'exp-2',
            company: 'QuantData Analytics',
            title: 'Data Scientist',
            period: '2019 - 2022',
            description: 'Developed predictive churn models saving $4.2M in annual customer retention. Built ETL pipelines in PySpark and Snowflake.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'MIT',
            degree: 'BACHELOR OF SCIENCE IN DATA SCIENCE & STATISTICS',
            year: '2019'
          }
        ],
        skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'MLOps', 'SQL', 'Snowflake', 'Pandas', 'Spark']
      }
    },
    {
      id: 'tmpl-executive',
      name: 'Executive Leadership & VP',
      category: 'executive',
      atsScore: '96%',
      tag: 'Senior Level',
      tagClass: 'tag-exec',
      description: 'Elegant typography emphasis tailored for Directors, VPs, & Tech Executives.',
      image: executiveImg,
      accentColors: ['#1e293b', '#7c3aed', '#991b1b', '#065f46'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
        fullName: 'Marcus Vance',
        jobTitle: 'VICE PRESIDENT OF ENGINEERING',
        email: 'marcus.vance@executive.com',
        phone: '+1 (555) 345-6789',
        address: 'New York, NY',
        website: 'https://linkedin.com/in/marcusvance-vp',
        summary: 'Strategic Engineering VP with 12+ years of experience scaling global software teams, managing $15M+ annual budgets, and delivering enterprise SaaS products.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Global SaaS Enterprise',
            title: 'VP of Engineering',
            period: '2020 - Present',
            description: 'Scaled engineering organization from 25 to 140+ engineers across 4 international hubs. Increased annual recurring revenue (ARR) from $20M to $75M.'
          },
          {
            id: 'exp-2',
            company: 'CloudScale Technologies',
            title: 'Director of Software Engineering',
            period: '2016 - 2020',
            description: 'Managed 5 cross-functional engineering teams. Overseeing product architecture, technical roadmaps, and security compliance (SOC2, GDPR).'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'Harvard University',
            degree: 'MBA & BACHELOR OF COMPUTER SCIENCE',
            year: '2016'
          }
        ],
        skills: ['Executive Leadership', 'Engineering Management', 'P&L Oversight', 'SaaS Architecture', 'Strategic Growth', 'SOC2 Compliance']
      }
    },
    {
      id: 'tmpl-creative',
      name: 'Senior UI/UX & Product Designer',
      category: 'creative',
      atsScore: '94%',
      tag: 'UI/UX & Portfolio',
      tagClass: 'tag-creative',
      description: 'Stylish header card layout with high-impact design portfolio showcase section.',
      image: creativeImg,
      accentColors: ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
        fullName: 'Sophia Bennett',
        jobTitle: 'SENIOR UI/UX & PRODUCT DESIGNER',
        email: 'sophia.design@canvas.io',
        phone: '+1 (555) 776-3344',
        address: 'Austin, TX',
        website: 'https://behance.net/sophiabennett',
        summary: 'Creative Lead Product Designer with 6+ years creating intuitive design systems, user journeys, and responsive mobile/web applications.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Design Studio Pro',
            title: 'Lead Product Designer',
            period: '2021 - Present',
            description: 'Created multi-brand Figma design system used by 50+ engineers. Improved web app conversion rates by 28% through iterative user research and usability testing.'
          },
          {
            id: 'exp-2',
            company: 'Creative Apps Inc',
            title: 'UI/UX Designer',
            period: '2018 - 2021',
            description: 'Designed iOS and Android mobile interfaces with 1M+ downloads. Conducted 100+ user interview sessions.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'Rhode Island School of Design (RISD)',
            degree: 'BACHELOR OF FINE ARTS IN GRAPHIC & INTERACTIVE DESIGN',
            year: '2018'
          }
        ],
        skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Wireframing', 'WCAG Accessibility']
      }
    },
    {
      id: 'tmpl-product-manager',
      name: 'AI & Tech Product Manager',
      category: 'modern',
      atsScore: '96%',
      tag: 'Product Lead',
      tagClass: 'tag-popular',
      description: 'Structured layout emphasizing product roadmaps, metrics, & cross-functional leadership.',
      image: modernProfImg,
      accentColors: ['#0284c7', '#7c3aed', '#059669', '#dc2626'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
        fullName: 'David Miller',
        jobTitle: 'SENIOR AI PRODUCT MANAGER',
        email: 'david.miller@pm-lead.com',
        phone: '+1 (555) 443-8899',
        address: 'Chicago, IL',
        website: 'https://linkedin.com/in/davidmiller-pm',
        summary: 'Data-driven Product Manager with 5+ years shipping AI SaaS features, defining GTM strategies, and leading agile engineering teams.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Apex AI Products',
            title: 'Senior Product Manager',
            period: '2022 - Present',
            description: 'Launched AI recommendations engine generating $8.5M in incremental annual revenue. Increased user 30-day retention by 32%.'
          },
          {
            id: 'exp-2',
            company: 'SaaS Suite Inc',
            title: 'Product Manager',
            period: '2019 - 2022',
            description: 'Managed product backlog and customer feedback loops for core B2B analytics platform.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'Northwestern University',
            degree: 'BACHELOR OF SCIENCE IN INDUSTRIAL ENGINEERING & MANAGEMENT',
            year: '2019'
          }
        ],
        skills: ['Product Strategy', 'Agile & Scrum', 'User Analytics', 'A/B Testing', 'Roadmapping', 'SQL', 'Jira']
      }
    },
    {
      id: 'tmpl-devops',
      name: 'DevOps & Cloud Systems Engineer',
      category: 'ats',
      atsScore: '98%',
      tag: 'Cloud & Infrastructure',
      tagClass: 'tag-ats',
      description: 'Streamlined layout for SRE, Kubernetes, CI/CD pipelines, and cloud automation experts.',
      image: resumeSoftwareEngImg,
      accentColors: ['#0f766e', '#0284c7', '#7c3aed', '#15803d'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        fullName: 'Ryan Sterling',
        jobTitle: 'SENIOR DEVOPS & CLOUD ARCHITECT',
        email: 'ryan.sterling@cloudops.dev',
        phone: '+1 (555) 612-9900',
        address: 'Denver, CO',
        website: 'https://github.com/sterling-cloudops',
        summary: 'Cloud DevOps Engineer with 7+ years of experience automating Infrastructure as Code (IaC), managing multi-region AWS/GCP clusters, and implementing Zero-Downtime deployment pipelines.',
        experiences: [
          {
            id: 'exp-1',
            company: 'CloudNative Infra',
            title: 'Lead DevOps Architect',
            period: '2021 - Present',
            description: 'Automated Terraform & Ansible IaC provisioning across 200+ microservices on AWS EKS. Reduced infrastructure provisioning time by 80%.'
          },
          {
            id: 'exp-2',
            company: 'ScaleHost Systems',
            title: 'Site Reliability Engineer (SRE)',
            period: '2018 - 2021',
            description: 'Designed Prometheus & Grafana monitoring dashboards with automated PagerDuty escalation policies maintaining 99.99% uptime.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'University of Colorado Boulder',
            degree: 'BACHELOR OF SCIENCE IN COMPUTER ENGINEERING',
            year: '2018'
          }
        ],
        skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD Pipelines', 'Ansible', 'Prometheus', 'Python', 'Linux Shell']
      }
    },
    {
      id: 'tmpl-cybersecurity',
      name: 'Cybersecurity & SecOps Specialist',
      category: 'ats',
      atsScore: '97%',
      tag: 'Security & Compliance',
      tagClass: 'tag-ats',
      description: 'Fail-proof ATS format highlighting threat hunting, penetration testing, & compliance standards.',
      image: atsFriendlyImg,
      accentColors: ['#1e293b', '#b91c1c', '#0369a1', '#047857'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
        fullName: 'Viktor Vance',
        jobTitle: 'CYBERSECURITY & THREAT INTEL LEAD',
        email: 'viktor.vance@secops.io',
        phone: '+1 (555) 789-0123',
        address: 'Washington, DC',
        website: 'https://linkedin.com/in/viktorvance-sec',
        summary: 'Certified Information Systems Security Professional (CISSP) with 6+ years protecting enterprise cloud networks, conducting threat intelligence, and managing SOC incident responses.',
        experiences: [
          {
            id: 'exp-1',
            company: 'CyberShield Systems',
            title: 'Lead SecOps Engineer',
            period: '2022 - Present',
            description: 'Spearheaded SOC incident response for 50k+ endpoints. Remediated zero-day vulnerabilities and achieved ISO 27001 & SOC 2 Type II certification.'
          },
          {
            id: 'exp-2',
            company: 'Defensive Cyber Labs',
            title: 'Penetration Tester',
            period: '2019 - 2022',
            description: 'Executed red team penetration testing across cloud infrastructure and web APIs, identifying 120+ critical vulnerabilities.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'George Mason University',
            degree: 'BACHELOR OF SCIENCE IN CYBERSECURITY ENGINEERING',
            year: '2019'
          }
        ],
        skills: ['CISSP', 'Penetration Testing', 'SIEM / Splunk', 'Zero Trust Architecture', 'ISO 27001', 'SOC 2', 'Wireshark', 'Python']
      }
    },
    {
      id: 'tmpl-finance',
      name: 'Financial Analyst & Corporate Strategist',
      category: 'executive',
      atsScore: '96%',
      tag: 'Finance & Strategy',
      tagClass: 'tag-exec',
      description: 'Sophisticated layout tailored for Investment Analysts, Corporate Finance, & M&A Strategists.',
      image: executiveImg,
      accentColors: ['#0f172a', '#1d4ed8', '#047857', '#b45309'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
        fullName: 'Claire Sterling',
        jobTitle: 'SENIOR FINANCIAL ANALYST & STRATEGIST',
        email: 'claire.sterling@finance-cap.com',
        phone: '+1 (555) 234-9988',
        address: 'New York, NY',
        website: 'https://linkedin.com/in/clairesterling-cfa',
        summary: 'CFA Charterholder with 5+ years of experience conducting quantitative financial modeling, valuation analysis, and managing $500M+ M&A transaction pipelines.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Vanguard Capital Partners',
            title: 'Senior Financial Analyst',
            period: '2021 - Present',
            description: 'Built 3-statement financial forecasting models for 15+ portfolio tech companies. Conducted M&A due diligence evaluating $250M acquisition targets.'
          },
          {
            id: 'exp-2',
            company: 'Goldman Advisory Group',
            title: 'Financial Analyst',
            period: '2018 - 2021',
            description: 'Prepared quarterly executive investor decks and variance reports. Optimized capital allocation strategies reducing operational expenses by 14%.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'NYU Stern School of Business',
            degree: 'BACHELOR OF SCIENCE IN FINANCE & ECONOMICS',
            year: '2018'
          }
        ],
        skills: ['CFA', 'Financial Modeling', 'DCF Valuation', 'M&A Due Diligence', 'Corporate Strategy', 'SQL', 'Excel / LBO', 'Tableau']
      }
    },
    {
      id: 'tmpl-marketing',
      name: 'Digital Marketing & Growth Lead',
      category: 'creative',
      atsScore: '95%',
      tag: 'Growth & Marketing',
      tagClass: 'tag-creative',
      description: 'High-impact design emphasizing customer acquisition metrics, SEO campaigns, & ROI.',
      image: creativeImg,
      accentColors: ['#c026d3', '#0284c7', '#ea580c', '#16a34a'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        fullName: 'Hannah Taylor',
        jobTitle: 'HEAD OF GROWTH & PERFORMANCE MARKETING',
        email: 'hannah.taylor@growth-lab.com',
        phone: '+1 (555) 887-1122',
        address: 'Los Angeles, CA',
        website: 'https://hannahtaylormarketing.com',
        summary: 'Performance Marketing Director with 6+ years driving multi-channel paid acquisition, SEO strategy, and CAC optimization delivering 350% ARR growth.',
        experiences: [
          {
            id: 'exp-1',
            company: 'ScaleUp Digital Agency',
            title: 'Head of Growth Marketing',
            period: '2021 - Present',
            description: 'Managed $2.5M annual ad spend across Google, Meta, and LinkedIn. Reduced Customer Acquisition Cost (CAC) by 34% while scaling monthly leads by 4x.'
          },
          {
            id: 'exp-2',
            company: 'TechBrand Global',
            title: 'Growth Marketing Manager',
            period: '2018 - 2021',
            description: 'Led SEO organic traffic strategy scaling website visitors from 100k to 1.2M monthly session views within 18 months.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'UCLA',
            degree: 'BACHELOR OF ARTS IN COMMUNICATIONS & DIGITAL MEDIA',
            year: '2018'
          }
        ],
        skills: ['Growth Marketing', 'Performance Ads (Meta/Google)', 'SEO Strategy', 'Conversion Rate Optimization', 'Google Analytics 4', 'HubSpot']
      }
    },
    {
      id: 'tmpl-hr',
      name: 'People Operations & HR Manager',
      category: 'executive',
      atsScore: '96%',
      tag: 'HR & Talent',
      tagClass: 'tag-exec',
      description: 'Clean modern template designed for Talent Acquisition, People Ops, & HR Directors.',
      image: modernProfImg,
      accentColors: ['#4d7c0f', '#0369a1', '#6d28d9', '#be123c'],
      initialData: {
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
        fullName: 'Rachel Stevens',
        jobTitle: 'DIRECTOR OF PEOPLE OPERATIONS & HR',
        email: 'rachel.stevens@people-ops.org',
        phone: '+1 (555) 334-5566',
        address: 'Atlanta, GA',
        website: 'https://linkedin.com/in/rachelstevens-hr',
        summary: 'Strategic HR Director with 7+ years of experience building remote company culture, scaling talent acquisition, and managing employee retention programs.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Innovate HR Solutions',
            title: 'Director of People Operations',
            period: '2021 - Present',
            description: 'Overseeing global HR operations for 300+ employees. Reduced annual employee turnover from 18% to 6% through structured onboarding and L&D initiatives.'
          },
          {
            id: 'exp-2',
            company: 'TalentScale Corp',
            title: 'Senior Talent Acquisition Lead',
            period: '2018 - 2021',
            description: 'Recruited 120+ technical software engineers and product managers in 12 months with a 92% offer acceptance rate.'
          }
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'Emory University',
            degree: 'BACHELOR OF BUSINESS ADMINISTRATION IN HUMAN RESOURCES',
            year: '2018'
          }
        ],
        skills: ['SHRM-SCP', 'Talent Acquisition', 'People Operations', 'Employee Engagement', 'HRIS / BambooHR', 'DEI Programs', 'Performance Mgmt']
      }
    }
  ];

  const handleSaveCustomResume = async (savedTemplate) => {
    setCustomUploadedTemplates((prev) => {
      const existingIdx = prev.findIndex((t) => t.id === savedTemplate.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = savedTemplate;
        return updated;
      }
      return [savedTemplate, ...prev];
    });

    try {
      await apiService.saveResume({
        title: savedTemplate.name,
        template_id: savedTemplate.id,
        initialData: savedTemplate.initialData,
        atsScore: 98
      });
    } catch (err) {
      console.warn('Backend save notice:', err);
    }

    if (onGainXp) {
      onGainXp(100, 'Saving Custom Resume');
    }
  };

  const categories = [
    { id: 'all', label: `All Templates (${templatesData.length})` },
    { id: 'my-resumes', label: `My Resumes & Uploads (${customUploadedTemplates.length})` },
    { id: 'modern', label: 'Tech & Product' },
    { id: 'ats', label: 'ATS Optimized (99%)' },
    { id: 'executive', label: 'Executive & Strategy' },
    { id: 'creative', label: 'Design & Marketing' }
  ];

  const filteredTemplates = templatesData.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchesSearch = tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resume-templates-container">
      {/* Top Banner Actions */}
      <div className="templates-hero-bar">
        <div className="hero-text">
          <h2>Choose a Resume Template</h2>
          <p>Select an ATS-optimized professional template to start editing your resume.</p>
        </div>

        <div className="quick-options">
          <input
            type="file"
            ref={resumeFileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.docx,.doc,.txt,.json,.html"
            onChange={handleResumeFileUpload}
          />
          <button
            className="secondary-action-btn"
            onClick={() => resumeFileInputRef.current?.click()}
            title="Upload existing resume file"
          >
            <HiOutlineDocumentArrowUp /> Upload & Re-template
          </button>
          <button
            className="primary-action-btn"
            onClick={() => setFullScreenEditorTemplate(blankTemplate)}
          >
            <HiOutlinePlus /> Blank Custom Resume
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="templates-filter-bar">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="templates-search-input-box">
          <HiOutlineMagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Search templates by role or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-image-box">
              <img src={template.image} alt={template.name} className="template-preview-img" />
              
              {/* Badge Overlay */}
              <div className={`template-tag ${template.tagClass}`}>
                {template.tag}
              </div>

              <div className="ats-score-pill">
                <HiOutlineShieldCheck /> ATS {template.atsScore}
              </div>

              {/* Hover Actions Overlay */}
              <div className="template-hover-overlay">
                <button
                  className="preview-btn"
                  onClick={() => {
                    setPreviewTemplate(template);
                    setActiveThemeColor(template.accentColors[0]);
                    if (template.initialData) {
                      setSampleData({
                        name: template.initialData.fullName,
                        title: template.initialData.jobTitle,
                        email: template.initialData.email,
                        phone: template.initialData.phone,
                        location: template.initialData.address,
                        summary: template.initialData.summary,
                        skills: template.initialData.skills,
                        experience: template.initialData.experiences
                      });
                    }
                  }}
                >
                  <HiOutlineEye /> Preview & Edit
                </button>
                <button
                  className="use-btn"
                  onClick={() => {
                    setFullScreenEditorTemplate(template);
                  }}
                >
                  <HiOutlineCheck /> Use This Template
                </button>
              </div>
            </div>

            <div className="template-info">
              <div className="template-title-row">
                <h4>{template.name}</h4>
              </div>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="template-modal-backdrop" onClick={() => setPreviewTemplate(null)}>
          <div className="template-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>{previewTemplate.name}</h3>
                <span className="modal-ats-badge"><HiOutlineShieldCheck /> ATS Match {previewTemplate.atsScore}</span>
              </div>

              {/* Theme Color Selector */}
              <div className="color-picker-group">
                <span>Color Accent:</span>
                <div className="color-dots">
                  {previewTemplate.accentColors.map((color) => (
                    <button
                      key={color}
                      className={`color-dot ${activeThemeColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setActiveThemeColor(color)}
                      title={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <button className="modal-close-btn" onClick={() => setPreviewTemplate(null)}>
                <HiXMark />
              </button>
            </div>

            <div className="modal-body">
              {/* Left Live Interactive Resume Document Mockup */}
              <div className="resume-paper-preview" style={{ '--accent-color': activeThemeColor }}>
                <div className="paper-header" style={{ borderLeftColor: activeThemeColor }}>
                  <h1 style={{ color: activeThemeColor }}>{sampleData.name}</h1>
                  <p className="paper-job-title">{sampleData.title}</p>
                  <div className="paper-contact-row">
                    <span>{sampleData.email}</span> • <span>{sampleData.phone}</span> • <span>{sampleData.location}</span>
                  </div>
                </div>

                <div className="paper-section">
                  <h4 style={{ color: activeThemeColor, borderBottomColor: activeThemeColor }}>Professional Summary</h4>
                  <p className="paper-text">{sampleData.summary}</p>
                </div>

                <div className="paper-section">
                  <h4 style={{ color: activeThemeColor, borderBottomColor: activeThemeColor }}>Core Technical Skills</h4>
                  <div className="paper-skills-wrap">
                    {sampleData.skills.map((skill) => (
                      <span key={skill} className="paper-skill-chip" style={{ borderColor: activeThemeColor }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="paper-section">
                  <h4 style={{ color: activeThemeColor, borderBottomColor: activeThemeColor }}>Work Experience</h4>
                  {sampleData.experience.map((exp, idx) => (
                    <div key={idx} className="paper-exp-item">
                      <div className="exp-head">
                        <strong>{exp.role || exp.title}</strong>
                        <span className="exp-period">{exp.period}</span>
                      </div>
                      <span className="exp-company">{exp.company}</span>
                      <p className="exp-desc">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Customization Quick Fields */}
              <div className="resume-quick-editor">
                <h4>Quick Customize Draft</h4>

                <div className="input-field-group">
                  <label><HiOutlineUser /> Full Name</label>
                  <input
                    type="text"
                    value={sampleData.name}
                    onChange={(e) => setSampleData({ ...sampleData, name: e.target.value })}
                  />
                </div>

                <div className="input-field-group">
                  <label><HiOutlineBriefcase /> Target Job Title</label>
                  <input
                    type="text"
                    value={sampleData.title}
                    onChange={(e) => setSampleData({ ...sampleData, title: e.target.value })}
                  />
                </div>

                <div className="input-field-group">
                  <label><HiOutlineAcademicCap /> Professional Summary</label>
                  <textarea
                    rows={4}
                    value={sampleData.summary}
                    onChange={(e) => setSampleData({ ...sampleData, summary: e.target.value })}
                  />
                </div>

                <div className="modal-action-bar">
                  <button className="download-pdf-btn">
                    <HiOutlineArrowDownTray /> Export PDF Draft
                  </button>
                  <button
                    className="save-continue-btn"
                    onClick={() => {
                      const updatedTmpl = {
                        ...previewTemplate,
                        initialData: {
                          ...(previewTemplate.initialData || {}),
                          fullName: sampleData.name,
                          jobTitle: sampleData.title,
                          summary: sampleData.summary,
                          experiences: sampleData.experience || previewTemplate.initialData?.experiences,
                          skills: sampleData.skills || previewTemplate.initialData?.skills
                        }
                      };
                      setFullScreenEditorTemplate(updatedTmpl);
                      setPreviewTemplate(null);
                    }}
                  >
                    <HiOutlineSparkles /> Open Full AI Editor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Interactive Editor Overlay */}
      {fullScreenEditorTemplate && (
        <FullResumeEditor
          template={fullScreenEditorTemplate}
          onClose={() => setFullScreenEditorTemplate(null)}
          onSave={handleSaveCustomResume}
        />
      )}
    </div>
  );
};

export default ResumeTemplates;
