import sqlite3
from pathlib import Path
import psycopg2


#DB_PATH = Path(__file__).resolve().parent.parent / "gastos.db"

def crear_tabla():
    conn = psycopg2.connect(
        host = "localhost",
        database = "RePlay",
        user = "postgres",
        password = "12345",
        port = "5432"
    )
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gastos (
            id SERIAL PRIMARY KEY,
            categoria TEXT,
            monto REAL,
            fecha TEXT,
            descripcion TEXT,
            usuario_id INTEGER,
            creado_en TEXT
        )
    """)
    conn.commit()
    conn.close()

def insertar_gasto(categoria, monto, fecha, descripcion, usuario_id):
    try:
        conn = psycopg2.connect(
            host = "localhost",
            database = "RePlay",
            user = "postgres",
            password = "12345",
            port = "5432"
        )
        cursor = conn.cursor()
        #   VALUES (?, ?, ?, ?, ?, datetime('now'))
        #, (categoria, monto, fecha, descripcion, usuario_id))
        #query = "INSERT INTO gastos (categoria, monto, descripcion, usuario_id, fecha) VALUES (%s,%s,%s,%s, datetime('now'))"
        cursor.execute("""
    INSERT INTO gastos (categoria, monto, descripcion, usuario_id, fecha) 
    VALUES (%s, %s, %s, %s, NOW())
""", (categoria, monto, descripcion, usuario_id))

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error en insertar_gasto: {e}")
        raise




def obtener_gastos():
    conn = sqlite3.connect("backend/gastos.db")
    cursor = conn.cursor()
    cursor.execute("SELECT fecha, monto FROM gastos ORDER BY fecha ASC")
    datos = cursor.fetchall()
    conn.close()
    return datos


def obtener_gastos():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="RePlay",
            user="postgres",
            password="12345",
            port="5432"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT fecha, monto FROM gastos ORDER BY fecha ASC")
        datos = cursor.fetchall()
        conn.close()
        return datos
    except Exception as e:
        print(f"Error en obtener_gastos: {e}")
        raise
