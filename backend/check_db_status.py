from database import SessionLocal
from models.product import Category, Product

db = SessionLocal()
try:
    cats = db.query(Category).all()
    print(f"Categories: {[(c.id, c.name) for c in cats]}")
    featured_count = db.query(Product).filter(Product.is_featured == True).count()
    print(f"Featured Products: {featured_count}")
    total_products = db.query(Product).count()
    print(f"Total Products: {total_products}")
finally:
    db.close()
