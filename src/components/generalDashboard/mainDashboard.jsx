import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

const barData = [
  { name: "Arce", ingresos: 262993849 },
  { name: "Caoba", ingresos: 101509235 },
  { name: "Cedro", ingresos: 283916221 },
  { name: "Nogal", ingresos: 465194212 },
  { name: "Pino", ingresos: 562628908 },
  { name: "Roble", ingresos: 197153782 },
];

const pieData = [
  { name: "Exótica", value: 33.8 },
  { name: "Industrial", value: 30.0 },
  { name: "Plaza", value: 36.2 },
];

const horizontalBarData = [
  { trimestre: "Trimestre 1", ingresos: 47611066 },
  { trimestre: "Trimestre 2", ingresos: 432481225 },
  { trimestre: "Trimestre 3", ingresos: 465197239 },
  { trimestre: "Trimestre 4", ingresos: 431486350 },
];

function MainDashboard() {
  return (
    <section className="min-h-screen w-full bg-[#E8FAFF] flex flex-col md:flex-row justify-center items-start p-4 space-y-4 md:space-y-0 md:space-x-4">

      {/* Sidebar izquierdo */}
      <div className="bg-[#B2D6C8] rounded-2xl shadow-md p-4 w-full md:w-1/6 flex flex-col space-y-4">
        <h1 className="text-2xl italic font-bold text-black text-center">RePlay</h1>
        {["Dashboard", "Email", "Account", "Contacts", "Checklist", "Offers", "Back"].map(item => (
          <button
            key={item}
            className="bg-[#B2D6C8] text-black font-semibold py-2 rounded-xl hover:bg-[#A2C6B8] transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Dashboard principal */}
      <div className="flex-grow flex flex-col space-y-4 p-4">

        <h2 className="text-2xl font-bold text-black text-center">Dashboard</h2>

        {/* Gráfico de Barras vertical */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Ingresos Netos por Madera</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ingresos" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráficas Pie y Barras Horizontales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gráfico de Pastel */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">% de Ingresos Netos por Tipo de Madera</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

          {/* Gráfico de Barras Horizontal */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Ingresos Netos y Variaciones por Trimestre</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                layout="vertical"
                data={horizontalBarData}
                margin={{ left: 50 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="trimestre" />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sidebar derecho */}
      <div className="bg-[#B2D6C8] rounded-2xl shadow-md p-4 w-full md:w-1/6 flex flex-col space-y-4">
        {["System", "Settings"].map(item => (
          <button
            key={item}
            className="bg-[#B2D6C8] text-black font-semibold py-2 rounded-xl hover:bg-[#A2C6B8] transition"
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

export default MainDashboard;