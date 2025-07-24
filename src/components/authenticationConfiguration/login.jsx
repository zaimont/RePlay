import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error en el servidor');
    }
  };

  return (
    <section className="h-screen w-screen bg-[#E8FAFF] flex flex-col">
      <div className="flex justify-start items-start p-4">
        <h1 className="font-bold text-black italic text-3xl">RePlay</h1>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-[#B2D6C8] space-y-5 p-8 rounded-2xl shadow-md w-[400px]">
          <h2 className="font-bold text-lg text-center">Welcome to RePlay Login System</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <label htmlFor="email" className="text-xs font-bold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />

            <label htmlFor="password" className="text-xs font-bold text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />

            <button to="/register"
              type="submit"
              className="bg-[#FFC2A3] text-white font-semibold py-2 rounded-lg hover:bg-orange-300 transition duration-300"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center">
            ¿No tienes una cuenta?
            <Link to="/register" className="text-[#d89c7e] font-bold hover:text-orange-300 transition duration-300 ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
