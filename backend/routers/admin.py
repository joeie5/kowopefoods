from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
import shutil
import os
import uuid
from sqlalchemy.orm import Session
from database import get_db
from models.all_others import Admin, CMSSection, BlogPost, Testimonial, NewsletterSubscriber, Order, NavLink
from models.product import Product, Category
import schemas.schemas as schemas
from utils.auth import verify_password, create_access_token, get_password_hash
from utils.dependencies import get_current_admin
from typing import List, Optional, Any, Dict
from datetime import datetime
import re

router = APIRouter()

from sqlalchemy import or_

@router.post("/auth/login", response_model=schemas.Token)
def login(form_data: schemas.AdminLogin, db: Session = Depends(get_db)):
    print(f"DEBUG LOGIN: Attempt for username='{form_data.username}'")
    admin = db.query(Admin).filter(
        or_(
            Admin.username == form_data.username,
            Admin.email == form_data.username
        )
    ).first()
    
    if not admin:
        print(f"DEBUG LOGIN: User '{form_data.username}' NOT found in DB")
    else:
        is_match = verify_password(form_data.password, admin.hashed_password)
        print(f"DEBUG LOGIN: User '{form_data.username}' found. Password match: {is_match}")
        
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me")
def read_admin_me(current_admin: Admin = Depends(get_current_admin)):
    return {"username": current_admin.username, "email": current_admin.email}

from utils.storage import upload_to_supabase

@router.post("/admin/upload")
async def upload_image(
    file: UploadFile = File(...), 
    current_admin: Admin = Depends(get_current_admin)
):
    print(f"DEBUG: Starting upload for {file.filename} by {current_admin.username}")
    try:
        # Read file content
        contents = await file.read()
        
        # Upload to Supabase Storage
        url = await upload_to_supabase(contents, file.filename, file.content_type)
            
        print(f"DEBUG: Returning URL: {url}")
        return {"url": url}
    except Exception as e:
        print(f"DEBUG: UPLOAD FAILED: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# --- Admin Products CRUD ---
@router.get("/admin/products", response_model=List[schemas.Product])
def admin_read_products(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return db.query(Product).order_by(Product.created_at.desc()).all()

@router.post("/admin/products", response_model=schemas.Product)
def admin_create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/admin/products/{product_id}", response_model=schemas.Product)
def admin_update_product(product_id: int, product_data: schemas.ProductUpdate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/admin/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}

# --- Admin CMS ---
@router.put("/admin/cms/{section_key}", response_model=schemas.CMSSection)
def update_cms_section(section_key: str, data: schemas.CMSSectionBase, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    section = db.query(CMSSection).filter(CMSSection.section_key == section_key).first()
    if not section:
        section = CMSSection(section_key=section_key, data=data.data)
        db.add(section)
    else:
        section.data = data.data
    db.commit()
    db.refresh(section)
    return section

# --- Admin Categories CRUD ---
@router.get("/admin/categories", response_model=List[schemas.Category])
def admin_read_categories(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return db.query(Category).order_by(Category.display_order).all()

@router.post("/admin/categories", response_model=schemas.Category)
def admin_create_category(cat: schemas.CategoryCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_cat = Category(**cat.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.put("/admin/categories/{cat_id}", response_model=schemas.Category)
def admin_update_category(cat_id: int, cat_data: schemas.CategoryUpdate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_cat = db.query(Category).filter(Category.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in cat_data.dict(exclude_unset=True).items():
        setattr(db_cat, key, value)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.delete("/admin/categories/{cat_id}")
def admin_delete_category(cat_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_cat = db.query(Category).filter(Category.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted"}

# --- Admin Blog CRUD ---
@router.get("/admin/blog", response_model=List[schemas.BlogPost])
def admin_read_blog(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()

@router.post("/admin/blog", response_model=schemas.BlogPost)
def admin_create_post(post: schemas.BlogPostCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_post = BlogPost(**post.dict())
    if db_post.is_published and not db_post.published_at:
        db_post.published_at = datetime.utcnow()
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.put("/admin/blog/{post_id}", response_model=schemas.BlogPost)
def admin_update_post(post_id: int, post: schemas.BlogPostCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in post.dict(exclude_unset=True).items():
        setattr(db_post, key, value)
    if db_post.is_published and not db_post.published_at:
        db_post.published_at = datetime.utcnow()
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/admin/blog/{post_id}")
def admin_delete_post(post_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted"}

# --- Admin Testimonials CRUD ---
@router.get("/admin/testimonials", response_model=List[schemas.Testimonial])
def admin_read_testimonials(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return db.query(Testimonial).order_by(Testimonial.display_order).all()

@router.post("/admin/testimonials", response_model=schemas.Testimonial)
def admin_create_testimonial(t: schemas.TestimonialCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_t = Testimonial(**t.dict())
    db.add(db_t)
    db.commit()
    db.refresh(db_t)
    return db_t

@router.put("/admin/testimonials/{t_id}", response_model=schemas.Testimonial)
def admin_update_testimonial(t_id: int, t: schemas.TestimonialCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_t = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for key, value in t.dict(exclude_unset=True).items():
        setattr(db_t, key, value)
    db.commit()
    db.refresh(db_t)
    return db_t

@router.delete("/admin/testimonials/{t_id}")
def admin_delete_testimonial(t_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_t = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_t)
    db.commit()
    return {"message": "Testimonial deleted"}

# --- Admin Newsletter ---
@router.get("/admin/newsletter")
def admin_read_newsletter(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    subs = db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.subscribed_at.desc()).all()
    return [{"id": s.id, "email": s.email, "subscribed_at": s.subscribed_at} for s in subs]

@router.delete("/admin/newsletter/{sub_id}")
def admin_delete_subscriber(sub_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    db.delete(sub)
    db.commit()
    return {"message": "Subscriber removed"}

# --- Admin Navigation CRUD ---
@router.get("/admin/nav-links", response_model=List[schemas.NavLink])
def admin_read_navigation(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return db.query(NavLink).order_by(NavLink.display_order).all()

@router.post("/admin/nav-links", response_model=schemas.NavLink)
def admin_create_nav_link(link: schemas.NavLinkCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_link = NavLink(**link.dict())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.put("/admin/nav-links/{link_id}", response_model=schemas.NavLink)
def admin_update_nav_link(link_id: int, link_data: schemas.NavLinkUpdate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_link = db.query(NavLink).filter(NavLink.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Nav link not found")
    for key, value in link_data.dict(exclude_unset=True).items():
        setattr(db_link, key, value)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.delete("/admin/nav-links/{link_id}")
def admin_delete_nav_link(link_id: int, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    db_link = db.query(NavLink).filter(NavLink.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Nav link not found")
    db.delete(db_link)
    db.commit()
    return {"message": "Nav link deleted"}

# --- Admin Orders ---
from pydantic import BaseModel
class OrderStatusUpdate(BaseModel):
    status: str

@router.get("/admin/orders", response_model=List[schemas.Order])
def admin_read_orders(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.put("/admin/orders/{order_id}")
def admin_update_order_status(order_id: int, update: OrderStatusUpdate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = update.status
    db.commit()
    db.refresh(order)
    return order

# --- Admin Stats ---
@router.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    product_count = db.query(Product).count()
    category_count = db.query(Category).count()
    testimonial_count = db.query(Testimonial).count()
    newsletter_count = db.query(NewsletterSubscriber).count()
    
    # Dummy revenue for now until orders are fully integrated
    total_revenue = db.query(Order).filter(Order.status == "paid").count() * 25.0 
    
    return {
        "products": product_count,
        "categories": category_count,
        "testimonials": testimonial_count,
        "newsletter": newsletter_count,
        "revenue": f"£{total_revenue:,.2f}",
        "orders": db.query(Order).count()
    }

# Temp Create Admin Helper (for dev only)
@router.post("/setup/admin", include_in_schema=False)
def create_initial_admin(admin: schemas.AdminLogin, db: Session = Depends(get_db)):
    if db.query(Admin).count() > 0:
        raise HTTPException(status_code=400, detail="Admin already exists")
    db_admin = Admin(
        username=admin.username,
        email="admin@kowopefoods.com",
        hashed_password=get_password_hash(admin.password),
        is_superadmin=True
    )
    db.add(db_admin)
    db.commit()
    return {"message": "Admin created successfully"}


