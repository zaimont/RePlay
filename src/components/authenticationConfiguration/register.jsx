import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checked) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    if (!name || !role || !email || !password || !confirmPass) {
      alert('Por favor llena todos los campos');
      return;
    }

    if (password !== confirmPass) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/registercompany');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    }
  };

  const inputClass = "border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300";

  return (
    <section className="h-screen w-screen bg-[#E8FAFF] flex flex-col">
      <div className="flex justify-start items-start p-4">
        <h1 className="font-bold text-black italic text-3xl">RePlay</h1>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-[#B2D6C8] space-y-5 p-8 rounded-2xl shadow-md w-[400px]">
          <h2 className="font-bold text-xl text-center">Registro del usuario principal de la empresa</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <label className="text-xs font-semibold">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />

            <label className="text-xs font-semibold">Correo empresarial</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />

            <label className="text-xs font-semibold">Rol</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
              required
            />

            <label className="text-xs font-semibold">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />

            <label className="text-xs font-semibold">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className={inputClass}
              required
            />

            <label className="flex items-center space-x-2 mt-4 text-xs">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="form-checkbox h-5 w-5 text-orange-500"
              />
              <span>Acepto los términos y la política de privacidad</span>
            </label>

            <button
              type="submit"
              className="bg-[#FFC2A3] text-white font-semibold py-2 rounded-lg hover:bg-orange-300 transition duration-300"
            >
              Sign Up
            </button>
            <p>Deseas registrar tu empresa?</p>
            <Link to="/register-company">Haz click aqui para registrar tu compañia!</Link>         
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
