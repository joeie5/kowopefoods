import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Prioritize DATABASE_URL, then POSTGRES_URL (Vercel), finally fallback to SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or "sqlite:///./kowopefoods.db"

# Mask the URL for safe logging
def get_masked_url(url: str):
    if not url: return "None"
    if "@" in url:
        parts = url.split("@")
        return f"{parts[0].split(':')[0]}://****:****@{parts[1]}"
    return url

print(f"DATABASE: Initializing with {get_masked_url(SQLALCHEMY_DATABASE_URL)}")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Supabase pooler (pgbouncer) settings
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=20,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
