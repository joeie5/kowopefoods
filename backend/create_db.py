from database import engine, Base
from models.product import Product, Category
from models.all_others import Order, Review, BlogPost, CMSSection, Testimonial, NewsletterSubscriber, Admin

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()
