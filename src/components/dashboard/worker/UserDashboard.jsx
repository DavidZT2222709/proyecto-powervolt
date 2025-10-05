import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import {
  Home,
  Package,
  ClipboardList,
  LogOut,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // 🔹 Redirige al login
  };

  const data = {
    labels: ["Marca A", "Marca B", "Marca C", "Marca D"],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: ["#2563eb", "#facc15", "#22c55e", "#a855f7"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col shadow-lg">
        <div className="p-5 text-center border-b border-blue-500">
          <h1 className="text-2xl font-bold tracking-wide">⚡ POWERSTOCK</h1>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          {/* DASHBOARD */}
          <button
            onClick={() => navigate("/worker")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 transition w-full text-left"
          >
            <Home size={20} /> Dashboard
          </button>

          {/* INVENTARIO */}
          <button
            onClick={() => navigate("/worker/inventario")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 transition w-full text-left"
          >
            <Package size={20} /> Inventario
          </button>

          {/* GARANTÍAS */}
          <button
            onClick={() => navigate("/worker/garantias")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 transition w-full text-left"
          >
            <ClipboardList size={20} /> Garantías
          </button>
        </nav>

        <div className="p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 w-full justify-center p-2 rounded-lg transition"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {/* 👇 Aquí se renderiza dinámicamente el InventoryPanel u otros subpaneles */}
        <Outlet />

        {/* Mostrar Dashboard principal solo si NO hay subruta */}
        {!location.pathname.includes("/inventario") &&
          !location.pathname.includes("/garantias") && (
            <>
              {/* Header */}
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Panel de Usuario
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Bienvenido al sistema de gestión PowerStock
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">Pancho Perez</p>
                    <p className="text-sm text-gray-500">
                      Empleado • Sucursal #1
                    </p>
                  </div>
                </div>
              </header>

              {/* Tarjetas métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Productos */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Productos registrados</h3>
                    <BarChart3 size={22} />
                  </div>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm opacity-90">2 con stock bajo</p>
                </div>

                {/* Entradas */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Movimientos de entrada</h3>
                    <TrendingUp size={22} />
                  </div>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-sm opacity-90">Último registro hace 1h</p>
                </div>

                {/* Salidas */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Movimientos de salida</h3>
                    <TrendingDown size={22} />
                  </div>
                  <p className="text-3xl font-bold">18</p>
                  <p className="text-sm opacity-90">Último registro hace 30min</p>
                </div>
              </div>

              {/* Top productos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-blue-700">
                    <ShoppingCart /> Top productos más vendidos
                  </h3>
                  <ul className="space-y-2 text-gray-700">
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

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-red-600">
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

              {/* Gráfica y sugerencias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-700">
                    <BarChart3 /> Porcentaje de ventas por marca
                  </h3>
                  <Pie data={data} />
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-green-700">
                    <ClipboardList /> Sugerencias de compra
                  </h3>
                  <ul className="space-y-2">
                    <li className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition">
                      Batería X
                    </li>
                    <li className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition">
                      Batería Y
                    </li>
                    <li className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition">
                      Batería Z
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
      </main>
    </div>
  );
}

export default UserDashboard;
