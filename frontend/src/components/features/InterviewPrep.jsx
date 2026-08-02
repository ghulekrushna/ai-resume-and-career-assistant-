import React, { useState } from 'react';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
  HiOutlinePlay,
  HiOutlineMicrophone,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
  HiOutlineAcademicCap,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import './InterviewPrep.css';

const InterviewPrep = () => {
  const [selectedCategory, setSelectedCategory] = useState('behavioral'); // 'behavioral', 'system-design', 'technical'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const mockQuestions = {
    behavioral: [
      {
        id: 'b-1',
        title: 'STAR Method: Conflict & Problem Solving',
        question: 'Tell me about a time when you faced a major technical disagreement with a teammate or stakeholder. How did you resolve it?',
        tips: 'Structure using Situation, Task, Action, Result. Focus on empathy, data-driven reasoning, and collaborative resolution.'
      },
      {
        id: 'b-2',
        title: 'Project Failure & Learning',
        question: 'Describe a situation where a project or deployment failed. What went wrong and what steps did you take to mitigate future occurrences?',
        tips: 'Be honest about the root cause, emphasize blameless post-mortem analysis, and detail permanent process improvements.'
      }
    ],
    'system-design': [
      {
        id: 'sd-1',
        title: 'Scalable Architecture: Rate Limiter',
        question: 'How would you design a distributed API rate limiter that handles 100k requests per second across multiple regions?',
        tips: 'Discuss algorithms (Token Bucket, Sliding Window Log), Redis caching, latency trade-offs, and horizontal scalability.'
      }
    ],
    technical: [
      {
        id: 't-1',
        title: 'React & Virtual DOM Performance',
        question: 'Explain how React’s reconciliation algorithm and Virtual DOM diffing work under the hood, and how to prevent unnecessary re-renders.',
        tips: 'Mention fiber nodes, key props, useMemo/useCallback, and batching state updates.'
      }
    ]
  };

  const activeQuestionsList = mockQuestions[selectedCategory] || mockQuestions.behavioral;
  const currentQuestion = activeQuestionsList[currentQuestionIndex] || activeQuestionsList[0];

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      setEvaluationResult({
        overallScore: 88,
        clarityScore: 90,
        relevanceScore: 92,
        starStructureMatch: 85,
        strengths: [
          'Strong data-backed resolution described clearly.',
          'Good emphasis on cross-functional collaboration.'
        ],
        improvements: [
          'Quantify the final outcome more metrics-driven (e.g., % improvement in delivery time).',
          'Summarize the key takeaway in 1 sentence at the end.'
        ],
        modelAnswerSample: 'In my previous role at TechCorp, our frontend team disagreed on whether to refactor a legacy Redux store to React Context. I organized a benchmark spike testing both approaches on load times and bundle sizes. Data proved Context reduced bundle overhead by 18%, convincing stakeholders and resulting in smooth migration.'
      });
      setIsEvaluating(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    setEvaluationResult(null);
    setUserAnswer('');
    if (currentQuestionIndex < activeQuestionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  return (
    <div className="interview-prep-container fade-in">
      <div className="view-header">
        <div>
          <h2><HiOutlineChatBubbleLeftRight className="icon-chat" /> AI Mock Interview Simulator</h2>
          <p>Practice role-specific interview questions with instant STAR-method AI feedback and scoring.</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="prep-categories">
        <button
          className={`prep-cat-btn ${selectedCategory === 'behavioral' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('behavioral'); setCurrentQuestionIndex(0); setEvaluationResult(null); }}
        >
          🎭 Behavioral (STAR Method)
        </button>
        <button
          className={`prep-cat-btn ${selectedCategory === 'system-design' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('system-design'); setCurrentQuestionIndex(0); setEvaluationResult(null); }}
        >
          📐 System Design Architecture
        </button>
        <button
          className={`prep-cat-btn ${selectedCategory === 'technical' ? 'active' : ''}`}
          onClick={() => { setSelectedCategory('technical'); setCurrentQuestionIndex(0); setEvaluationResult(null); }}
        >
          💻 Technical & Coding Concepts
        </button>
      </div>

      <div className="interview-grid">
        {/* Left Side: Question & User Input */}
        <div className="interview-card question-box">
          <div className="question-header">
            <span className="question-step-tag">Question #{currentQuestionIndex + 1} of {activeQuestionsList.length}</span>
            <span className="cat-tag">{currentQuestion.title}</span>
          </div>

          <h3 className="prompt-text">"{currentQuestion.question}"</h3>

          <div className="tips-banner">
            <HiOutlineLightBulb className="tip-icon" />
            <p><strong>AI Tip:</strong> {currentQuestion.tips}</p>
          </div>

          <div className="form-group">
            <label>Your Practice Answer (Type or speak your STAR response)</label>
            <textarea
              rows={7}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer: Situation -> Task -> Action -> Result..."
            />
          </div>

          <div className="action-row">
            <button
              className="icon-btn-secondary"
              onClick={() => setUserAnswer('Situation: In my last project, our deployment pipeline was failing under load. Task: I was tasked with investigating root cause. Action: I implemented Redis caching and query indexing. Result: Reduced API error rates by 99%.')}
            >
              <HiOutlineSparkles /> Fill Sample Answer
            </button>

            <button
              className="primary-action-btn eval-btn"
              onClick={handleEvaluateAnswer}
              disabled={isEvaluating || !userAnswer.trim()}
            >
              {isEvaluating ? (
                <>
                  <HiOutlineArrowPath className="spinning" /> AI Scoring...
                </>
              ) : (
                <>
                  <HiOutlineSparkles /> Submit & Get AI Feedback
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: AI Feedback & Metrics */}
        <div className="interview-card feedback-box">
          <h3><HiOutlineAcademicCap /> AI Evaluation & STAR Score</h3>

          {!evaluationResult ? (
            <div className="empty-prep-state">
              <HiOutlineChatBubbleLeftRight className="empty-icon" />
              <p>Type your response on the left and click "Submit & Get AI Feedback".</p>
            </div>
          ) : (
            <div className="eval-results-content fade-in">
              <div className="eval-score-card">
                <div className="eval-score-ring">
                  <span className="score-num">{evaluationResult.overallScore}%</span>
                </div>
                <div>
                  <h4>STAR Answer Rating</h4>
                  <p className="sub-text">Strong structure & technical depth demonstrated.</p>
                </div>
              </div>

              <div className="eval-metrics">
                <div className="m-item">
                  <span>Answer Clarity</span>
                  <strong>{evaluationResult.clarityScore}%</strong>
                </div>
                <div className="m-item">
                  <span>Relevance</span>
                  <strong>{evaluationResult.relevanceScore}%</strong>
                </div>
                <div className="m-item">
                  <span>STAR Alignment</span>
                  <strong>{evaluationResult.starStructureMatch}%</strong>
                </div>
              </div>

              <div className="feedback-bullets">
                <h4>Key Strengths</h4>
                <ul>
                  {evaluationResult.strengths.map((s, i) => (
                    <li key={i} className="strength-item">✓ {s}</li>
                  ))}
                </ul>

                <h4>Growth Opportunities</h4>
                <ul>
                  {evaluationResult.improvements.map((imp, i) => (
                    <li key={i} className="improve-item">💡 {imp}</li>
                  ))}
                </ul>
              </div>

              <button className="primary-action-btn next-q-btn" onClick={handleNextQuestion}>
                Next Practice Question <HiOutlineArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
