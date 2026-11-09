from flask import Blueprint, request, jsonify
from models import Taller, CategoriaTaller
from extensions import db

main = Blueprint('main', __name__)

@main.route('/talleres', methods=['GET'])
def get_talleres():
    categoria_nombre = request.args.get('categoria')

    if categoria_nombre:
        talleres = db.session.query(Taller).join(CategoriaTaller).filter(CategoriaTaller.Nombre == categoria_nombre).all()
    else:
        talleres = db.session.query(Taller).join(CategoriaTaller).all()

    resultado = []
    for t in talleres:
        resultado.append({
            "id": t.ID_Taller,
            "nombre": t.Nombre,
            "categoria": t.categoria.Nombre,
            "fecha": t.Fecha_Inicio.strftime('%Y-%m-%d'),
            "precio": float(t.Precio),
            "cupo_disponible": t.Cupo_Disponible
        })

    return jsonify(resultado), 200


talleres_bp = Blueprint('talleres', __name__)

@talleres_bp.route('/talleres/<int:id>', methods=['GET'])
def obtener_taller(id):
    taller = db.session.get(Taller, id) if hasattr(db.session, 'get') else db.session.query(Taller).get(id)
    if not taller:
        return jsonify({'error': 'Taller no encontrado'}), 404

    return jsonify({
        'id': taller.ID_Taller,
        'nombre': taller.Nombre,
        'descripcion': taller.Descripcion,
        'fecha_inicio': taller.Fecha_Inicio.strftime('%Y-%m-%d'),
        'fecha_final': taller.Fecha_Final.strftime('%Y-%m-%d'),
        'categoria': taller.categoria.Nombre,
        'precio': float(taller.Precio),
        'capacidad': taller.Capacidad,
        'cupo_disponible': taller.Cupo_Disponible
    })



@main.route('/talleres', methods=['POST'])
def crear_taller():
    data = request.get_json()

    taller = Taller(
        Nombre=data['nombre'],
        Descripcion=data.get('descripcion'),
        Precio=data['precio'],  
        Cupo_Disponible=data['cupo_disponible'],
        Capacidad=data['capacidad'],
        Fecha_Inicio=data['fecha_inicio'],
        Fecha_Final=data['fecha_final'],
        ID_Categoria=data['id_categoria']
    )

    db.session.add(taller)
    db.session.commit()

    return jsonify({"mensaje": "Taller creado correctamente"}), 201