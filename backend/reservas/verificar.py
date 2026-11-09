# verificar.py
import os, time
try:
    import mysql.connector
except ImportError:
    mysql = None
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

def verificar_conexion_mysql():
    if not mysql:
        return False
    try:
        conexion = mysql.connector.connect(
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            database=os.getenv('DB_NAME'),
            ssl_disabled=True
        )
        print("✅ Conexión directa a MySQL exitosa!")
        return True
    except Exception as e:
        print(f"❌ Error en conexión directa MySQL: {e}")
        return False

def wait_for_db(database_uri, max_retries=5, retry_delay=5):
    engine = create_engine(database_uri)
    for _ in range(max_retries):
        try:
            with engine.connect():
                print("✅ Conexión con SQLAlchemy exitosa.")
                return True
        except OperationalError:
            print("⏳ Esperando que la DB esté lista...")
            time.sleep(retry_delay)
    raise Exception("❌ No se pudo conectar a la DB después de varios intentos")