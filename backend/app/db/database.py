from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Setup SQLAlchemy engine with automatic fallback for Render deployment
db_url = settings.DATABASE_URL or "sqlite:///./sql_app.db"

try:
    connect_args = {"check_same_thread": False} if "sqlite" in db_url.lower() else {}
    engine = create_engine(db_url, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception:
    # Safe fallback if DATABASE_URL fails to parse or fails connection
    db_url = "sqlite:///./sql_app.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

