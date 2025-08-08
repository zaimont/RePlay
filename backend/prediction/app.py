from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, conlist
from typing import List
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Permitir orígenes (frontend)
origins = [
    "http://localhost:5173",  # URL donde corre tu frontend Vite React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],         # métodos permitidos (GET, POST, OPTIONS, etc)
    allow_headers=["*"],         # headers permitidos
)

# Modelo para un registro de gasto histórico
class GastoHistorico(BaseModel):
    year: int
    month: int
    total_gastos: float

# Modelo para la lista de registros
class GastoRequest(BaseModel):
    gastos: conlist(GastoHistorico, min_length=1)

# Modelo para la predicción de cada mes
class PrediccionMes(BaseModel):
    mes_adelanto: int
    gasto_estimado: float

# Modelo para la respuesta completa con todas las predicciones
class PrediccionResponse(BaseModel):
    predicciones: List[PrediccionMes]

@app.post("/predecir_gastos", response_model=PrediccionResponse)
def predecir_gastos(request: GastoRequest):
    # Crear DataFrame a partir de la lista de gastos
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

    # Variables independientes y dependientes
    X = df[['time_index']]
    y = df['total_gastos']

    # Entrenar modelo de regresión lineal
    model = LinearRegression()
    model.fit(X, y)

    # Predecir gastos para los próximos 6 meses con DataFrame para evitar warning
    last_time_index = int(df['time_index'].max())
    future_indices = pd.DataFrame({'time_index': range(last_time_index + 1, last_time_index + 7)})
    predictions = model.predict(future_indices)

    # Construir la respuesta con las predicciones
    predicciones = [
        PrediccionMes(mes_adelanto=i+1, gasto_estimado=float(round(pred, 2)))
        for i, pred in enumerate(predictions)
    ]

    return PrediccionResponse(predicciones=predicciones)
