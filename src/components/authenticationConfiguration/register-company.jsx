import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterCompany() {
    const [company, setCompany] = useState("");
    const [sectorIndustry, setSectorIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [fiscalPeriod, setFiscalPeriod] = useState("");
    const [rfcTaxId, setRfcTaxId] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [yearsOperation, setYearsOperation] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/registercompany', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company,
                    sector_industry: sectorIndustry,
                    company_size: companySize,
                    fiscal_period: fiscalPeriod,
                    tax_id: rfcTaxId,
                    country,
                    city,
                    years_operation: yearsOperation
                }),
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/Login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error en el servidor');
        }
    }

    return (
        <section className="h-screen w-screen bg-[#E8FAFF] flex flex-col">
            <div className="flex justify-start items-start p-4">
                <h2 className="font-bold text-black italic text-3xl">RePlay</h2>
            </div>
            <div className="flex-grow flex justify-center items-center">
                <div className="bg-[#B2D6C8] space-y-5 p-8 rounded-2xl shadow-md w-[400px]">
                    <h2 className="font-bold text-xl text-center">Registra tu compañia</h2>
                    <form
                        onSubmit={handleSubmit} className="flex flex-col space-y-4"
                    >
                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            Nombre de la empresa
                            <input
                                type="text"
                                value={company}
                                onChange={e => setCompany(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            Sector/Industria
                            <input
                                type="text"
                                value={sectorIndustry}
                                onChange={e => setSectorIndustry(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            Tamaño de la empresa
                            <input
                                type="text"
                                value={companySize}
                                onChange={e => setCompanySize(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            Periodo fiscal
                            <input
                                type="text"
                                value={fiscalPeriod}
                                onChange={e => setFiscalPeriod(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            RFC / ID fiscal
                            <input
                                type="text"
                                value={rfcTaxId}
                                onChange={e => setRfcTaxId(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            País
                            <input
                                type="text"
                                value={country}
                                onChange={e => setCountry(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            Ciudad
                            <input
                                type="text"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                required
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>

                        <label className="flex flex-col text-gray-700 text-sm font-medium">
                            Años en operación
                            <input
                                type="number"
                                value={yearsOperation}
                                onChange={e => setYearsOperation(e.target.value)}
                                required
                                min="0"
                                className="mt-1 p-2 border bg-white rounded-lg border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                        </label>



                        <button
                            type="submit"
                            className="bg-[#FFC2A3] text-white font-semibold py-2 rounded-lg hover:bg-orange-300 transition duration-300"
                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </div>

        </section>
    )
}

export default RegisterCompany;
