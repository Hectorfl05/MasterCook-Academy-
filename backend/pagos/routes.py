from flask import Blueprint, request, jsonify
from models import Reserva
from extensions import db

bp = Blueprint('mock_pago', __name__)

@bp.route('/simular_pago/<int:id_reserva>', methods=['POST'])
def simular_pago(id_reserva):
    reserva = Reserva.query.filter_by(ID_Reserva=id_reserva).first()

    if not reserva:
        return jsonify({'mensaje': 'Reserva no encontrada'}), 404

    reserva.Estado_Pago = 2  # Pagado
    db.session.commit()

    return jsonify({
        'mensaje': 'Pago simulado exitosamente',
        'id_reserva': reserva.ID_Reserva,
        'estado_pago': 'Pagado'
    }), 200
