from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, conlist
from typing import List
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

app = FastAPI()

# Modelo de entrada para un registro de gasto
class GastoHistorico(BaseModel):
    year: int
    month: int
    total_gastos: float

# Entrada esperada: lista de registros
class GastoRequest(BaseModel):
    gastos: conlist(GastoHistorico, min_items=1)

# Salida por cada mes futuro
class PrediccionMes(BaseModel):
    mes_adelanto: int
    gasto_estimado: float

class PrediccionResponse(BaseModel):
    predicciones: List[PrediccionMes]

@app.post("/predecir_gastos", response_model=PrediccionResponse)
def predecir_gastos(request: GastoRequest):
    # Crear DataFrame
    data = {
        'year': [g.year for g in request.gastos],
        'month': [g.month for g in request.gastos],
        'total_gastos': [g.total_gastos for g in request.gastos]
    }
    df = pd.DataFrame(data)

    if df.empty:
        raise HTTPException(status_code=400, detail="No hay datos para predecir.")

    # Crear índice temporal (mes consecutivo)
    df['time_index'] = (df['year'] - df['year'].min()) * 12 + df['month']
    df['time_index'] = df['time_index'].astype(int)

    # Variables X y y
    X = df[['time_index']]
    y = df['total_gastos']

    # Entrenar modelo regresión lineal
    model = LinearRegression()
    model.fit(X, y)

    # Predecir para próximos 6 meses
    last_time_index = int(df['time_index'].max())
    future_indices = np.array(range(last_time_index + 1, last_time_index + 7)).reshape(-1, 1)
    predictions = model.predict(future_indices)

    # Construir respuesta
    predicciones = [
        PrediccionMes(mes_adelanto=i+1, gasto_estimado=float(round(pred, 2)))
        for i, pred in enumerate(predictions)
    ]

    return PrediccionResponse(predicciones=predicciones)
