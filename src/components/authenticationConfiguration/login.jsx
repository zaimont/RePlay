import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";




function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

       

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message); //login exitoso
                //!!!! agrega la redireccion al dashborad principal de pablito
            } else {
                alert(data.message);//credenciales invalidas
            }
        } catch (error) {
            alert('error al conectar con el servidor');
            console.error(error);
        }
    };
    return (
        <section
            className="h-screen w-screen bg-cover bg-center bg-[#E8FAFF]"
            
        >
            <div className="flex justify-start items-start ">
                <h1 class=" font-bold text-black italic text-3xl">RePlay</h1>
            </div>
            <div className="flex-grow flex justify-center items-center">

                <div className="bg-[#B2D6C8] space-y-5 grid m-8 p-8  rounded-2xl shadow-md w-[400px]">
                    <h2 className="font-bold text-lg flex justify-center items-center">Welcome to RePlay Login System </h2>

                    <form onSubmit={handleSubmit} className="p-8 flex flex-col space-y-8 ">
                        <label htmlFor="email" className="text-left text-xs font-bold block text-gray-700  mb-1">
                            Email
                        </label>
                        <input type="email" id="email" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} className="border  bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label htmlFor="password" className="text-gray-700 mb-1 text-xs font-bold text-left ">
                            Password
                        </label>
                        <input type="password" id="password" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} className="border bg-white border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                        <button type="submit"
                            className="bg-[#FFC2A3] m-4 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-300 transition duration-300">
                            Iniciar Sesion
                        </button>
                    </form>
                    <p className="flex justify-center items-center">No tienes Una cuenta?    <Link to="/ForecastSummary" className="text-[#d89c7e] font-bold hover:text-orange-300 transition duration:300">  Sign Up</Link> </p>
                </div>
            </div>
        </section>
    )
}

export default Login;