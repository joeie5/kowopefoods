from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
# Import all models to ensure mappers are initialized
from models.product import Category, Product
from models.all_others import Review, BlogPost, CMSSection, Testimonial, NewsletterSubscriber, Admin, NavLink

def init_settings():
    print("Initializing site settings...")
    # Base.metadata.create_all(bind=engine) # Should already exist, but safe to call
    
    db: Session = SessionLocal()
    
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
    
    existing = db.query(CMSSection).filter(CMSSection.section_key == "site_settings").first()
    if existing:
        print("Settings already exist, updating...")
        existing.data = settings_data
    else:
        print("Settings not found, creating...")
        new_section = CMSSection(section_key="site_settings", data=settings_data)
        db.add(new_section)
    
    db.commit()
    db.close()
    print("Done!")

if __name__ == "__main__":
    init_settings()
