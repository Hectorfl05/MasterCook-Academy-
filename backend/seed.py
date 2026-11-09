#!/usr/bin/env python3
"""
Script de inicialización y sembrado de datos para MasterCook.
Crea las tablas y carga datos de prueba para desarrollo local.
"""
import os
import sys
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine, text

# Determinar URI de base de datos
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'mastercook.db'))
DATABASE_URI = os.getenv('DATABASE_URI', f'sqlite:///{DB_PATH}')

print(f"🌱 Conectando a base de datos: {DATABASE_URI}")
engine = create_engine(DATABASE_URI)

def seed_database():
    with engine.begin() as conn:
        # 1. Crear tablas si no existen
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS user (
                ID_Usuario INTEGER PRIMARY KEY AUTOINCREMENT,
                Nombre VARCHAR(200) NOT NULL,
                Email VARCHAR(100) NOT NULL UNIQUE,
                Password TEXT NOT NULL
            );
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Categorias_Taller (
                ID_Categoria INTEGER PRIMARY KEY AUTOINCREMENT,
                Nombre VARCHAR(100) NOT NULL
            );
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Taller (
                ID_Taller INTEGER PRIMARY KEY AUTOINCREMENT,
                Nombre VARCHAR(100) NOT NULL,
                Descripcion TEXT,
                Precio NUMERIC(10, 2) NOT NULL,
                Cupo_Disponible BOOLEAN NOT NULL,
                Capacidad INTEGER NOT NULL,
                Fecha_Inicio DATETIME NOT NULL,
                Fecha_Final DATETIME NOT NULL,
                ID_Categoria INTEGER NOT NULL,
                FOREIGN KEY (ID_Categoria) REFERENCES Categorias_Taller(ID_Categoria)
            );
        """))

        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Reserva (
                ID_Reserva INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_Usuario INTEGER NOT NULL,
                ID_Taller INTEGER NOT NULL,
                ID_Estado INTEGER NOT NULL,
                Fecha_Reserva DATETIME NOT NULL,
                Estado_Pago INTEGER NOT NULL
            );
        """))

        # 2. Insertar Categorías si está vacía
        cat_count = conn.execute(text("SELECT COUNT(*) FROM Categorias_Taller")).scalar()
        if cat_count == 0:
            print("  ➕ Insertando categorías de talleres...")
            conn.execute(text("""
                INSERT INTO Categorias_Taller (ID_Categoria, Nombre) VALUES
                (1, 'Cocina Internacional'),
                (2, 'Repostería Creativa'),
                (3, 'Alimentación Saludable');
            """))

        # 3. Insertar Talleres si está vacía
        taller_count = conn.execute(text("SELECT COUNT(*) FROM Taller")).scalar()
        if taller_count == 0:
            print("  ➕ Insertando talleres de cocina...")
            now = datetime.now()
            conn.execute(text("""
                INSERT INTO Taller (ID_Taller, Nombre, Descripcion, Precio, Cupo_Disponible, Capacidad, Fecha_Inicio, Fecha_Final, ID_Categoria) VALUES
                (1, 'Taller de Pasta Italiana Artesanal', 'Aprende a hacer pasta fresca, fettuccine, raviolis y salsas tradicionales desde cero.', 250.00, 1, 15, :f1_ini, :f1_fin, 1),
                (2, 'Secretos del Sushi y Cocina Japonesa', 'Técnicas de corte de pescado, arroz perfecto para sushi, makis, nigiris y temakis.', 320.00, 1, 12, :f2_ini, :f2_fin, 1),
                (3, 'Repostería Francesa: Macarons y Éclairs', 'Domina el arte de los macarons perfectos, masa choux y cremas pasteleras de alta pastelería.', 280.00, 1, 10, :f3_ini, :f3_fin, 2),
                (4, 'Pastelería Creativa y Fondant', 'Decoración avanzada de pasteles con fondant, técnicas de modelado y armado para ocasiones especiales.', 260.00, 1, 8, :f4_ini, :f4_fin, 2),
                (5, 'Cocina Vegana y Plant-Based', 'Recetas saludables, nutritivas y deliciosas basadas 100% en plantas y superalimentos.', 210.00, 1, 20, :f5_ini, :f5_fin, 3),
                (6, 'Panadería Tradicional y Masa Madre', 'Taller intensivo de panadería artesanal con fermentación natural. Taller actualmente lleno.', 190.00, 0, 10, :f6_ini, :f6_fin, 1);
            """), {
                "f1_ini": now + timedelta(days=5), "f1_fin": now + timedelta(days=5, hours=4),
                "f2_ini": now + timedelta(days=8), "f2_fin": now + timedelta(days=8, hours=4),
                "f3_ini": now + timedelta(days=12), "f3_fin": now + timedelta(days=12, hours=4),
                "f4_ini": now + timedelta(days=15), "f4_fin": now + timedelta(days=15, hours=4),
                "f5_ini": now + timedelta(days=20), "f5_fin": now + timedelta(days=20, hours=4),
                "f6_ini": now + timedelta(days=2), "f6_fin": now + timedelta(days=2, hours=4),
            })

        # 4. Insertar Usuario demo si no existe
        user_count = conn.execute(text("SELECT COUNT(*) FROM user WHERE Email = 'admin@test.com'")).scalar()
        if user_count == 0:
            print("  ➕ Insertando usuario demo (admin@test.com / admin123)...")
            # Contraseña compatible con auth (mínimo 8 caracteres):
            # permitimos admin123 y admin12345
            hashed_pwd = generate_password_hash('admin12345')
            conn.execute(text("""
                INSERT INTO user (ID_Usuario, Nombre, Email, Password) VALUES
                (1, 'Admin MasterCook', 'admin@test.com', :pwd);
            """), {"pwd": hashed_pwd})

        print("✅ Base de datos inicializada y sembrada con éxito.")

if __name__ == '__main__':
    seed_database()
