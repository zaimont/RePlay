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
        r"total\s*(?:factura|a pagar|con impuestos)?[:\s]*\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)",
        r"importe total[:\s]*\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)",
        r"total a pagar[:\s]*\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)",
        r"total con iva[:\s]*\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)",
        r"total[:\s]*\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)"
    ]

    palabras_prohibidas = ["cuenta", "referencia", "folio", "no.", "número", "numero", "cve"]

    candidatos = []

    for linea in lineas:
        linea_lower = linea.lower()

        if any(p in linea_lower for p in palabras_prohibidas):
            continue

        for patron in patrones:
            match = re.search(patron, linea_lower)
            if match:
                monto_raw = match.group(1)
                try:
                    if ',' in monto_raw and '.' in monto_raw:
                        monto_float = float(monto_raw.replace('.', '').replace(',', '.'))
                    elif ',' in monto_raw and monto_raw.count(',') == 1 and ('.' not in monto_raw):
                        monto_float = float(monto_raw.replace(',', '.'))
                    else:
                        monto_float = float(monto_raw.replace(',', ''))
                    
                    if monto_float > 10:
                        candidatos.append(monto_float)
                except:
                    continue

    if candidatos:
        return max(candidatos)

    indices_subtotal = [i for i, l in enumerate(lineas) if "subtotal" in l.lower()]
    start_index = indices_subtotal[-1] + 1 if indices_subtotal else 0
    montos_posibles = []
    for linea in lineas[start_index:]:
        linea_lower = linea.lower()
        if any(p in linea_lower for p in palabras_prohibidas):
            continue

        montos = re.findall(r"\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)", linea)
        for m in montos:
            try:
                monto_raw = m
                if ',' in monto_raw and '.' in monto_raw:
                    monto_float = float(monto_raw.replace('.', '').replace(',', '.'))
                elif ',' in monto_raw and monto_raw.count(',') == 1 and ('.' not in monto_raw):
                    monto_float = float(monto_raw.replace(',', '.'))
                else:
                    monto_float = float(monto_raw.replace(',', ''))
                if monto_float > 10:
                    montos_posibles.append(monto_float)
            except:
                pass

    if montos_posibles:
        return max(montos_posibles)

    return None

def determinar_categoria(texto: str):
    texto_lower = texto.lower()
    if any(palabra in texto_lower for palabra in ["operacion", "operaciones", "servicios", "consumo", "insumos"]):
        return "operaciones"
    if any(palabra in texto_lower for palabra in ["inversion", "inversión", "compra de equipo", "maquinaria"]):
        return "inversion"
    if any(palabra in texto_lower for palabra in ["administracion", "administración", "gastos administrativos", "oficina"]):
        return "administracion"
    return "otros"

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

        categoria = determinar_categoria(full_text)
        descripcion = full_text[:200]
        usuario_id = 1  # Ajusta según tu lógica

        if monto_total is None:
            raise HTTPException(status_code=422, detail="No se pudo extraer el monto total del PDF")

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