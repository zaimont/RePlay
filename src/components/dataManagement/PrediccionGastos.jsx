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

  // Helper para obtener data y totales según categoría seleccionada
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
    <div
      style={{
        width: "90%",
        margin: "2rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#ff69b4", marginBottom: "1rem" }}>
        📊 Predicción de Gastos por Categoría
      </h2>

      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label
          htmlFor="periodSelect"
          style={{ fontWeight: "600", fontSize: "1.1rem", marginRight: 10 }}
        >
          Selecciona horizonte de predicción:
        </label>
        <select
          id="periodSelect"
          value={periods}
          onChange={(e) => setPeriods(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            cursor: "pointer",
            marginRight: 20,
          }}
        >
          <option value={6}>6 meses</option>
          <option value={12}>1 año</option>
          <option value={24}>2 años</option>
          <option value={36}>3 años</option>
        </select>

        <label
          htmlFor="categorySelect"
          style={{ fontWeight: "600", fontSize: "1.1rem", marginRight: 10 }}
        >
          Selecciona categoría:
        </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          <option value="operaciones">Operaciones</option>
          <option value="inversion">Inversión</option>
          <option value="administracion">Administración</option>
        </select>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Cargando predicciones...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>}

      {!loading && !error && data && (
        <>
          <h3 style={{ textAlign: "center", color }}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h3>
          <Line
            data={data}
            options={{
              ...chartOptions,
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
          />
          <p style={{ textAlign: "center", color: "#555", fontWeight: "600" }}>
            Total estimado: ${total.toFixed(2)}
          </p>
        </>
      )}
    </div>
  );
}
