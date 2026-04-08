import sys
import os

# Add current dir to path
sys.path.append(os.getcwd())

try:
    from database import SessionLocal, Base
    print("Base initialized")
    
    import models.product
    print("Product model loaded")
    
    import models.all_others
    print("Other models loaded")
    
    from sqlalchemy import inspect
    # This triggers mapper initialization
    from models.product import Product
    from models.all_others import CMSSection
    
    print("Attempting to inspect Product...")
    inspect(Product)
    print("Success!")
    
except Exception as e:
    import traceback
    print("\nERROR DETECTED:")
    traceback.print_exc()
