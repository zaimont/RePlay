import psycopg2
from psycopg2 import sql
from datetime import datetime
from decimal import Decimal

def crear_tabla():
    conn = psycopg2.connect(
        host="localhost",
        database="RePlay",
        user="postgres",
        password="12345",
        port="5432"
    )
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gastos (
            id SERIAL PRIMARY KEY,
            categoria TEXT,
            monto REAL,
            fecha DATE,
            descripcion TEXT,
            usuario_id INTEGER,
            creado_en TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

def insertar_gasto(categoria, monto, fecha, descripcion, usuario_id):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="RePlay",
            user="postgres",
            password="12345",
            port="5432"
        )
        cursor = conn.cursor()

        # Aquí se usa el valor de fecha que se recibe (espera formato 'YYYY-MM-DD')
        cursor.execute("""
            INSERT INTO gastos (categoria, monto, fecha, descripcion, usuario_id) 
            VALUES (%s, %s, %s, %s, %s)
        """, (categoria, monto, fecha, descripcion, usuario_id))

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error en insertar_gasto: {e}")
        raise

def obtener_gastos_por_categoria(categoria: str):
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="RePlay",
        user="postgres",
        password="12345"
    )
    try:
        with conn.cursor() as cur:
            query = """
                SELECT fecha, monto FROM gastos WHERE categoria = %s ORDER BY fecha ASC
            """
            cur.execute(query, (categoria,))
            rows = cur.fetchall()
        # Convertir Decimal a float para evitar problemas con Prophet
        return [(row[0], float(row[1])) for row in rows]
    finally:
        conn.close()
