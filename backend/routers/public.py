from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.product import Product, Category
from models.all_others import CMSSection, NavLink, Order
import schemas.schemas as schemas

router = APIRouter()

# --- Products ---
@router.get("/products", response_model=List[schemas.Product])
def read_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    tags: Optional[str] = None, # Comma separated
    sort: Optional[str] = "newest",
    page: int = 1,
    limit: int = 12,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.join(Category).filter(Category.slug == category)
    
    if min_price:
        query = query.filter(Product.price >= min_price)
    if max_price:
        query = query.filter(Product.price <= max_price)
    
    if tags:
        tag_list = tags.split(",")
        # Simplistic tag filtering for demo
        for tag in tag_list:
            query = query.filter(Product.dietary_tags.contains([tag]))

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "best_rated":
        query = query.order_by(Product.rating_average.desc())
    else: # newest
        query = query.order_by(Product.created_at.desc())

    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()

@router.get("/products/featured", response_model=List[schemas.Product])
def get_featured_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_featured == True, Product.is_active == True).limit(8).all()

@router.get("/products/{slug}", response_model=schemas.Product)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- Categories ---
@router.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.display_order).all()

# --- CMS ---
@router.get("/cms/{section_key}", response_model=schemas.CMSSection)
def get_cms_section(section_key: str, db: Session = Depends(get_db)):
    section = db.query(CMSSection).filter(CMSSection.section_key == section_key).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section

# --- Navigation ---
@router.get("/nav-links", response_model=List[schemas.NavLink])
def get_nav_links(db: Session = Depends(get_db)):
    return db.query(NavLink).filter(NavLink.is_active == True).order_by(NavLink.display_order).all()

# --- Orders ---
import uuid
@router.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Calculate subtotal based on provided items (ideally validate against DB)
    subtotal = sum(item.price * item.qty for item in order.items)
    delivery_fee = 0.0 if subtotal > 50 else 4.99
    total = subtotal + delivery_fee
    
    db_order = Order(
        order_reference=str(uuid.uuid4())[:8].upper(),
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        delivery_address=order.delivery_address,
        delivery_method=order.delivery_method,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=total,
        items=[item.dict() for item in order.items],
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
