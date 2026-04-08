import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def check_schema():
    url = os.getenv('DATABASE_URL')
    if not url:
        print("DATABASE_URL not found")
        return
    
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        
        tables = ['products', 'categories', 'testimonials']
        for table in tables:
            print(f"\nColumns for table: {table}")
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}'")
            for row in cur.fetchall():
                print(f"  {row[0]} ({row[1]})")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()
