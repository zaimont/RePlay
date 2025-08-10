import React, { useState, useEffect } from "react";
import axios from "axios";

const GastosManager = () => {
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [gastos, setGastos] = useState([]);

  // Cargar gastos desde backend
  const cargarGastos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gastos");
      setGastos(response.data);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  // Enviar gasto nuevo al backend
  const agregarGasto = async () => {
    if (!categoria || !monto || !fecha) {
      alert("Por favor llena todos los campos");
      return;
    }
    try {
      await axios.post("http://localhost:5000/agregar-gasto", {
        categoria,
        monto: parseFloat(monto),
        fecha,
      });
      setCategoria("");
      setMonto("");
      setFecha("");
      cargarGastos(); // refrescar lista
    } catch (error) {
      console.error("Error al agregar gasto:", error);
      alert("Error al agregar gasto, revisa consola.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Agregar Gasto Histórico</h2>

      <input
        type="text"
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full p-2 border"
      />

      <button
        onClick={agregarGasto}
        className="bg-blue-600 text-white p-2 w-full rounded"
      >
        Agregar Gasto
      </button>

      <h3 className="text-lg font-semibold mt-4">Gastos Guardados</h3>
      <ul className="list-disc list-inside max-h-64 overflow-y-auto">
        {gastos.length === 0 && <li>No hay gastos registrados.</li>}
        {gastos.map((gasto) => (
          <li key={gasto.id || `${gasto.fecha}-${gasto.categoria}`}>
            {gasto.fecha} - {gasto.categoria} : ${gasto.monto.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GastosManager;
