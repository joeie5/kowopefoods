import os
import uuid
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # Use service key for bypass RLS if needed, or anon key if bucket is public
BUCKET_NAME = "uploads"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def upload_to_supabase(file_content: bytes, filename: str, content_type: str):
    """
    Uploads a file to Supabase Storage and returns the public URL.
    """
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
