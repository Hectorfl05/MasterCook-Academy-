from flask import Flask
from flask_cors import CORS
from models import db
from routes import bp
import os
from dotenv import load_dotenv
import time
try:
    import mysql.connector
except ImportError:
    mysql = None
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Carga las variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración desde variables de entorno
database_uri = os.getenv('DATABASE_URI')
if not database_uri:
    db_user = os.getenv('DB_USER')
    if db_user:
        db_pass = os.getenv('DB_PASSWORD', '')
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = os.getenv('DB_PORT', '3306')
        db_name = os.getenv('DB_NAME', 'mastercook')
        database_uri = f'mysql+mysqlconnector://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}'
    else:
        # SQLite por defecto para entorno local
        database_uri = 'sqlite:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'mastercook.db'))

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mastercook-dev-secret-key-12345')

# Conexión directa MySQL para verificación (sólo si se usa MySQL)
def verificar_conexion_mysql():
    if not app.config['SQLALCHEMY_DATABASE_URI'].startswith('mysql'):
        return True
    try:
        conexion = mysql.connector.connect(
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', 3306)),
            database=os.getenv('DB_NAME', 'mastercook'),
            ssl_disabled=True
        )
        print("✅ Conexión directa a MySQL exitosa!")
        conexion.close()
        return True
    except Exception as e:
        print(f"❌ Error en conexión directa MySQL: {e}")
        return False

# Inicializar SQLAlchemy
db.init_app(app)
app.register_blueprint(bp)

def wait_for_db():
    if not app.config['SQLALCHEMY_DATABASE_URI'].startswith('mysql'):
        return True
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    max_retries = 5
    retry_delay = 3
    for _ in range(max_retries):
        try:
            with engine.connect():
                return True
        except OperationalError:
            print("Esperando a que la DB esté lista...")
            time.sleep(retry_delay)
    raise Exception("No se pudo conectar a la DB después de varios intentos")

with app.app_context():
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith('mysql'):
        verificar_conexion_mysql()
        wait_for_db()
    db.create_all()


if __name__ == '__main__':
    app.run(host='0.0.0.0')
