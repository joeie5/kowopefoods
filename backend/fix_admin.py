import os
import sys
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

# Add backend to path for imports
sys.path.append(os.path.abspath(os.curdir))

from database import SessionLocal
from models.product import Product, Category
from models.all_others import Admin, Order, Review, BlogPost, CMSSection, Testimonial, NewsletterSubscriber
from utils.auth import get_password_hash, verify_password

def check_and_fix():
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == "admin").first()
        if not admin:
            print("Admin not found! Seeding now...")
            admin = Admin(
                username="admin",
                email="admin@kowopefoods.com",
                hashed_password=get_password_hash("admin123"),
                is_superadmin=True
            )
            db.add(admin)
            db.commit()
            print("Admin created with password 'admin123'")
        else:
            print(f"Found Admin: {admin.username} / {admin.email}")
            print(f"Current hash: {admin.hashed_password}")
            
            # Check if it matches admin123
            if verify_password("admin123", admin.hashed_password):
                print("Password 'admin123' MATCHES the hash.")
            else:
                print("Password 'admin123' DOES NOT match the hash. Resetting now...")
                admin.hashed_password = get_password_hash("admin123")
                db.commit()
                print("Password reset to 'admin123'")

    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_and_fix()
