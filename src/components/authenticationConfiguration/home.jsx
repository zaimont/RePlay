import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, FileText, TrendingUp, LogOut, User } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Recuperar usuario de localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name || parsedUser.nombre || "Usuario");
      } catch {
        setUserName("Usuario");
      }
    } else {
      // Si no hay sesión, redirigir al login
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-[#B2D6C8] p-6 flex flex-col">
      {/* Encabezado */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-black italic text-3xl">RePlay</h1>

        <div className="flex items-center gap-4">
          {/* Botón Perfil */}
          <button
            onClick={() => navigate("/userProfile")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            title="Ver perfil"
          >
            <User size={18} />
            Perfil
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Bienvenida */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800">
          Bienvenido/a, {userName} 👋
        </h2>
        <p className="text-gray-600">
          Selecciona una acción para comenzar a gestionar tus gastos.
        </p>
      </section>

      {/* Opciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {/* Capturar Facturas */}
        <div
          onClick={() => navigate("/upload-pdf")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
        >
          <FileText className="text-indigo-500 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">Capturar Facturas</h3>
          <p className="text-gray-500 text-sm mt-2">
            Registra nuevas facturas para alimentar el sistema.
          </p>
        </div>

        {/* Ver Predicciones */}
        <div
          onClick={() => navigate("/prediccion")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
        >
          <TrendingUp className="text-green-500 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">Ver Predicciones</h3>
          <p className="text-gray-500 text-sm mt-2">
            Consulta el análisis y proyecciones futuras de gastos.
          </p>
        </div>

        {/* Reportes */}
        <div
          onClick={() => navigate("/reportes")}
          className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
        >
          <BarChart3 className="text-yellow-500 mb-4" size={32} />
          <h3 className="text-lg font-semibold text-gray-800">Reportes</h3>
          <p className="text-gray-500 text-sm mt-2">
            Descarga y revisa reportes financieros detallados.
          </p>
        </div>
      </div>
    </section>
  );
}
