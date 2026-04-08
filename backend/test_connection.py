from dotenv import load_dotenv
import os
import sys

# Force UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

url = os.getenv('DATABASE_URL', '')
if not url:
    print("FAILED: DATABASE_URL is not set in .env")
    sys.exit(1)

host = url.split('@')[-1].split('/')[0] if '@' in url else 'unknown'
print(f"DATABASE_URL host: {host}")

try:
    import psycopg2
    conn = psycopg2.connect(url, connect_timeout=10)
    cur = conn.cursor()

    cur.execute('SELECT version();')
    version = cur.fetchone()[0]
    print(f"\nCONNECTION SUCCESSFUL")
    print(f"Server: {version[:80]}")

    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = [r[0] for r in cur.fetchall()]

    if tables:
        print(f"\nTables in database ({len(tables)}):")
        for t in tables:
            print(f"  - {t}")
    else:
        print("\nWARNING: No tables found.")
        print("Run the supabase_schema.sql in Supabase SQL Editor first!")

    conn.close()

except psycopg2.OperationalError as e:
    print(f"\nCONNECTION FAILED: {e}")
    print("\nCommon causes:")
    print("  - Wrong password (reset at Supabase -> Settings -> Database -> Reset password)")
    print("  - Supabase project is paused (free tier pauses after inactivity - click 'Restore project')")
    print("  - Special characters in password need URL-encoding (? -> %3F, # -> %23, @ -> %40)")
except Exception as e:
    print(f"\nERROR: {e}")
