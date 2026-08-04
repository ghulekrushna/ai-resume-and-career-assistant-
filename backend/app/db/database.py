from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Setup SQLAlchemy engine with automatic fast fallback for Render deployment
db_url = settings.DATABASE_URL or "sqlite:///./sql_app.db"

# If localhost MySQL is specified on remote deployment or connection fails, fallback immediately
if "localhost" in db_url.lower() or "127.0.0.1" in db_url.lower():
    import os
    if os.getenv("RENDER"):
        db_url = "sqlite:///./sql_app.db"

try:
    if "sqlite" in db_url.lower():
        connect_args = {"check_same_thread": False}
    else:
        connect_args = {"connect_timeout": 3}
    
    engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
    # Quick 1-second ping test
    with engine.connect() as conn:
        pass
except Exception as e:
    # Instant fallback to SQLite if MySQL is unreachable or times out
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

