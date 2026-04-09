import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kowope Foods API", version="1.0.0")

# Static files (Only if they exist, primarily for local dev)
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Kowope Foods API - Premium African Diaspora Ecommerce"}

@app.get("/api/diag/env")
def diag_env():
    """Diagnostic endpoint to check for env var keys (values are hidden for security)."""
    keys = [k for k in os.environ.keys() if any(x in k for x in ["SUPABASE", "DATABASE", "POSTGRES", "STRIPE"])]
    return {
        "found_keys": keys,
        "database_url_present": "DATABASE_URL" in os.environ or "POSTGRES_URL" in os.environ,
        "supabase_url_present": "SUPABASE_URL" in os.environ,
        "note": "If keys are missing, check Vercel Project Settings > Environment Variables and REDEPLOY."
    }

import routers.public as public
import routers.admin as admin
import routers.import_products as import_products

app.include_router(public.router, prefix="/api", tags=["Public"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])
app.include_router(import_products.router, prefix="/api", tags=["Admin"])
