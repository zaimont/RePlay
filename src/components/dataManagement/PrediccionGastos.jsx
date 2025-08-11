import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function Prediction() {
  const [periods, setPeriods] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("operaciones");
  const [dataOperaciones, setDataOperaciones] = useState(null);
  const [dataInversion, setDataInversion] = useState(null);
  const [dataAdministracion, setDataAdministracion] = useState(null);
  const [totalOperaciones, setTotalOperaciones] = useState(0);
  const [totalInversion, setTotalInversion] = useState(0);
  const [totalAdministracion, setTotalAdministracion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:8000/prediccion-gastos-categorias?periods=${periods}`
        );
        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }
        const data = await res.json();

        const mapDatos = (datos) =>
          Array.isArray(datos)
            ? datos.map((d) => ({ x: d.ds, y: d.y ?? d.yhat ?? 0 }))
            : [];

        const operaciones = data.operaciones || {};
        const inversion = data.inversion || {};
        const administracion = data.administracion || {};

        setDataOperaciones({
          datasets: [
            {
              label: "Histórico",
              data: mapDatos(operaciones.historicos),
              borderColor: "#1f77b4",
              backgroundColor: "#1f77b4",
              tension: 0.3,
            },
            {
              label: "Predicción",
              data: mapDatos(operaciones.predicciones),
              borderColor: "#aec7e8",
              backgroundColor: "#aec7e8",
              borderDash: [5, 5],
              tension: 0.3,
            },
          ],
        });
        setTotalOperaciones(Number(operaciones.total_predicho) || 0);

        setDataInversion({
          datasets: [
            {
              label: "Histórico",
              data: mapDatos(inversion.historicos),
              borderColor: "#ff7f0e",
              backgroundColor: "#ff7f0e",
              tension: 0.3,
            },
            {
              label: "Predicción",
              data: mapDatos(inversion.predicciones),
              borderColor: "#ffbb78",
              backgroundColor: "#ffbb78",
              borderDash: [5, 5],
              tension: 0.3,
            },
          ],
        });
        setTotalInversion(Number(inversion.total_predicho) || 0);

        setDataAdministracion({
          datasets: [
            {
              label: "Histórico",
              data: mapDatos(administracion.historicos),
              borderColor: "#2ca02c",
              backgroundColor: "#2ca02c",
              tension: 0.3,
            },
            {
              label: "Predicción",
              data: mapDatos(administracion.predicciones),
              borderColor: "#98df8a",
              backgroundColor: "#98df8a",
              borderDash: [5, 5],
              tension: 0.3,
            },
          ],
        });
        setTotalAdministracion(Number(administracion.total_predicho) || 0);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }
    fetchData();
  }, [periods]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "month" },
        title: {
          display: true,
          text: "Fecha",
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        title: {
          display: true,
          text: "Monto ($)",
        },
        beginAtZero: true,
      },
    },
  };

  const getSelectedData = () => {
    switch (selectedCategory) {
      case "operaciones":
        return { data: dataOperaciones, total: totalOperaciones, color: "#1f77b4" };
      case "inversion":
        return { data: dataInversion, total: totalInversion, color: "#ff7f0e" };
      case "administracion":
        return { data: dataAdministracion, total: totalAdministracion, color: "#2ca02c" };
      default:
        return { data: null, total: 0, color: "#000" };
    }
  };

  const { data, total, color } = getSelectedData();

  return (
    <div className="min-h-screen bg-[#B2D6C8] flex flex-col">
      {/* Header fijo */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-black italic text-3xl">RePlay - Predicción de Gastos</h1>
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

      <main className="flex flex-col items-center p-6 flex-grow">
        <h2 className="text-center text-3xl font-bold text-blue-900 mb-8">
          📊 Predicción de Gastos por Categoría
        </h2>

        <div className="mb-8 flex flex-wrap justify-center gap-6">
          <div>
            <label
              htmlFor="periodSelect"
              className="font-semibold text-lg mr-2"
            >
              Selecciona horizonte de predicción:
            </label>
            <select
              id="periodSelect"
              value={periods}
              onChange={(e) => setPeriods(Number(e.target.value))}
              className="p-2 rounded border border-gray-300 cursor-pointer"
            >
              <option value={6}>6 meses</option>
              <option value={12}>1 año</option>
              <option value={24}>2 años</option>
              <option value={36}>3 años</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="categorySelect"
              className="font-semibold text-lg mr-2"
            >
              Selecciona categoría:
            </label>
            <select
              id="categorySelect"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded border border-gray-300 cursor-pointer"
            >
              <option value="operaciones">Operaciones</option>
              <option value="inversion">Inversión</option>
              <option value="administracion">Administración</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-center text-gray-700">Cargando predicciones...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {!loading && !error && data && (
          <>
            <h3 className="text-center text-2xl font-semibold mb-4" style={{ color }}>
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </h3>
            <div
              className="bg-white p-6 rounded shadow-md w-full max-w-5xl"
              style={{ maxHeight: "450px" }}
            >
              <Line
                data={data}
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: `Gastos Históricos y Predicciones - ${selectedCategory
                        .charAt(0)
                        .toUpperCase() + selectedCategory.slice(1)}`,
                    },
                  },
                }}
                height={400}
                width={900}
              />
            </div>
            <p className="text-center text-gray-700 font-semibold mt-4 text-lg">
              Total estimado: ${total.toFixed(2)}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
