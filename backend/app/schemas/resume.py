from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResumeBase(BaseModel):
    title: str
    template_id: Optional[str] = "tmpl-modern"
    content_json: str
    ats_score: Optional[int] = 0

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    template_id: Optional[str] = None
    content_json: Optional[str] = None
    ats_score: Optional[int] = None

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
