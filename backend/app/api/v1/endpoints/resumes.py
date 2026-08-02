from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse

router = APIRouter()

@router.get("/", response_model=List[ResumeResponse])
def get_resumes(user_id: int = 1, db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    return resumes

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(resume_in: ResumeCreate, user_id: int = 1, db: Session = Depends(get_db)):
    new_resume = Resume(
        user_id=user_id,
        title=resume_in.title,
        template_id=resume_in.template_id,
        content_json=resume_in.content_json,
        ats_score=resume_in.ats_score
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return None
