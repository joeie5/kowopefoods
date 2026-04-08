import os
import json
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env")
    exit(1)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def run():
    print("Initializing Supabase Site Settings...")
    engine = create_engine(DATABASE_URL)
    
    settings_data = {
        "site_name": "Kowope Foods",
        "footer_description": "The premium online destination for the African diaspora. Sourcing the finest groceries, fashion, and beauty products directly from the motherland.",
        "social_links": {
            "instagram": "https://instagram.com/kowopefoods",
            "facebook": "https://facebook.com/kowopefoods",
            "twitter": "https://twitter.com/kowopefoods"
        },
        "contact_info": {
            "address": "123 African High Street, London, United Kingdom",
            "email": "hello@kowopefoods.com",
            "phone": "+44 20 1234 5678"
        },
        "copyright": "2025 Kowope Foods. All rights reserved."
    }
    
    data_json = json.dumps(settings_data)
    
    with engine.connect() as conn:
        print("Upserting site_settings...")
        conn.execute(
            text("""
                INSERT INTO cms_sections (section_key, data)
                VALUES ('site_settings', :data)
                ON CONFLICT (section_key)
                DO UPDATE SET data = :data, updated_at = NOW()
            """),
            {"data": data_json}
        )
        conn.commit()
    print("Done!")

if __name__ == "__main__":
    run()
