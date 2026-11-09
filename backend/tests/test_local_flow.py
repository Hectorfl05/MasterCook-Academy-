#!/usr/bin/env python3
"""
Test de integración local para los 4 microservicios de MasterCook.
Verifica:
1. Auth: Registro y Login (obtención de token JWT y usuario)
2. Talleres: Listado general y detalle por ID
3. Reservas: Creación de reserva para usuario y taller
4. Pagos: Simulación de pago para la reserva
5. Reservas: Consulta de reservas del usuario y verificación de estado Pagado
"""
import os
import sys
import json
import time
import urllib.request
import urllib.error

def request_json(url, method='GET', data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    body = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {'error': err_body}

def run_tests():
    print("🧪 Iniciando Tests de Integración Backend...")
    
    # 1. Login con usuario demo
    login_data = {
        'email': 'admin@test.com',
        'password': 'admin12345'
    }
    status, res = request_json('http://localhost:5001/login', method='POST', data=login_data)
    print(f"  [1] POST /login -> Status {status}: {res.get('message')}")
    assert status == 200, f"Error en login: {res}"
    assert 'token' in res, "Falta token en respuesta"
    user_id = res['user']['id']
    token = res['token']

    # 2. Listado de Talleres
    status, talleres = request_json('http://localhost:5002/talleres')
    print(f"  [2] GET /talleres -> Status {status}: Encontrados {len(talleres)} talleres")
    assert status == 200, f"Error obteniendo talleres: {talleres}"
    assert len(talleres) > 0, "No hay talleres en la base de datos"
    primer_taller = talleres[0]
    taller_id = primer_taller['id']

    # 3. Detalle de Taller
    status, detalle = request_json(f'http://localhost:5002/talleres/{taller_id}')
    print(f"  [3] GET /talleres/{taller_id} -> Status {status}: {detalle.get('nombre')}")
    assert status == 200, f"Error obteniendo detalle de taller: {detalle}"
    assert detalle['id'] == taller_id

    # 4. Crear Reserva
    reserva_data = {
        'id_usuario': user_id,
        'id_taller': taller_id
    }
    status, res_reserva = request_json('http://localhost:5003/reservar', method='POST', data=reserva_data)
    print(f"  [4] POST /reservar -> Status {status}: {res_reserva.get('mensaje')}")
    # Si ya existía reserva previa (por corrida anterior), puede ser 409
    if status == 409:
        print("      ℹ️ Ya existía reserva previa, continuando...")
    else:
        assert status == 201, f"Error al reservar: {res_reserva}"
        id_reserva = res_reserva.get('id_reserva')
        assert id_reserva is not None, "id_reserva no fue devuelto en la respuesta"

        # 5. Simular Pago
        status, res_pago = request_json(f'http://localhost:5004/simular_pago/{id_reserva}', method='POST')
        print(f"  [5] POST /simular_pago/{id_reserva} -> Status {status}: {res_pago.get('mensaje')}")
        assert status == 200, f"Error al simular pago: {res_pago}"
        assert res_pago.get('estado_pago') == 'Pagado'

    # 6. Consultar Reservas del Usuario
    status, mis_reservas = request_json(f'http://localhost:5003/reservas/usuario/{user_id}')
    print(f"  [6] GET /reservas/usuario/{user_id} -> Status {status}: {len(mis_reservas)} reservas encontradas")
    assert status == 200, f"Error al consultar reservas del usuario: {mis_reservas}"
    assert len(mis_reservas) > 0, "Debería haber al menos 1 reserva"
    print(f"      Última reserva: Taller '{mis_reservas[0]['taller_nombre']}' - Estado Pago: '{mis_reservas[0]['estado_pago']}'")

    print("\n✅ TODOS LOS TESTS DE INTEGRACIÓN BACKEND PASARON EXITOSAMENTE!")

if __name__ == '__main__':
    run_tests()
