# backend/prediction/pdf_routes.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from datetime import datetime
import fitz  # PyMuPDF
import re
from backend.models.database import insertar_gasto  # Ajusta según tu estructura

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extraer_monto_total(texto: str):
    lineas = texto.splitlines()
    patrones = [
        r"total\s*(?:factura|a pagar|con impuestos)?[:\s]*\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
        r"importe total[:\s]*\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
        r"total a pagar[:\s]*\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
        r"total con iva[:\s]*\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
        r"total[:\s]*\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)"
    ]

    for linea in lineas:
        linea_lower = linea.lower()
        for patron in patrones:
            match = re.search(patron, linea_lower)
            if match:
                monto_str = match.group(1).replace(',', '')
                try:
                    monto = float(monto_str)
                    if monto > 10:  # filtro para evitar montos muy bajos (impuestos o cargos)
                        return monto
                except:
                    continue
    # Si no encontró monto total con patrones, buscar después del último "subtotal"
    indices_subtotal = [i for i, l in enumerate(lineas) if "subtotal" in l.lower()]
    start_index = indices_subtotal[-1] + 1 if indices_subtotal else 0
    montos_posibles = []
    for linea in lineas[start_index:]:
        montos = re.findall(r"\$?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)", linea)
        for m in montos:
            try:
                montos_posibles.append(float(m.replace(',', '')))
            except:
                pass
    if montos_posibles:
        return max(montos_posibles)
    return None


@router.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser PDF")

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        doc = fitz.open(filepath)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
        doc.close()

        monto_total = extraer_monto_total(full_text)

        fecha_match = re.search(r"(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})", full_text)
        fecha_str = fecha_match.group(1) if fecha_match else None
        if fecha_str:
            try:
                fecha = datetime.strptime(fecha_str, "%d/%m/%Y").date()
            except:
                try:
                    fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
                except:
                    fecha = datetime.now().date()
        else:
            fecha = datetime.now().date()

        categoria = "Servicios" if "servicios" in full_text.lower() else "Otros"
        descripcion = full_text[:100]
        usuario_id = 1  # Ajusta según tu lógica

        if monto_total is None:
            raise HTTPException(status_code=422, detail="No se pudo extraer el monto total del PDF")

        # Solo devuelve los datos, no guarda automáticamente.
        return {
            "categoria": categoria,
            "monto": monto_total,
            "fecha": fecha.isoformat(),
            "descripcion": descripcion,
            "usuario_id": usuario_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar PDF: {str(e)}")


@router.post("/save-gasto")
async def save_gasto(data: dict):
    try:
        insertar_gasto(
            data.get("categoria"),
            float(data.get("monto")),
            data.get("fecha"),
            data.get("descripcion", ""),
            int(data.get("usuario_id", 1))
        )
        return {"message": "Gasto guardado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar gasto: {str(e)}")
