# backend/app.py
from backend.prediction.prediction_routes import prediction_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.prediction.pdf_routes import router as pdf_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_router, prefix="/api")
app.include_router(prediction_router)
