from database import SessionLocal
from models.all_others import CMSSection

db = SessionLocal()
sections = db.query(CMSSection).all()
print("CMS SECTIONS IN DB:")
for s in sections:
    print(f"- {s.section_key}")

site_settings = db.query(CMSSection).filter(CMSSection.section_key == "site_settings").first()
if site_settings:
    print("\nSite settings FOUND!")
else:
    print("\nSite settings NOT FOUND!")
db.close()
