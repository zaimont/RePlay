import React, { useState } from "react";

function Register() {
  const [checked, setChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checked) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role, fullName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Aquí puedes redirigir al dashboard si quieres
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    }
  };

  return (
    <section className="h-screen w-screen bg-cover bg-[#E8FAFF]">
      <div className="flex justify-start items-start">
        <h2 className="text-black italic text-3xl font-bold">Replay</h2>
      </div>
      <div className="justify-center flex-grow justify-items-center bg-[#B2D6C8] space-y-5 grid m-8 p-8 rounded-2xl shadow-md w-[400px]">
        <h2 className="text-black italic text-xl font-bold">Replay</h2>
        <p className="font-bold">Registro del usuario principal de la empresa</p>
        <form onSubmit={handleSubmit} className="grid">
          <label className="text-xs text-left">Nombre completo</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-white border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <label className="text-xs text-left">Correo empresarial</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white rounded-lg border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <label className="text-xs text-left">Rol</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white rounded-lg border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <label className="text-xs text-left">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <label className="text-xs text-left">Confirmar contraseña</label>
          <input type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)} 
          className="bg-white border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-orange-300"/>

          <label className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-orange-500"
            />
            <span>Acepto los términos y la política de privacidad</span>
          </label>

          <button
            type="submit"
            className="bg-[#FFC2A3] m-4 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-300 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
