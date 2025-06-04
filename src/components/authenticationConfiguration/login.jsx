import React from "react";
import { useState } from "react";



function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Email: ', email);
        console.log('password: ', password);
    }
    return(
        <section
  className="h-screen w-screen bg-cover bg-center"
  style={{ backgroundImage: "url('/assets/fondoLogin.gif')" }}
>
            <div className="flex justify-start items-start ">
                <h1 className="m-6 text-xl font-bold">RePlay</h1>
            </div>
            <div className="flex-grow flex justify-center items-center">

                <div className="space-y-5 grid m-8 p-8 bg-white rounded-2xl shadow-md w-[400px]">
                <h2 className="font-bold text-lg flex justify-center items-center">Welcome to RePlay Login System </h2>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col space-y-8 ">
                    <label htmlFor="email" className="block text-gray-700  mb-1">
                        Correo Electronico
                    </label>
                    <input type="email" id="email" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa Tu Correo Electronico" value={email} onChange={(e) => setEmail(e.target.value)} required/>

                    <label htmlFor="password" className="text-gray-700 mb-1 "> 
                        Contraseña
                    </label>
                    <input type="password" id="password" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focusring-2 focus:ring-blue-500"
                    placeholder="Ingresa Tu Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                    <button type="submit"
                    className="bg-purple-400 m-4 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
                        Iniciar Sesion
                    </button>
                </form>
                <p className="flex justify-center items-center">No tienes Una cuenta?   <a href="/register.jsx" className="text-purple-400 hover:text-purple-700 transition duration:300">  Sign Up</a> </p>
                </div>
            </div>
        </section>
    )
}

export default Login;