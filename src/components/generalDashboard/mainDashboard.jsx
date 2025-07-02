import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const barData = [
  { name: "Pagadas", facturas: 30 },
  { name: "Pendientes", facturas: 15 },
  { name: "Vencidas", facturas: 5 },
];

const pieData = [
  { name: "Pagadas", value: 60 },
  { name: "Pendientes", value: 30 },
  { name: "Vencidas", value: 10 },
];

const lineData = [
  { mes: "Ene", total: 4000 },
  { mes: "Feb", total: 3200 },
  { mes: "Mar", total: 4500 },
  { mes: "Abr", total: 3000 },
  { mes: "May", total: 4700 },
];

function MainDashboard() {
  return (
    <section className="p-6 space-y-10">

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow-md">
          <h3 className="font-bold text-blue-900">Facturas este mes</h3>
          <p className="text-2xl">50</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow-md">
          <h3 className="font-bold text-green-900">Total recaudado</h3>
          <p className="text-2xl">$75,000</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md">
          <h3 className="font-bold text-yellow-900">Pendientes</h3>
          <p className="text-2xl">10</p>
        </div>
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Facturas por estado (barras)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="facturas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Pastel */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Distribución de facturas (pastel)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Líneas */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Total facturado por mes (línea)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MainDashboard;
