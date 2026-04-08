import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    exit(1)

# Ensure the URL is compatible with SQLAlchemy if it's from Supabase
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def apply_cascade():
    with engine.connect() as conn:
        print("Connected to database. Checking for foreign key constraints on 'reviews' table...")
        
        # SQL to find the constraint name for the product_id foreign key on reviews table
        query = text("""
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'reviews'::regclass
            AND contype = 'f'
            AND confrelid = 'products'::regclass;
        """)
        
        result = conn.execute(query).fetchone()
        
        if result:
            constraint_name = result[0]
            print(f"Found constraint: {constraint_name}. Dropping and re-adding with ON DELETE CASCADE...")
            
            # Drop the existing constraint
            conn.execute(text(f"ALTER TABLE reviews DROP CONSTRAINT {constraint_name}"))
            
            # Re-add with CASCADE
            conn.execute(text("""
                ALTER TABLE reviews 
                ADD CONSTRAINT reviews_product_id_fkey 
                FOREIGN KEY (product_id) REFERENCES products(id) 
                ON DELETE CASCADE;
            """))
            print("Successfully updated 'reviews' table constraint.")
        else:
            print("No existing foreign key constraint found on 'reviews' pointing to 'products'.")
            # Try to add it anyway just in case it was missing entirely
            try:
                conn.execute(text("""
                    ALTER TABLE reviews 
                    ADD CONSTRAINT reviews_product_id_fkey 
                    FOREIGN KEY (product_id) REFERENCES products(id) 
                    ON DELETE CASCADE;
                """))
                print("Added new CASCADE foreign key constraint to 'reviews'.")
            except Exception as e:
                print(f"Note: Could not add constraint (it might already exist or table missing): {e}")

        # Also check for 'order_items' if it's a separate table (schema showed 'items' as JSONB in 'orders', but let's be safe)
        # In this schema, 'orders' has an 'items' JSONB column, so no separate table.
        
        conn.commit()
        print("Migration complete.")

if __name__ == "__main__":
    apply_cascade()
