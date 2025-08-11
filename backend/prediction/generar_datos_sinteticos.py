import psycopg2
from datetime import datetime, timedelta
import numpy as np

def generar_datos_sinteticos(categoria, meses=60):
    """
    Genera datos mensuales sintéticos para una categoría dada.
    """
    fecha_inicio = datetime(2020, 1, 1)
    datos = []

    for i in range(meses):
        fecha = fecha_inicio + timedelta(days=30 * i)
        tendencia = 1000 + i * 50  # ejemplo de tendencia creciente
        estacionalidad = 300 * np.sin(2 * np.pi * (i % 12) / 12)
        ruido = np.random.normal(0, 100)
        monto = max(0, tendencia + estacionalidad + ruido)
        datos.append((categoria, fecha.strftime("%Y-%m-%d"), float(monto)))

    return datos

def insertar_datos_bd(datos):
    conn = psycopg2.connect(
        host="localhost",
        database="RePlay",
        user="postgres",
        password="12345",
        port="5432"
    )
    cursor = conn.cursor()

    for categoria, fecha, monto in datos:
        cursor.execute(
            """
            INSERT INTO gastos (categoria, monto, descripcion, usuario_id, fecha)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (categoria, monto, "Dato sintético generado", 1, fecha)
        )

    conn.commit()
    conn.close()
    print(f"{len(datos)} datos sintéticos insertados en la base de datos para la categoría '{datos[0][0]}'.")

if __name__ == "__main__":
    categorias = ["operaciones", "inversion", "administracion"]

    for cat in categorias:
        datos_sinteticos = generar_datos_sinteticos(cat, meses=60)  # 5 años de datos
        insertar_datos_bd(datos_sinteticos)
