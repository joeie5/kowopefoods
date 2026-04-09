import os
import sys
import traceback

# 1. PATH CONFIGURATION (Must be absolute first)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# 2. ENVIRONMENT LOADING
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
@app.get("/api")
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

# 3. SECURE ROUTER IMPORTS (With pinpoint logging for Vercel troubleshooting)
try:
    print("STARTUP: Importing public router...")
    import routers.public as public
    app.include_router(public.router, prefix="/api", tags=["Public"])
    
    print("STARTUP: Importing admin router...")
    import routers.admin as admin
    app.include_router(admin.router, prefix="/api", tags=["Admin"])
    
    print("STARTUP: Importing product import router...")
    import routers.import_products as import_products
    app.include_router(import_products.router, prefix="/api", tags=["Admin"])
    
    print("STARTUP: All routers loaded successfully.")
except Exception as e:
    print("--- CRITICAL STARTUP ERROR DETECTED ---")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {str(e)}")
    print("Full Traceback:")
    traceback.print_exc()
    print("---------------------------------------")
    # We re-raise to ensure Vercel knows the function failed to start
    raise e

