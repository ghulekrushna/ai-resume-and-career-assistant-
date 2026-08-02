from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class AtsScan(Base):
    __tablename__ = "ats_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_description = Column(Text, nullable=False)
    score = Column(Integer, nullable=False)
    matched_keywords_json = Column(Text, nullable=True)
    missing_keywords_json = Column(Text, nullable=True)
    scanned_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="scans")
