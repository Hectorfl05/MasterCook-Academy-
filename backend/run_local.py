#!/usr/bin/env python3
"""
Lanzador de microservicios locales para MasterCook.
Inicia:
- Auth (puerto 5001)
- Talleres (puerto 5002)
- Reservas (puerto 5003)
- Pagos (puerto 5004)
"""
import os
import sys
import time
import subprocess
import signal

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VENV_PY = os.path.join(BASE_DIR, '.venv', 'bin', 'python')
PYTHON_EXEC = VENV_PY if os.path.exists(VENV_PY) else sys.executable

DB_PATH = os.path.abspath(os.path.join(BASE_DIR, 'mastercook.db'))
DATABASE_URI = os.getenv('DATABASE_URI', f'sqlite:///{DB_PATH}')

SERVICES = [
    {
        'name': 'auth',
        'cwd': os.path.join(BASE_DIR, 'auth'),
        'cmd': [PYTHON_EXEC, '-c', """
import os, sys
from app import app
app.run(host='0.0.0.0', port=5001, debug=False)
"""],
        'port': 5001,
        'env': {'PORT': '5001'}
    },
    {
        'name': 'talleres',
        'cwd': os.path.join(BASE_DIR, 'talleres'),
        'cmd': [PYTHON_EXEC, '-c', """
import os, sys
from main import create_app
app = create_app()
app.run(host='0.0.0.0', port=5002, debug=False)
"""],
        'port': 5002,
        'env': {'PORT': '5002'}
    },
    {
        'name': 'reservas',
        'cwd': os.path.join(BASE_DIR, 'reservas'),
        'cmd': [PYTHON_EXEC, '-c', """
import os, sys
from main import app
app.run(host='0.0.0.0', port=5003, debug=False)
"""],
        'port': 5003,
        'env': {'PORT': '5003'}
    },
    {
        'name': 'pagos',
        'cwd': os.path.join(BASE_DIR, 'pagos'),
        'cmd': [PYTHON_EXEC, '-c', """
import os, sys
from main import app
app.run(host='0.0.0.0', port=5004, debug=False)
"""],
        'port': 5004,
        'env': {'PORT': '5004'}
    }
]

def main():
    print("==================================================")
    print("🍳 Iniciando Microservicios de MasterCook en Local")
    print(f"📦 Base de datos: {DATABASE_URI}")
    print("==================================================")

    # 1. Asegurar sembrado de DB
    seed_script = os.path.join(BASE_DIR, 'seed.py')
    subprocess.run([PYTHON_EXEC, seed_script], check=True)

    processes = []

    def cleanup(sig=None, frame=None):
        print("\n🛑 Deteniendo microservicios...")
        for p in processes:
            p.terminate()
        for p in processes:
            p.wait()
        print("✅ Todos los microservicios detenidos.")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    for s in SERVICES:
        env = os.environ.copy()
        env['DATABASE_URI'] = DATABASE_URI
        env['SECRET_KEY'] = os.getenv('SECRET_KEY', 'mastercook-dev-secret-key-12345')
        env['PYTHONUNBUFFERED'] = '1'
        env.update(s['env'])
        
        p = subprocess.Popen(
            s['cmd'],
            cwd=s['cwd'],
            env=env
        )
        processes.append(p)
        print(f"🚀 Microservicio '{s['name']}' iniciado en http://localhost:{s['port']}")

    print("==================================================")
    print("🎉 Todos los microservicios están listos!")
    print("Presiona Ctrl+C para detenerlos.")
    print("==================================================")

    try:
        while True:
            time.sleep(1)
            for i, p in enumerate(processes):
                ret = p.poll()
                if ret is not None:
                    print(f"⚠️ Microservicio {SERVICES[i]['name']} terminó con código {ret}")
                    cleanup()
    except KeyboardInterrupt:
        cleanup()

if __name__ == '__main__':
    main()
