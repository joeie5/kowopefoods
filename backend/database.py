import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Prioritize DATABASE_URL, then POSTGRES_URL (Vercel), finally fallback to SQLite
raw_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or "sqlite:///./kowopefoods.db"

def clean_db_url(url: str):
    if not url: return url
    # SQLAlchemy requires postgresql:// instead of postgres://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    # Enforce SSL for Supabase connections on Vercel
    if "supabase.co" in url and "sslmode=" not in url:
        separator = "&" if "?" in url else "?"
        url = f"{url}{separator}sslmode=require"
    return url

SQLALCHEMY_DATABASE_URL = clean_db_url(raw_url)

# Mask the URL for safe logging
def get_masked_url(url: str):
    if not url: return "None"
    try:
        if "@" in url:
            parts = url.split("@")
            prefix = parts[0].split(":")[0]
            host_part = parts[1]
            return f"{prefix}://****:****@{host_part}"
    except:
        pass
    return "Malformed URL"

print(f"DATABASE: Initializing with {get_masked_url(SQLALCHEMY_DATABASE_URL)}")

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Supabase pooler (pgbouncer) settings
    # Optimized for Vercel Serverless: smaller pool, quick recycle
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=60, # Recycle connections more frequently in serverless
        pool_size=5,     # Keep pool small to avoid exhausting DB connections
        max_overflow=10
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
