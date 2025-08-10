# backend/prediction/prediction_routes.py
from fastapi import APIRouter, HTTPException, Query
from backend.models.database import obtener_gastos
import pandas as pd
from prophet import Prophet

prediction_router = APIRouter()

@prediction_router.get("/prediccion-gastos")
async def prediccion_gastos(periods: int = Query(6, ge=1, le=36)):
    """
    Endpoint para predecir gastos futuros.
    Parámetro:
    - periods: cantidad de meses a predecir (1 a 36)
    """
    try:
        gastos = obtener_gastos()  # lista de tuplas (fecha, monto)

        if not gastos:
            raise HTTPException(status_code=404, detail="No hay datos para predecir")

        # Convertir a DataFrame
        df = pd.DataFrame(gastos, columns=["fecha", "monto"])
        df["fecha"] = pd.to_datetime(df["fecha"])
        df = df.sort_values("fecha")

        # Renombrar columnas para Prophet
        df_prophet = df.rename(columns={"fecha": "ds", "monto": "y"})

        # Crear y entrenar modelo
        model = Prophet()
        model.fit(df_prophet)

        # Crear dataframe futuro y predecir
        future = model.make_future_dataframe(periods=periods, freq="M")
        forecast = model.predict(future)

        # Preparar resultados para frontend
        historicos = df_prophet.to_dict(orient="records")
        predicciones = forecast[["ds", "yhat"]].tail(periods).to_dict(orient="records")

        total_predicho = sum(p["yhat"] for p in predicciones)

        return {
            "historicos": historicos,
            "predicciones": predicciones,
            "total_predicho": total_predicho,
            "periods": periods
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al predecir gastos: {str(e)}")
