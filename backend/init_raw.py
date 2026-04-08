import sqlite3
import json

def init_raw():
    conn = sqlite3.connect('kowopefoods.db')
    cursor = conn.cursor()
    
    # Ensure table exists (just in case)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cms_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_key VARCHAR(100) UNIQUE,
            data JSON,
            updated_at DATETIME
        )
    ''')
    
    data = {
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
    
    data_json = json.dumps(data)
    
    # Check if exists
    cursor.execute("SELECT id FROM cms_sections WHERE section_key = 'site_settings'")
    row = cursor.fetchone()
    
    if row:
        print("Updating existing site_settings using Raw SQL...")
        cursor.execute("UPDATE cms_sections SET data = ? WHERE section_key = 'site_settings'", (data_json,))
    else:
        print("Inserting new site_settings using Raw SQL...")
        cursor.execute("INSERT INTO cms_sections (section_key, data) VALUES (?, ?)", ('site_settings', data_json))
        
    conn.commit()
    conn.close()
    print("Raw SQL Success!")

if __name__ == "__main__":
    init_raw()
