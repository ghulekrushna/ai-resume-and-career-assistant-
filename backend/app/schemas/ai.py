from pydantic import BaseModel
from typing import List, Optional

class BulletEnhanceRequest(BaseModel):
    bullet_text: str
    target_role: str

class BulletEnhanceResponse(BaseModel):
    success: bool
    bullets: List[str]

class SummaryGenerateRequest(BaseModel):
    target_role: str
    experience_level: str
    key_skills: str

class SummaryGenerateResponse(BaseModel):
    success: bool
    summary: str

class AtsScanRequest(BaseModel):
    resume_text: str
    job_description: str

class AtsScanResponse(BaseModel):
    success: bool
    overall_score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    recommendations: List[str]

class InterviewEvalRequest(BaseModel):
    question: str
    user_answer: str

class InterviewEvalResponse(BaseModel):
    success: bool
    overall_score: int
    clarity_score: int
    relevance_score: int
    star_structure_match: int
    strengths: List[str]
    improvements: List[str]
