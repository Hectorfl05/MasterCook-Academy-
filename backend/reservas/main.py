from flask import Flask
from flask_cors import CORS
from models import db
from routes import bp
import os
from dotenv import load_dotenv
from verificar import verificar_conexion_mysql, wait_for_db

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
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mastercook-dev-secret-key-12345')

db.init_app(app)
app.register_blueprint(bp)

with app.app_context():
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith('mysql'):
        if verificar_conexion_mysql():
            wait_for_db(app.config['SQLALCHEMY_DATABASE_URI'])
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
