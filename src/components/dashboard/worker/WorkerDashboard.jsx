import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  LayoutDashboard,
  Package,
  Users,
  History,
  ShieldCheck,
  MapPin,
  LogOut,
  ClipboardList,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import InventoryPanel from "../../InventoryPanel.jsx";
import HistoryPanel from "./HistoryPanel.jsx";
import WarrantiesPanel from './WarrantiesPanel.jsx';



function UserDashboard() {
  // Detectar si hay un hash en la URL (#/admin/usuarios, etc.)
  const getInitialView = () => {
    const hash = window.location.hash;
    if (hash.includes("inventario")) return "inventario";
    if (hash.includes("historial")) return "historial";
    if (hash.includes("garantias")) return "garantias";

    
    return "dashboard";
  };

  const [activeView, setActiveView] = useState(getInitialView);

  // 🔹 Actualiza el hash al cambiar de vista (esto evita el error al recargar)
  useEffect(() => {
    window.location.hash = `#/admin/${activeView}`;
  }, [activeView]);

  // 🔹 Cerrar sesión: redirige al login (inicio)
  const handleLogout = () => {
    window.location.href = "/";
  };

  const data = {
    labels: ["Marca A", "Marca B", "Marca C", "Marca D"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#2563eb", "#facc15", "#22c55e", "#a855f7"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white flex flex-col shadow-lg">
        <div className="p-5 text-2xl font-extrabold border-b border-blue-500 flex items-center gap-2">
          ⚡ PowerStock
        </div>

        <nav className="flex-1 p-4 space-y-3">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full text-left ${
              activeView === "dashboard" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => setActiveView("inventario")}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full text-left ${
              activeView === "inventario" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <Package size={18} /> Inventario
          </button>

          <button
            onClick={() => setActiveView("historial")}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full text-left ${
              activeView === "historial" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <History size={18} /> Historial
          </button>

          <button
            onClick={() => setActiveView("garantias")}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full text-left ${
              activeView === "garantias" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <ShieldCheck size={18} /> Garantías
          </button>

        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 justify-center bg-red-600 hover:bg-red-700 m-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeView === "dashboard" && (
          <>
            {/* HEADER */}
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Panel de Administración
                </h1>
                <p className="text-gray-500">
                  Bienvenido al sistema de gestión PowerStock
                </p>
              </div>
            </header>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow hover:scale-105 transition transform">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Productos registrados</h2>
                  <BarChart3 />
                </div>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm">2 con stock bajo</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow hover:scale-105 transition transform">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Movimientos de entrada</h2>
                  <TrendingUp />
                </div>
                <p className="text-3xl font-bold">23</p>
                <p className="text-sm">Último registro hace 1h</p>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow hover:scale-105 transition transform">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Movimientos de salida</h2>
                  <TrendingDown />
                </div>
                <p className="text-3xl font-bold">18</p>
                <p className="text-sm">Último registro hace 30min</p>
              </div>
            </div>

            {/* LISTAS Y GRÁFICAS */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <ShoppingCart /> Top productos más vendidos
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Falco R32 - GSP D</span>
                    <span className="font-bold">45</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mac R32 - GSP D</span>
                    <span className="font-bold">30</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rocket R32 - GSP D</span>
                    <span className="font-bold">24</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="font-bold mb-3 text-gray-700 flex items-center gap-2">
                  <Package /> Top productos con menor stock
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between text-red-600">
                    <span>Falco R32 - GSP D</span>
                    <span className="font-bold">3</span>
                  </li>
                  <li className="flex justify-between text-red-600">
                    <span>Mac R32 - GSP D</span>
                    <span className="font-bold">2</span>
                  </li>
                  <li className="flex justify-between text-red-600">
                    <span>Rocket R32 - GSP D</span>
                    <span className="font-bold">4</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                  <BarChart3 /> Porcentaje de ventas por marca
                </h3>
                <Pie data={data} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h3 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
                  <ClipboardList /> Sugerencias de compra
                </h3>
                <ul className="space-y-2">
                  <li className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                    Batería X
                  </li>
                  <li className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                    Batería Y
                  </li>
                  <li className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                    Batería Z
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {activeView === "inventario" && <InventoryPanel />}
        {activeView === "usuarios" && <UserManagement />}
        {activeView === "historial" && <HistoryPanel />}
        {activeView === "garantias" && <WarrantiesPanel />}
        {activeView === "sucursales" && <BranchesPanel />}
      </main>
    </div>
  );
}

export default UserDashboard;
