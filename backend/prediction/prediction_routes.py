from fastapi import APIRouter, HTTPException, Query
from backend.models.database import obtener_gastos_por_categoria
import pandas as pd
from prophet import Prophet

prediction_router = APIRouter()

CATEGORIAS = ["operaciones", "inversion", "administracion"]

def predecir_categoria(gastos, periods):
    if not gastos:
        return {
            "historicos": [],
            "predicciones": [],
            "total_predicho": 0,
        }
    df = pd.DataFrame(gastos, columns=["fecha", "monto"])
    df["fecha"] = pd.to_datetime(df["fecha"])
    df = df.sort_values("fecha")
    df_prophet = df.rename(columns={"fecha": "ds", "monto": "y"})

    model = Prophet()
    model.fit(df_prophet)

    future = model.make_future_dataframe(periods=periods, freq="ME")
    forecast = model.predict(future)

    historicos = df_prophet.to_dict(orient="records")
    predicciones = forecast[["ds", "yhat"]].tail(periods).to_dict(orient="records")
    total_predicho = sum(p["yhat"] for p in predicciones)

    return {
        "historicos": historicos,
        "predicciones": predicciones,
        "total_predicho": total_predicho,
    }

@prediction_router.get("/prediccion-gastos-categorias")
async def prediccion_gastos_categorias(periods: int = Query(6, ge=1, le=36)):
    resultado = {}
    try:
        for cat in CATEGORIAS:
            gastos = obtener_gastos_por_categoria(cat)
            resultado[cat] = predecir_categoria(gastos, periods)
        return resultado
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al predecir gastos: {str(e)}")