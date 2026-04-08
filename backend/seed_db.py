from database import SessionLocal, engine, Base
from models.product import Category, Product
from models.all_others import Admin, CMSSection, NavLink
from utils.auth import get_password_hash

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Create Admin
    admin = db.query(Admin).filter(Admin.username == "admin").first()
    if admin:
        admin.hashed_password = get_password_hash("admin123")
    else:
        admin = Admin(
            username="admin",
            email="admin@kowopefoods.com",
            hashed_password=get_password_hash("admin123"),
            is_superadmin=True
        )
        db.add(admin)
    db.commit()
    
    # 2. Create Categories
    categories_data = [
        {"name": "Flours & Grains", "slug": "flours-grains", "display_order": 1},
        {"name": "Spices & Seasonings", "slug": "spices-seasonings", "display_order": 2},
        {"name": "Oils & Sauces", "slug": "oils-sauces", "display_order": 3},
        {"name": "Snacks & Drinks", "slug": "snacks-drinks", "display_order": 4},
        {"name": "Meat & Seafood", "slug": "meat-seafood", "display_order": 5},
        {"name": "Health & Beauty", "slug": "health-beauty", "display_order": 6},
    ]
    
    for cat_data in categories_data:
        if not db.query(Category).filter(Category.slug == cat_data["slug"]).first():
            cat = Category(**cat_data)
            db.add(cat)
    
    db.commit()
    
    # 3. Create CMS Sections
    cms_sections = [
        {
            "section_key": "hero",
            "data": {
                "title": "Authentic African Flavors, Delivered to Your Door",
                "subtitle": "Discover the finest groceries, fashion, and beauty products from across the continent. Curated for the modern African diaspora.",
                "cta_text": "Shop the Collection",
                "cta_link": "/shop",
                "image_url": "/hero-products.png"
            }
        },
        {
            "section_key": "categories_showcase",
            "data": {
                "title": "Browse Our Heritage",
                "subtitle": "From everyday essentials to celebratory treats, find everything you miss from home."
            }
        },
        {
            "section_key": "promo_banner",
            "data": {
                "badge": "Limited Time",
                "title": "🔥 Summer Sale — Up to 40% off all dried goods and staples.",
                "cta_text": "Shop the Sale",
                "cta_link": "/shop",
                "bg_color": "#C9933A"
            }
        },
        {
            "section_key": "about_teaser",
            "data": {
                "tag": "Our Story",
                "heading": "Bringing the Heart of Africa to Your Global Kitchen.",
                "para1": "Growing up, we remember the vibrant markets, the aroma of spices wafting through the air, and the sheer joy of a meal that felt like home. Kowope Foods was born out of that very nostalgia—a mission to bridge the gap for Africans in the diaspora.",
                "para2": "We don't just sell groceries; we deliver heritage. From the finest parboiled rice to hand-picked spices and authentic ingredients, we source everything directly from local African farmers and artisans to ensure your kitchen remains a piece of the motherland.",
                "stat1_value": "5+",
                "stat1_label": "Years Serving",
                "counter1_value": "2,000+",
                "counter1_label": "Happy Customers",
                "counter2_value": "500+",
                "counter2_label": "Authentic Products",
                "cta_text": "Read Our Full Journey",
                "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000"
            }
        },
        {
            "section_key": "testimonials_section",
            "data": {
                "title": "What Our Customers Say",
                "subtitle": "Loved by the African diaspora across the UK and Europe."
            }
        },
        {
            "section_key": "site_settings",
            "data": {
                "site_name": "Kowope Foods",
                "footer_description": "The premium online destination for the African diaspora. Sourcing the finest groceries, fashion, and beauty products directly from the motherland.",
                "social_links": {
                    "instagram": "https://instagram.com/kowopefoods",
                    "facebook": "https://facebook.com/kowopefoods",
                    "twitter": "https://twitter.com/kowopefoods"
                },
                "contact_info": {
                    "address": "123 African High Street, London, United Kingdom",
                    "email": "hello@kowopefoods.com",
                    "phone": "+44 20 1234 5678"
                },
                "copyright": "2025 Kowope Foods. All rights reserved."
            }
        }
    ]
    
    for section in cms_sections:
        existing = db.query(CMSSection).filter(CMSSection.section_key == section["section_key"]).first()
        if existing:
            existing.data = section["data"]
        else:
            db.add(CMSSection(**section))

    db.commit()

    # 3.5 Create Nav Links
    nav_links_data = [
        {"name": "Home", "path": "/", "display_order": 1},
        {"name": "Shop", "path": "/shop", "display_order": 2},
        {"name": "About", "path": "/about", "display_order": 3},
        {"name": "Blog", "path": "/blog", "display_order": 4},
        {"name": "Contact", "path": "/contact", "display_order": 5},
    ]
    for link_data in nav_links_data:
        if not db.query(NavLink).filter(NavLink.path == link_data["path"]).first():
            db.add(NavLink(**link_data))
    
    db.commit()
    
    # 4. Create Sample Product
    cat = db.query(Category).first()
    if cat and not db.query(Product).filter(Product.slug == "premium-cassava-flour").first():
        product = Product(
            name="Premium Cassava Flour (Garri)",
            slug="premium-cassava-flour",
            short_description="Top quality white garri, crunchy and perfect for drinking or eba.",
            full_description_html="<p>Our premium white garri is sourced from the finest cassava tubers, processed with traditional methods to ensure that perfect sour crunch you love. Perfect for both drinking and making firm eba.</p>",
            price=12.99,
            sku="GF-001",
            stock_quantity=50,
            weight_grams=2000,
            country_of_origin="Nigeria",
            category_id=cat.id,
            images=["https://images.unsplash.com/photo-1543083115-638c32cd3d58?q=80&w=600"],
            dietary_tags=["Vegan", "Gluten Free"],
            is_featured=True,
            is_active=True,
            rating_average=4.8,
            review_count=12
        )
        db.add(product)
        db.commit()

    # 5. Add More Products
    cat_grains = db.query(Category).filter(Category.slug == "flours-grains").first()
    if cat_grains:
        if not db.query(Product).filter(Product.slug == "mama-gold-rice").first():
            db.add(Product(
                name="Mama Gold Premium Parboiled Rice",
                slug="mama-gold-rice",
                short_description="Specially processed parboiled rice for that perfect Jollof.",
                full_description_html="<p>Mama Gold Rice is renowned for its low starch content and excellent grain separation. Ideal for Jollof rice, fried rice, or simply served with a rich stew.</p>",
                price=18.99,
                sku="RG-001",
                stock_quantity=100,
                weight_grams=5000,
                country_of_origin="Thailand",
                category_id=cat_grains.id,
                images=["https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600"],
                dietary_tags=["Vegan", "Gluten Free"],
                is_featured=True,
                is_active=True,
                rating_average=4.9,
                review_count=45
            ))
    
    cat_spices = db.query(Category).filter(Category.slug == "spices-seasonings").first()
    if cat_spices:
        if not db.query(Product).filter(Product.slug == "dried-crayfish").first():
            db.add(Product(
                name="Ground Dried Crayfish",
                slug="dried-crayfish",
                short_description="Sun-dried and ground to perfection for an authentic umami boost.",
                full_description_html="<p>Our crayfish are sourced from the coastal waters of Nigeria, sun-dried and ground to provide that essential savory depth to your soups, stews, and native rice dishes.</p>",
                price=6.50,
                sku="SS-001",
                stock_quantity=200,
                weight_grams=250,
                country_of_origin="Nigeria",
                category_id=cat_spices.id,
                images=["https://images.unsplash.com/photo-1599249074747-07e13f567831?q=80&w=600"],
                dietary_tags=["High Protein", "Natural"],
                is_featured=True,
                is_active=True,
                rating_average=4.7,
                review_count=28
            ))
            
    cat_oils = db.query(Category).filter(Category.slug == "oils-sauces").first()
    if cat_oils:
        if not db.query(Product).filter(Product.slug == "premium-red-palm-oil").first():
            db.add(Product(
                name="Premium Red Palm Oil",
                slug="premium-red-palm-oil",
                short_description="Unrefined, cholesterol-free traditional red palm oil.",
                full_description_html="<p>Authentic, unrefined red palm oil perfect for indigenous dishes. High in Vitamin A and E.</p>",
                price=8.99,
                sku="OS-001",
                stock_quantity=150,
                weight_grams=1000,
                country_of_origin="Ghana",
                category_id=cat_oils.id,
                images=["https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?q=80&w=600"],
                dietary_tags=["Vegan", "Keto"],
                is_featured=True,
                is_active=True,
                is_new_arrival=True,
                rating_average=4.9,
                review_count=85
            ))

    cat_snacks = db.query(Category).filter(Category.slug == "snacks-drinks").first()
    if cat_snacks:
        if not db.query(Product).filter(Product.slug == "plantain-chips-spicy").first():
            db.add(Product(
                name="Spicy Plantain Chips",
                slug="plantain-chips-spicy",
                short_description="Crispy, thinly sliced plantains with a kick of chili.",
                full_description_html="<p>The perfect on-the-go snack. Sliced thin and fried to crunchy perfection, dusted with our signature chili blend.</p>",
                price=2.99,
                sale_price=1.99,
                sku="SD-001",
                stock_quantity=300,
                weight_grams=150,
                country_of_origin="Nigeria",
                category_id=cat_snacks.id,
                images=["https://images.unsplash.com/photo-1600850056064-a8b380df8395?q=80&w=600"],
                dietary_tags=["Vegan"],
                is_featured=True,
                is_active=True,
                rating_average=4.5,
                review_count=112
            ))
            
    cat_meat = db.query(Category).filter(Category.slug == "meat-seafood").first()
    if cat_meat:
        if not db.query(Product).filter(Product.slug == "smoked-catfish").first():
            db.add(Product(
                name="Premium Smoked Catfish",
                slug="smoked-catfish",
                short_description="Traditionally wood-smoked catfish, bone-in.",
                full_description_html="<p>Wood-smoked over several days for intense flavor and long preservation.</p>",
                price=14.50,
                sku="MS-001",
                stock_quantity=40,
                weight_grams=500,
                country_of_origin="Senegal",
                category_id=cat_meat.id,
                images=["https://images.unsplash.com/photo-1599084990807-62f4b26002f2?q=80&w=600"],
                dietary_tags=["High Protein"],
                is_featured=True,
                is_active=True,
                rating_average=4.6,
                review_count=34
            ))

    # Add a 7th product to fill up arrays generally
    if cat_grains:
        if not db.query(Product).filter(Product.slug == "honey-beans").first():
            db.add(Product(
                name="Oloyin Honey Beans",
                slug="honey-beans",
                short_description="Naturally sweet Nigerian brown beans.",
                full_description_html="<p>Sweet, fast-cooking brown beans perfect for Ewa Agoyin or Akara.</p>",
                price=9.50,
                sale_price=8.00,
                sku="GF-002",
                stock_quantity=80,
                weight_grams=2000,
                country_of_origin="Nigeria",
                category_id=cat_grains.id,
                images=["https://images.unsplash.com/photo-1585647573427-024564c760cd?q=80&w=600"],
                dietary_tags=["Vegan", "High Fiber"],
                is_featured=True,
                is_active=True,
                is_new_arrival=True,
                rating_average=4.8,
                review_count=67
            ))

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
