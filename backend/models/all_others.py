from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_reference = Column(String(50), unique=True, index=True)
    customer_name = Column(String(255))
    customer_email = Column(String(255))
    customer_phone = Column(String(50))
    delivery_address = Column(JSON) # {address1, address2, city, postcode, country}
    delivery_method = Column(String(100))
    subtotal = Column(Float)
    delivery_fee = Column(Float)
    discount_amount = Column(Float, default=0.0)
    total = Column(Float)
    promo_code = Column(String(50), nullable=True)
    stripe_payment_intent_id = Column(String(255), nullable=True)
    status = Column(String(50), default="pending") # pending/paid/processing/shipped/delivered/cancelled
    items = Column(JSON) # List of {product_id, name, price, qty, image_url}
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    product = relationship("Product", back_populates="reviews")
    reviewer_name = Column(String(255))
    reviewer_location = Column(String(255))
    rating = Column(Integer)
    comment = Column(Text)
    is_verified = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    slug = Column(String(255), unique=True)
    excerpt = Column(String(500))
    content_html = Column(Text)
    category_tag = Column(String(100))
    featured_image_url = Column(String(255))
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CMSSection(Base):
    __tablename__ = "cms_sections"

    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String(100), unique=True, index=True) # e.g. "hero", "about_teaser"
    data = Column(JSON) # Flexible storage for all UI fields
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_name = Column(String(100))
    location = Column(String(100))
    avatar_url = Column(String(255), nullable=True)
    rating = Column(Integer, default=5)
    comment = Column(Text)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    subscribed_at = Column(DateTime(timezone=True), server_default=func.now())

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    is_superadmin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class NavLink(Base):
    __tablename__ = "nav_links"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    path = Column(String(255))
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
