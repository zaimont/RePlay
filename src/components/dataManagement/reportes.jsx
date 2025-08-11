import React, { useState, useRef } from "react";

export default function Reportes() {
  const [periods, setPeriods] = useState(6);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const pdfPreviewRef = useRef();

  // Función para generar reporte real
  const generarReporte = async () => {
    setLoading(true);
    setPdfUrl(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/reporte-gastos?periods=${periods}`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      // Recibimos un blob PDF
      const blob = await response.blob();

      // Creamos URL para mostrar y descargar
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      alert("Error al generar reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Descargar PDF
  const descargarReporte = () => {
    if (!pdfUrl) return alert("Genera primero el reporte.");
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `reporte_gastos_${periods}_meses.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#B2D6C8] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-black italic text-3xl">RePlay - Reportes</h1>
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

      {/* Contenedor principal */}
      <main
        className="flex flex-grow max-w-7xl mx-auto p-6 w-full gap-8"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {/* Izquierda: controles */}
        <section className="w-1/2 flex flex-col">
          <h2 className="text-3xl font-semibold mb-6 text-blue-900">Generar Reporte de Gastos</h2>

          <label
            htmlFor="periods"
            className="font-semibold text-gray-800 mb-2"
          >
            Horizonte del reporte (meses):
          </label>
          <select
            id="periods"
            value={periods}
            onChange={(e) => setPeriods(Number(e.target.value))}
            className="border bg-white border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={loading}
          >
            <option value={6}>6 meses</option>
            <option value={12}>1 año</option>
            <option value={24}>2 años</option>
            <option value={36}>3 años</option>
          </select>

          <button
            onClick={generarReporte}
            className="bg-orange-300 text-white font-semibold rounded-lg hover:bg-[#FFC2A3] transition duration-300 p-3 mb-4"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Generando reporte..." : "Generar Reporte PDF"}
          </button>

          <button
            onClick={descargarReporte}
            disabled={!pdfUrl}
            className={`font-semibold rounded-lg p-3 text-white transition duration-300 ${
              pdfUrl ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Descargar Reporte
          </button>
        </section>

        {/* Derecha: Previsualización PDF */}
        <section
          className="w-1/2 h-[calc(100vh-96px)] border rounded shadow overflow-auto"
          aria-label="Previsualización del reporte PDF"
          ref={pdfPreviewRef}
        >
          {pdfUrl ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              aria-label="Vista previa del reporte PDF"
              style={{ minHeight: "100%" }}
            >
              <p>Tu navegador no soporta mostrar PDFs.</p>
            </object>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 italic">
              Genera un reporte para previsualizarlo aquí
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
