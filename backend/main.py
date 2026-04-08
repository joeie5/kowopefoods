import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kowope Foods API", version="1.0.0")

# Static files for uploads
os.makedirs("uploads", exist_ok=True)
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

import routers.public as public
import routers.admin as admin
import routers.import_products as import_products

app.include_router(public.router, prefix="/api", tags=["Public"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])
app.include_router(import_products.router, prefix="/api", tags=["Admin"])
