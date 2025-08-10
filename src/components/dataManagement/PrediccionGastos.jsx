// src/pages/Prediction.jsx
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
  TimeScale
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
  const [dataChart, setDataChart] = useState(null);
  const [totalPredicho, setTotalPredicho] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/prediccion-gastos?periods=${periods}`);
        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }
        const data = await res.json();

        const historicos = data.historicos.map(d => ({ x: d.ds, y: d.y }));
        const predicciones = data.predicciones.map(d => ({ x: d.ds, y: d.yhat }));

        setDataChart({
          datasets: [
            {
              label: "Histórico",
              data: historicos,
              borderColor: "#6a5acd",
              backgroundColor: "#6a5acd",
              tension: 0.3
            },
            {
              label: "Predicción",
              data: predicciones,
              borderColor: "#ff69b4",
              backgroundColor: "#ff69b4",
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        });
        setTotalPredicho(data.total_predicho);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [periods]);

  return (
    <div style={{ width: "90%", margin: "2rem auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#ff69b4", marginBottom: "1rem" }}>📊 Predicción de Gastos</h2>

      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <label htmlFor="periodSelect" style={{ fontWeight: "600", fontSize: "1.1rem" }}>
          Selecciona horizonte de predicción:
        </label>
        <select
          id="periodSelect"
          value={periods}
          onChange={e => setPeriods(Number(e.target.value))}
          style={{
            marginLeft: "10px",
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          <option value={6}>6 meses</option>
          <option value={12}>1 año</option>
          <option value={24}>2 años</option>
          <option value={36}>3 años</option>
        </select>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Cargando predicciones...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>}

      {dataChart && !loading && !error && (
        <>
          <Line
            data={dataChart}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top"
                },
                title: {
                  display: true,
                  text: "Gastos Históricos y Predicciones",
                  font: { size: 18 }
                }
              },
              scales: {
                x: {
                  type: "time",
                  time: { unit: "month" },
                  title: {
                    display: true,
                    text: "Fecha"
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: "Monto ($)"
                  },
                  beginAtZero: true
                }
              }
            }}
          />
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#555"
            }}
          >
            El gasto total estimado para los próximos{" "}
            <strong>{periods} {periods === 1 ? "mes" : "meses"}</strong> es de aproximadamente{" "}
            <strong>${totalPredicho.toFixed(2)}</strong>.
          </p>
        </>
      )}
    </div>
  );
}
