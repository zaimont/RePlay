import React, { useState, useRef } from "react";
import axios from "axios";

const PdfGastoExtractor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [extractedData, setExtractedData] = useState({
    categoria: "",
    monto: "",
    fecha: "",
    descripcion: "",
    usuario_id: 1,
  });
  const [manualMode, setManualMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
      setExtractedData({ categoria: "", monto: "", fecha: "", descripcion: "", usuario_id: 1 });
      setManualMode(false);
    } else {
      alert("Por favor selecciona un archivo PDF válido.");
    }
  };

  const handleExtractData = async () => {
    if (!pdfFile) return alert("Primero selecciona un PDF.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await axios.post("http://localhost:8000/api/extract-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.categoria) {
        setExtractedData({
          categoria: res.data.categoria || "",
          monto: res.data.monto || "",
          fecha: res.data.fecha || "",
          descripcion: res.data.descripcion || "",
          usuario_id: res.data.usuario_id || 1,
        });
        setManualMode(false);
        alert("Datos extraídos correctamente. Revisa y guarda cuando quieras.");
      } else {
        alert("No se pudo extraer los datos automáticamente.");
        setManualMode(true);
      }
    } catch (error) {
      console.error(error);
      alert("Error al extraer datos. Puedes ingresar manualmente.");
      setManualMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = async () => {
    if (!extractedData.categoria || !extractedData.monto || !extractedData.fecha) {
      return alert("Completa todos los campos antes de guardar.");
    }
    try {
      await axios.post("http://localhost:8000/api/save-gasto", extractedData);
      alert("Datos guardados correctamente");
      setPdfFile(null);
      setPdfUrl(null);
      setExtractedData({ categoria: "", monto: "", fecha: "", descripcion: "", usuario_id: 1 });
      setManualMode(false);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error(error);
      alert("Error al guardar datos.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold mb-4">Subir PDF de factura y extraer gasto</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="mb-4"
      />

      {pdfUrl && (
        <object
          data={pdfUrl}
          type="application/pdf"
          width="100%"
          height="400px"
          aria-label="Vista previa PDF"
        >
          <p>Tu navegador no soporta mostrar PDFs.</p>
        </object>
      )}

      <button
        onClick={handleExtractData}
        disabled={!pdfFile || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Extrayendo datos..." : "Extraer datos con IA"}
      </button>

      <div>
        <label className="inline-flex items-center mt-4">
          <input
            type="checkbox"
            checked={manualMode}
            onChange={() => setManualMode(!manualMode)}
            className="mr-2"
          />
          Editar datos manualmente
        </label>
      </div>

      {(manualMode || extractedData.categoria) && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveData();
          }}
          className="space-y-4 mt-4"
        >
          <div>
            <label className="block font-semibold">Categoría</label>
            <input
              type="text"
              value={extractedData.categoria}
              onChange={(e) => setExtractedData({ ...extractedData, categoria: e.target.value })}
              disabled={!manualMode}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Monto</label>
            <input
              type="number"
              step="0.01"
              value={extractedData.monto}
              onChange={(e) => setExtractedData({ ...extractedData, monto: e.target.value })}
              disabled={!manualMode}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Fecha</label>
            <input
              type="date"
              value={extractedData.fecha}
              onChange={(e) => setExtractedData({ ...extractedData, fecha: e.target.value })}
              disabled={!manualMode}
              className="border p-2 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar gasto
          </button>
        </form>
      )}
    </div>
  );
};

export default PdfGastoExtractor;
