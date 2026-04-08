import sys
import os
sys.path.append(os.getcwd())

from database import SessionLocal
import models.product
import models.all_others
from models.all_others import CMSSection

def run():
    print("Force initializing site settings...")
    db = SessionLocal()
    try:
        data = {
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
        
        section = db.query(CMSSection).filter(CMSSection.section_key == "site_settings").first()
        if section:
            print("Updating existing site_settings...")
            section.data = data
        else:
            print("Creating new site_settings...")
            section = CMSSection(section_key="site_settings", data=data)
            db.add(section)
        
        db.commit()
        print("Success!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    run()
