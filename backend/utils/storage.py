import os
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") 
BUCKET_NAME = "uploads"

supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("STORAGE: Supabase client initialized successfully.")
    except Exception as e:
        print(f"STORAGE ERROR: Failed to initialize Supabase client: {e}")
else:
    print("STORAGE WARNING: SUPABASE_URL or SUPABASE_SERVICE_KEY missing. Uploads will fail.")

async def upload_to_supabase(file_content: bytes, filename: str, content_type: str):
    """
    Uploads a file to Supabase Storage and returns the public URL.
    """
    if not supabase:
        raise Exception("Supabase storage client not initialized. Check environment variables.")
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{uuid.uuid4()}{ext}"
    
    # Upload to Supabase
    res = supabase.storage.from_(BUCKET_NAME).upload(
        path=unique_filename,
        file=file_content,
        file_options={"content-type": content_type}
    )
    
    # Get Public URL
    # Note: Ensure the bucket 'uploads' is set to public in Supabase dashboard
    url_res = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
    
    return url_res
