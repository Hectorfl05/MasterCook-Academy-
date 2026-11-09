import os
try:
    import mysql.connector
except ImportError:
    mysql = None
from dotenv import load_dotenv

# Cargar variables del entorno si no estás en contenedor
load_dotenv()

def verificar_conexion_mysql():
    if not mysql:
        return False
    try:
        conexion = mysql.connector.connect(
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=int(os.getenv('DB_PORT', 3306)),
            database=os.getenv('DB_NAME'),
            ssl_disabled=True
        )
        print("✅ Conexión directa de Talleres a MySQL exitosa!")
        conexion.close()
        return True
    except Exception as e:
        print(f"❌ Error en conexión directa de Talleres a MySQL: {e}")
        return False