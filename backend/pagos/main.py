from flask import Flask
from flask_cors import CORS
from extensions import db
from routes import bp
import os
from dotenv import load_dotenv
import time
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

load_dotenv()

app = Flask(__name__)
CORS(app)

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
        database_uri = 'sqlite:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'mastercook.db'))

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(bp)

# Función para verificar conexión a la base de datos (sólo para MySQL)
def wait_for_db(uri, max_retries=5, delay=3):
    if not uri.startswith('mysql'):
        return
    engine = create_engine(uri)
    for attempt in range(max_retries):
        try:
            with engine.connect():
                print("✅ Conexión a la base de datos exitosa.")
                return
        except OperationalError as e:
            print(f"❌ Intento {attempt + 1} fallido: {e}")
            print("Reintentando en", delay, "segundos...")
            time.sleep(delay)
    raise Exception("🚫 No se pudo conectar a la base de datos después de varios intentos.")

# Verifica conexión y crea tablas
with app.app_context():
    wait_for_db(app.config['SQLALCHEMY_DATABASE_URI'])
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
