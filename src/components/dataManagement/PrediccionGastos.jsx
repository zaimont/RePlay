import { useState } from "react";
import axios from "axios";

const GastoPredictor = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [gastos, setGastos] = useState([]);
  const [predicciones, setPredicciones] = useState([]);

  const agregarGasto = () => {
    if (year && month && amount) {
      const nuevoGasto = {
        year: parseInt(year),
        month: parseInt(month),
        total_gastos: parseFloat(amount), // debe coincidir con backend
      };
      setGastos([...gastos, nuevoGasto]);
      setYear("");
      setMonth("");
      setAmount("");
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const predecir = async () => {
    if (gastos.length === 0) {
      alert("Agrega al menos un gasto para predecir.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/predecir_gastos", {
        gastos: gastos,
      });
      setPredicciones(response.data.predicciones);
    } catch (error) {
      console.error("Error al predecir gastos:", error);
      alert("Hubo un error al predecir. Revisa la consola.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Agregar gasto histórico</h2>
      <input
        type="number"
        placeholder="Año (e.g. 2024)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-2 border"
      />
      <input
        type="number"
        placeholder="Mes (1-12)"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full p-2 border"
        min={1}
        max={12}
      />
      <input
        type="number"
        placeholder="Total gastos"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border"
      />
      <button
        onClick={agregarGasto}
        className="bg-blue-500 text-white p-2 w-full"
      >
        Agregar
      </button>

      <h3 className="text-lg font-semibold mt-4">Gastos agregados</h3>
      <ul className="list-disc list-inside max-h-48 overflow-auto">
        {gastos.map((g, index) => (
          <li key={index}>
            {g.year} / {g.month} : ${g.total_gastos.toFixed(2)}
          </li>
        ))}
      </ul>

      <button
        onClick={predecir}
        className="bg-green-500 text-white p-2 w-full mt-4"
      >
        Predecir próximos 6 meses
      </button>

      {predicciones.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Predicciones:</h3>
          <ul className="list-disc list-inside">
            {predicciones.map((p, i) => (
              <li key={i}>
                Mes +{p.mes_adelanto}:{" "}
                {typeof p.gasto_estimado === "number"
                  ? `$${p.gasto_estimado.toFixed(2)}`
                  : "Dato no disponible"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GastoPredictor;
