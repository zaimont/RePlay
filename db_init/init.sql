CREATE TABLE IF NOT EXISTS gastos (
    id SERIAL PRIMARY KEY,
    categoria TEXT,
    monto REAL,
    fecha DATE,
    descripcion TEXT,
    usuario_id INTEGER,
    creado_en TIMESTAMP DEFAULT NOW()
);



INSERT INTO gastos (categoria, monto, fecha, descripcion, usuario_id)
VALUES ('Alimentos', 150.50, CURRENT_DATE, 'Compra supermercado', 1);
