"""
Separate import route - mounted in main.py
POST /admin/products/import
Accepts { rows: [...] } JSON
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.product import Product, Category
from models.all_others import Testimonial
from utils.dependencies import get_current_admin
from typing import Any, Dict
import re

router = APIRouter()

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def make_unique_slug(base: str, existing_slugs: set) -> str:
    slug, counter = base, 1
    while slug in existing_slugs:
        slug = f"{base}-{counter}"
        counter += 1
    existing_slugs.add(slug)
    return slug

def make_unique_sku(base: str, existing_skus: set) -> str:
    sku, counter = base, 1
    while sku in existing_skus:
        sku = f"{base}-{counter}"
        counter += 1
    existing_skus.add(sku)
    return sku

def col(row: dict, *keys):
    for k in keys:
        for rk in row:
            if str(rk).strip().lower() == k.lower():
                v = row[rk]
                return str(v).strip() if v not in (None, '') else ''
    return ''

@router.post("/admin/products/import")
def admin_import_products(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    rows = payload.get("rows", [])
    if not rows:
        raise HTTPException(status_code=400, detail="No rows provided")

    # Category lookup by name
    all_categories = db.query(Category).all()
    cat_map = {c.name.lower().strip(): c.id for c in all_categories}

    results, created, skipped = [], 0, 0
    # Performance optimization: Pre-fetch existing slugs and SKUs
    existing_slugs = {p.slug for p in db.query(Product.slug).all()}
    existing_skus = {p.sku for p in db.query(Product.sku).all()}

    for i, row in enumerate(rows):
        name = col(row, 'name', 'product name', 'productname', 'title')
        if not name:
            results.append({"row": i+1, "status": "skipped", "reason": "Missing name"})
            skipped += 1
            continue

        raw_price = col(row, 'salepriceextax', 'price', 'saleprice', 'unitprice', 'cost', 'sale_price')
        try:
            price = round(float(raw_price), 2) if raw_price else 0.0
        except ValueError:
            price = 0.0

        cat_name = col(row, 'categoryid', 'category', 'category_name', 'categoryname')
        category_id = cat_map.get(cat_name.lower().strip()) if cat_name else None

        barcode = col(row, 'barcode', 'sku', 'code', 'ean', 'upc')
        base_sku = barcode if barcode else f"KWP-{slugify(name)[:16].upper()}"
        sku = make_unique_sku(base_sku, existing_skus)

        description = col(row, 'description', 'shortdescription', 'short_description', 'desc', 'notes')
        raw_stock = col(row, 'stock', 'stockquantity', 'quantity', 'qty', 'inventory')
        try:
            stock = int(float(raw_stock)) if raw_stock else 0
        except ValueError:
            stock = 0

        slug = make_unique_slug(slugify(name), existing_slugs)

        product = Product(
            name=name[:250] if len(name) > 250 else name,
            slug=slug,
            short_description=description[:497] + "..." if description and len(description) > 500 else (description or f"Quality {name} from Kowope Foods."),
            full_description_html=f"<p>{description}</p>" if description else "",
            price=price,
            sale_price=price,
            sku=sku[:45] if len(sku) > 45 else sku,
            stock_quantity=stock,
            weight_grams=500,
            country_of_origin="Nigeria",
            is_featured=False,
            is_new_arrival=True,
            is_best_seller=False,
            is_active=True,
            dietary_tags=[],
            images=[],
            variants=[],
            category_id=category_id,
        )
        db.add(product)
        results.append({
            "row": i + 1,
            "status": "created",
            "name": name,
            "sku": sku,
            "category": cat_name or "Uncategorised",
            "price": price
        })
        created += 1

    db.commit()
    return {
        "total": len(rows),
        "created": created,
        "skipped": skipped,
        "results": results
    }

@router.post("/admin/categories/import")
def admin_import_categories(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    rows = payload.get("rows", [])
    if not rows:
        raise HTTPException(status_code=400, detail="No rows provided")

    # Pre-fetch existing slugs
    existing_slugs = {c.slug for c in db.query(Category.slug).all()}

    results, created, skipped = [], 0, 0
    for i, row in enumerate(rows):
        name = col(row, 'name', 'category name', 'categoryname')
        if not name:
            results.append({"row": i+1, "status": "skipped", "reason": "Missing Name"})
            skipped += 1
            continue
        
        base_slug = col(row, 'slug') or slugify(name)
        slug = base_slug
        counter = 1
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        existing_slugs.add(slug)

        cat = Category(
            name=name,
            slug=slug,
            description=col(row, 'description', 'desc'),
            image_url=col(row, 'image_url', 'image', 'img'),
            display_order=int(col(row, 'display_order', 'order') or 0),
            is_active=True
        )
        db.add(cat)
        results.append({"row": i+1, "status": "created", "name": name})
        created += 1
    
    db.commit()
    return {"total": len(rows), "created": created, "skipped": skipped, "results": results}

@router.post("/admin/testimonials/import")
def admin_import_testimonials(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    rows = payload.get("rows", [])
    if not rows:
        raise HTTPException(status_code=400, detail="No rows provided")

    results, created, skipped = [], 0, 0
    for i, row in enumerate(rows):
        name = col(row, 'reviewer_name', 'name', 'customer name', 'reviewer')
        comment = col(row, 'comment', 'review', 'text', 'message')
        if not name or not comment:
            results.append({"row": i+1, "status": "skipped", "reason": "Missing Name or Comment"})
            skipped += 1
            continue
        
        t = Testimonial(
            reviewer_name=name,
            comment=comment,
            location=col(row, 'location', 'city', 'country'),
            rating=int(col(row, 'rating', 'stars') or 5),
            avatar_url=col(row, 'avatar_url', 'avatar', 'img'),
            is_active=True,
            display_order=int(col(row, 'display_order', 'order') or 0)
        )
        db.add(t)
        results.append({"row": i+1, "status": "created", "name": name})
        created += 1
    
    db.commit()
    return {"total": len(rows), "created": created, "skipped": skipped, "results": results}
