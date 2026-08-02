from fastapi import APIRouter
from app.schemas.ai import (
    BulletEnhanceRequest, BulletEnhanceResponse,
    SummaryGenerateRequest, SummaryGenerateResponse,
    AtsScanRequest, AtsScanResponse,
    InterviewEvalRequest, InterviewEvalResponse
)
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/enhance-bullet", response_model=BulletEnhanceResponse)
async def enhance_bullet(payload: BulletEnhanceRequest):
    bullets = await ai_service.enhance_bullet_points(
        bullet_text=payload.bullet_text,
        target_role=payload.target_role
    )
    return BulletEnhanceResponse(success=True, bullets=bullets)

@router.post("/generate-summary", response_model=SummaryGenerateResponse)
async def generate_summary(payload: SummaryGenerateRequest):
    summary = await ai_service.generate_summary(
        target_role=payload.target_role,
        experience_level=payload.experience_level,
        key_skills=payload.key_skills
    )
    return SummaryGenerateResponse(success=True, summary=summary)

@router.post("/ats-scan", response_model=AtsScanResponse)
async def ats_scan(payload: AtsScanRequest):
    scan_result = await ai_service.scan_ats_compatibility(
        resume_text=payload.resume_text,
        job_description=payload.job_description
    )
    return AtsScanResponse(success=True, **scan_result)

@router.post("/interview-eval", response_model=InterviewEvalResponse)
async def interview_eval(payload: InterviewEvalRequest):
    return InterviewEvalResponse(
        success=True,
        overall_score=88,
        clarity_score=90,
        relevance_score=92,
        star_structure_match=85,
        strengths=[
          "Strong data-backed resolution described clearly.",
          "Good emphasis on cross-functional collaboration."
        ],
        improvements=[
          "Quantify the final outcome with clear metrics (e.g. % improvement in delivery time).",
          "Summarize the key takeaway in 1 sentence at the end."
        ]
    )
