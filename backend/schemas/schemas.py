from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    banner_image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None
    slug: Optional[str] = None

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    slug: str
    short_description: Optional[str] = None
    full_description_html: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    sku: str
    stock_quantity: int = 0
    weight_grams: Optional[int] = 500
    country_of_origin: Optional[str] = "Nigeria"
    is_featured: bool = False
    is_new_arrival: bool = True
    is_best_seller: bool = False
    is_active: bool = True
    dietary_tags: List[str] = []
    images: List[str] = []
    variants: List[Dict[str, Any]] = []
    category_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None

class Product(ProductBase):
    id: int
    rating_average: float = 0.0
    review_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# CMS Schemas
class CMSSectionBase(BaseModel):
    section_key: str
    data: Dict[str, Any]

class CMSSection(CMSSectionBase):
    id: int
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Order Schemas
class OrderItem(BaseModel):
    product_id: int
    name: str
    price: float
    qty: int
    image_url: str

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    delivery_address: Dict[str, Any]
    delivery_method: str
    items: List[OrderItem]
    promo_code: Optional[str] = None

class Order(BaseModel):
    id: int
    order_reference: str
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: Dict[str, Any]
    items: List[Dict[str, Any]]
    subtotal: float
    delivery_fee: float
    total: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Blog Schemas
class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content_html: Optional[str] = None
    category_tag: Optional[str] = None
    featured_image_url: Optional[str] = None
    is_published: bool = False
    published_at: Optional[datetime] = None

class BlogPost(BlogPostCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialCreate(BaseModel):
    reviewer_name: str
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    rating: int = 5
    comment: str
    display_order: int = 0
    is_active: bool = True

class Testimonial(TestimonialCreate):
    id: int
    class Config:
        from_attributes = True

# Auth Schemas
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# NavLink Schemas
class NavLinkBase(BaseModel):
    name: str
    path: str
    display_order: int = 0
    is_active: bool = True

class NavLinkCreate(NavLinkBase):
    pass

class NavLinkUpdate(NavLinkBase):
    name: Optional[str] = None
    path: Optional[str] = None

class NavLink(NavLinkBase):
    id: int
    class Config:
        from_attributes = True

