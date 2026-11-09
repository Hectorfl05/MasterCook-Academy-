from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models import User, db
from werkzeug.security import check_password_hash
import jwt
import datetime
import os

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Todos los campos son obligatorios'}), 400

    if len(password) < 8:
        return jsonify({'message': 'La contraseña debe tener al menos 8 caracteres'}), 400

    if User.query.filter_by(Email=email).first():
        return jsonify({'message': 'El correo ya está registrado'}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        Nombre=name,  # Nombre exacto de columna
        Email=email,   # Nombre exacto de columna
        Password=hashed_password  # Nombre exacto de columna
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Correo y contraseña son obligatorios'}), 400

    user = User.query.filter_by(Email=email).first()  # Usando Email (nombre exacto de columna)

    if not user or not check_password_hash(user.Password, password):  # Usando Contraseña
        return jsonify({'message': 'Credenciales inválidas'}), 401

    # Generar token
    try:
        secret = os.getenv('SECRET_KEY', 'mastercook-dev-secret-key-12345')
        token = jwt.encode({
            'user_id': user.ID_Usuario,  # Usando ID_Usuario
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, secret, algorithm='HS256')

        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'token': token,
            'user': {
                'id': user.ID_Usuario,  # Usando ID_Usuario
                'name': user.Nombre,   # Usando Nombre
                'email': user.Email     # Usando Email
            }
        }), 200
    except Exception as e:
        print(f"Error generando token JWT: {e}")
        return jsonify({'message': 'Error interno al generar el token'}), 500
    

