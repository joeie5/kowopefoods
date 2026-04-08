from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    banner_image_url = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    slug = Column(String(255), unique=True, index=True)
    short_description = Column(String(500))
    full_description_html = Column(Text)
    price = Column(Float)
    sale_price = Column(Float, nullable=True)
    sku = Column(String(50), unique=True, index=True)
    stock_quantity = Column(Integer, default=0)
    weight_grams = Column(Integer)
    country_of_origin = Column(String(100))
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=True)
    is_best_seller = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    dietary_tags = Column(JSON, default=[]) # e.g. ["Vegan", "Halal"]
    images = Column(JSON, default=[]) # List of Cloudinary URLs
    variants = Column(JSON, default=[]) # e.g. [{"label": "500g", "price_modifier": 0}]
    rating_average = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")
    
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
