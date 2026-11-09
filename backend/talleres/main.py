from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from routes import main,talleres_bp
from verificar import verificar_conexion_mysql
from extensions import db  # 👈 Importar desde extensions

load_dotenv()

def create_app():
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
    app.register_blueprint(main)
    app.register_blueprint(talleres_bp) 

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith('mysql'):
        verificar_conexion_mysql()
    app.run(host='0.0.0.0', port=5000)
