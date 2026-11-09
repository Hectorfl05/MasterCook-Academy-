from flask import Blueprint, request, jsonify
from models import Reserva
from extensions import db
from datetime import datetime
from sqlalchemy import text

bp = Blueprint('reservas', __name__)

@bp.route('/reservar', methods=['POST'])
def reservar():
    data = request.get_json()

    id_usuario = data.get('id_usuario')
    id_taller = data.get('id_taller')

    if not id_usuario or not id_taller:
        return jsonify({'mensaje': 'Faltan datos'}), 400

    # Validar que no exista ya una reserva para ese taller y usuario
    reserva_existente = Reserva.query.filter_by(ID_Usuario=id_usuario, ID_Taller=id_taller).first()
    if reserva_existente:
        return jsonify({'mensaje': 'Ya tienes una reserva para este taller'}), 409

    # Verificar si el taller tiene cupo disponible
    taller = db.session.execute(
        text("SELECT Capacidad, Cupo_Disponible FROM Taller WHERE ID_Taller = :id_taller"),
        {"id_taller": id_taller}
    ).first()

    if not taller:
        return jsonify({'mensaje': 'Taller no encontrado'}), 404

    capacidad, cupo_disponible = taller

    if not cupo_disponible:
        return jsonify({'mensaje': 'El taller ya no tiene cupos disponibles'}), 400

    # Contar cuántas reservas existen actualmente para ese taller
    total_reservas = db.session.execute(
        text("SELECT COUNT(*) FROM Reserva WHERE ID_Taller = :id_taller"),
        {"id_taller": id_taller}
    ).scalar()

    if total_reservas >= capacidad:
        # Marcar el taller como sin cupo
        db.session.execute(
            text("UPDATE Taller SET Cupo_Disponible = FALSE WHERE ID_Taller = :id_taller"),
            {"id_taller": id_taller}
        )
        db.session.commit()
        return jsonify({'mensaje': 'El taller acaba de llenarse, no es posible reservar'}), 400

    # Crear nueva reserva
    nueva_reserva = Reserva(
        ID_Usuario=id_usuario,
        ID_Taller=id_taller,
        ID_Estado=1,  # Confirmada
        Fecha_Reserva=datetime.utcnow(),
        Estado_Pago=1  # Pendiente
    )

    db.session.add(nueva_reserva)
    db.session.commit()

    # Revisar si después de esta reserva se llenó el taller
    total_reservas += 1
    if total_reservas >= capacidad:
        db.session.execute(
            text("UPDATE Taller SET Cupo_Disponible = FALSE WHERE ID_Taller = :id_taller"),
            {"id_taller": id_taller}
        )
        db.session.commit()

    return jsonify({
        'mensaje': 'Reserva realizada exitosamente',
        'id_reserva': nueva_reserva.ID_Reserva
    }), 201

@bp.route('/reservas/usuario/<int:id_usuario>', methods=['GET'])
def obtener_reservas_usuario(id_usuario):
    reservas = Reserva.query.filter_by(ID_Usuario=id_usuario).order_by(Reserva.ID_Reserva.desc()).all()
    resultado = []
    for r in reservas:
        taller_info = db.session.execute(
            text("SELECT Nombre, Precio FROM Taller WHERE ID_Taller = :id_taller"),
            {"id_taller": r.ID_Taller}
        ).first()
        taller_nombre = taller_info[0] if taller_info else f"Taller #{r.ID_Taller}"
        taller_precio = float(taller_info[1]) if taller_info and taller_info[1] is not None else 0.0
        resultado.append({
            'id_reserva': r.ID_Reserva,
            'id_taller': r.ID_Taller,
            'taller_nombre': taller_nombre,
            'taller_precio': taller_precio,
            'fecha_reserva': r.Fecha_Reserva.strftime('%Y-%m-%d %H:%M') if r.Fecha_Reserva else None,
            'id_estado': r.ID_Estado,
            'estado': 'Confirmada' if r.ID_Estado == 1 else 'Cancelada',
            'estado_pago': 'Pagado' if r.Estado_Pago == 2 else 'Pendiente'
        })
    return jsonify(resultado), 200
