import traceback
from database import SessionLocal
from models.product import Category

def check():
    print("Checking database connection...")
    try:
        db = SessionLocal()
        cats = db.query(Category).limit(1).all()
        print(f"Success! Found {len(cats)} categories.")
    except Exception as e:
        print("Error connecting to database:")
        traceback.print_exc()
    finally:
        try:
            db.close()
        except:
            pass

if __name__ == "__main__":
    check()
