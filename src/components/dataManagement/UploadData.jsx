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
      setExtractedData({
        categoria: "",
        monto: "",
        fecha: "",
        descripcion: "",
        usuario_id: 1,
      });
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
    <div className="min-h-screen bg-[#B2D6C8] to-white flex flex-col">
      {/* Header fijo */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-black italic text-3xl">RePlay - Captura de Gastos</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenedor principal con flex horizontal */}
      <main className="flex flex-grow max-w-7xl mx-auto p-6 w-full gap-8" style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Izquierda: formulario y botones */}
        <section className="w-1/2 flex flex-col">
          <h2 className="text-3xl font-semibold mb-6 text-blue-900">Subir PDF de factura y extraer gasto</h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mb-6"
            aria-label="Seleccionar archivo PDF"
          />

          <button
            onClick={handleExtractData}
            disabled={!pdfFile || loading}
            className="bg-orange-300 text-white font-semibold  rounded-lg hover:bg-[#FFC2A3] transition duration-300 px-6 py-3"
            aria-busy={loading}
            aria-disabled={!pdfFile || loading}
          >
            {loading ? "Extrayendo datos..." : "Extraer datos con IA"}
          </button>

          <div className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              checked={manualMode}
              onChange={() => setManualMode(!manualMode)}
              id="manualModeToggle"
              className="cursor-pointer"
            />
            <label htmlFor="manualModeToggle" className="text-gray-700 select-none cursor-pointer">
              Editar datos manualmente
            </label>
          </div>

          {(manualMode || extractedData.categoria) && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveData();
              }}
              className="space-y-5"
              aria-label="Formulario para guardar gasto"
            >
              <div>
                <label htmlFor="categoria" className="block text-xs font-bold text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={extractedData.categoria}
                  onChange={(e) => setExtractedData({ ...extractedData, categoria: e.target.value })}
                  disabled={!manualMode}
                  className="border bg-white border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="operaciones">Operaciones</option>
                  <option value="inversion">Inversión</option>
                  <option value="administracion">Administración</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div>
                <label htmlFor="monto" className="block font-semibold text-gray-800 mb-1">
                  Monto
                </label>
                <input
                  id="monto"
                  type="number"
                  step="0.01"
                  value={extractedData.monto}
                  onChange={(e) => setExtractedData({ ...extractedData, monto: e.target.value })}
                  disabled={!manualMode}
                  className="p-3 w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="fecha" className="block font-semibold text-gray-800 mb-1">
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="date"
                  value={extractedData.fecha}
                  onChange={(e) => setExtractedData({ ...extractedData, fecha: e.target.value })}
                  disabled={!manualMode}
                  className="p-3 w-full border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                className="bg-orange-300 text-white font-semibold  rounded-lg hover:bg-[#FFC2A3] transition duration-300 p-3 w-full"
              >
                Guardar gasto
              </button>
            </form>
          )}
        </section>

        {/* Derecha: vista previa PDF */}
        <section className="w-1/2 h-[calc(100vh-96px)] border rounded shadow overflow-auto">
          {pdfUrl ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              aria-label="Vista previa PDF"
              style={{ minHeight: "100%" }}
            >
              <p>Tu navegador no soporta mostrar PDFs.</p>
            </object>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Selecciona un archivo PDF para previsualizar
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PdfGastoExtractor;
