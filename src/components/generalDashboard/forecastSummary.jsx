import React from "react";

function ForecastSummary() {
    return (
        <section className="min-h-screen w-full bg-[#E8FAFF] flex justify-center items-center p-4">
            <div className="bg-[#B2D6C8] rounded-2xl shadow-md p-8 w-full max-w-xl">
                <h2 className="font-bold text-2xl mb-6 text-center text-gray-800">Factura - RePlay</h2>
                <form className="space-y-4">
                    {/* Total Amount y Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1">Total Amount</label>
                            <input type="text"
                                className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="Total Amount" />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1">Currency</label>
                            <input type="text"
                                className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="EUR / USD" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Description</label>
                        <input type="text"
                            className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Description" />
                    </div>

                    {/* Document Date y Document Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1">Document Date</label>
                            <input type="date"
                                className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1">Document Number</label>
                            <input type="text"
                                className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="Document Number" />
                        </div>
                    </div>

                    {/* Period y Sender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1">Period</label>
                            <input type="text"
                                className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="2024/11" />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-700 mb-1">Sender</label>
                            <input type="text"
                                className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="Sender" />
                        </div>
                    </div>

                    {/* Sender City */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Sender City</label>
                        <input type="text"
                            className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Sender City" />
                    </div>

                    {/* Sender Company Name */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Sender Company Name</label>
                        <input type="text"
                            className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Sender Company Name" />
                    </div>

                    {/* Sender VAT */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Sender VAT</label>
                        <input type="text"
                            className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Sender VAT Number" />
                    </div>

                    {/* Sender IBAN */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Sender IBAN</label>
                        <input type="text"
                            className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Sender IBAN" />
                    </div>

                    {/* Total VAT Amount */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-1">Total VAT Amount</label>
                        <input type="text"
                            className="bg-white rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Total VAT Amount" />
                    </div>

                    {/* Submit Button */}
                    <button type="submit"
                        className="bg-[#FFC2A3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-300 transition duration-300 text-lg mt-2">
                        Guardar Factura
                    </button>
                </form>
            </div>
        </section>
    );
}

export default ForecastSummary;