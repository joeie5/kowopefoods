import os
import json
from sqlalchemy import create_engine, text
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Load Enviroment
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "uploads"
LOCAL_UPLOADS_DIR = "uploads" # Relative to backend/

# Sanitization (from database.py logic)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
if DATABASE_URL and "supabase.co" in DATABASE_URL and "sslmode=" not in DATABASE_URL:
    DATABASE_URL += ("&" if "?" in DATABASE_URL else "?") + "sslmode=require"

if not all([DATABASE_URL, SUPABASE_URL, SUPABASE_KEY]):
    print("ERROR: Missing one or more environment variables (DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY)")
    exit(1)

# 2. Initialize Clients
engine = create_engine(DATABASE_URL)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_files():
    print("--- STEP 1: UPLOADING FILES ---")
    if not os.path.exists(LOCAL_UPLOADS_DIR):
        print(f"ERROR: Local directory '{LOCAL_UPLOADS_DIR}' not found.")
        return []

    files = [f for f in os.listdir(LOCAL_UPLOADS_DIR) if os.path.isfile(os.path.join(LOCAL_UPLOADS_DIR, f))]
    print(f"Found {len(files)} local files.")

    uploaded_map = {} # filename -> public_url

    for filename in files:
        file_path = os.path.join(LOCAL_UPLOADS_DIR, filename)
        
        try:
            with open(file_path, "rb") as f:
                content = f.read()
            
            print(f"Uploading {filename}...", end=" ")
            
            # Simple content type detection
            ext = os.path.splitext(filename)[1].lower()
            content_type = "image/jpeg" if ext in [".jpg", ".jpeg"] else "image/png" if ext == ".png" else "application/octet-stream"

            # Upload to Supabase (upsert=true)
            supabase.storage.from_(BUCKET_NAME).upload(
                path=filename,
                file=content,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            
            # Get Public URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
            uploaded_map[filename] = public_url
            print("DONE")
            
        except Exception as e:
            print(f"FAILED: {e}")

    return uploaded_map

def update_database(url_map):
    print("\n--- STEP 2: UPDATING DATABASE RECORDS ---")
    if not url_map:
        print("No files were uploaded. Skipping DB update.")
        return

    # Base patterns to replace
    patterns = [
        "http://localhost:9000/uploads/",
        "http://localhost:8000/uploads/",
        "/uploads/",
        "uploads/"
    ]

    with engine.connect() as conn:
        # --- 1. Categories (image_url, banner_image_url) ---
        print("Updating Categories...")
        update_categories(conn, url_map, patterns)
        
        # --- 2. Products (images JSON list) ---
        print("Updating Products...")
        update_products(conn, url_map, patterns)

        # --- 3. Blogs (featured_image_url) ---
        print("Updating Blog Posts...")
        update_blogs(conn, url_map, patterns)

        # --- 4. Testimonials (avatar_url) ---
        print("Updating Testimonials...")
        update_testimonials(conn, url_map, patterns)
        
        conn.commit()
    print("Database updates complete.")

def update_categories(conn, url_map, patterns):
    rows = conn.execute(text("SELECT id, image_url, banner_image_url FROM categories")).fetchall()
    for row in rows:
        id, img, banner = row
        new_img = resolve_url(img, url_map, patterns)
        new_banner = resolve_url(banner, url_map, patterns)
        
        if new_img != img or new_banner != banner:
            conn.execute(
                text("UPDATE categories SET image_url = :img, banner_image_url = :banner WHERE id = :id"),
                {"img": new_img, "banner": new_banner, "id": id}
            )

def update_products(conn, url_map, patterns):
    rows = conn.execute(text("SELECT id, images FROM products")).fetchall()
    for row in rows:
        id, images_json = row
        if not images_json: continue
        
        images_list = images_json if isinstance(images_json, list) else json.loads(images_json)
        updated = False
        new_list = []
        
        for img in images_list:
            new_url = resolve_url(img, url_map, patterns)
            if new_url != img:
                updated = True
            new_list.append(new_url)
        
        if updated:
            conn.execute(
                text("UPDATE products SET images = :images WHERE id = :id"),
                {"images": json.dumps(new_list), "id": id}
            )

def update_blogs(conn, url_map, patterns):
    rows = conn.execute(text("SELECT id, featured_image_url FROM blog_posts")).fetchall()
    for row in rows:
        id, img = row
        new_img = resolve_url(img, url_map, patterns)
        if new_img != img:
            conn.execute(
                text("UPDATE blog_posts SET featured_image_url = :img WHERE id = :id"),
                {"img": new_img, "id": id}
            )

def update_testimonials(conn, url_map, patterns):
    rows = conn.execute(text("SELECT id, avatar_url FROM testimonials")).fetchall()
    for row in rows:
        id, img = row
        new_img = resolve_url(img, url_map, patterns)
        if new_img != img:
            conn.execute(
                text("UPDATE testimonials SET avatar_url = :img WHERE id = :id"),
                {"img": new_img, "id": id}
            )

def resolve_url(old_url, url_map, patterns):
    if not old_url: return old_url
    
    # Extract filename from old URL
    filename = ""
    found = False
    for p in patterns:
        if p in old_url:
            filename = old_url.split(p)[-1]
            found = True
            break
    
    if found and filename in url_map:
        return url_map[filename]
    
    return old_url

if __name__ == "__main__":
    url_map = upload_files()
    update_database(url_map)
    print("\nMigration Script Finished.")
