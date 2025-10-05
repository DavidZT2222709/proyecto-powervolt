import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
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

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirige al login
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
          {/* DASHBOARD PRINCIPAL */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded-lg transition w-full text-left"
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          {/* INVENTARIO */}
          <button
            onClick={() => navigate("/admin/inventario")}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded-lg transition w-full text-left"
          >
            <Package size={18} /> Inventario
          </button>

          {/* USUARIOS */}
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded-lg transition w-full text-left"
          >
            <Users size={18} /> Usuarios
          </button>

          {/* HISTORIAL */}
          <button
            onClick={() => navigate("/admin/historial")}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded-lg transition w-full text-left"
          >
            <History size={18} /> Historial
          </button>

          {/* GARANTÍAS */}
          <button
            onClick={() => navigate("/admin/garantias")}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded-lg transition w-full text-left"
          >
            <ShieldCheck size={18} /> Garantías
          </button>

          {/* SUCURSALES */}
          <button
            onClick={() => navigate("/admin/sucursales")}
            className="flex items-center gap-3 hover:bg-blue-500 p-2 rounded-lg transition w-full text-left"
          >
            <MapPin size={18} /> Sucursales
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
        {/* 👇 Esta línea es la clave para renderizar InventoryPanel u otros subpaneles */}
        <Outlet />

        {/* Si no hay subruta (por defecto /admin), mostramos el dashboard original */}
        {!location.pathname.includes("/inventario") &&
          !location.pathname.includes("/usuarios") &&
          !location.pathname.includes("/historial") &&
          !location.pathname.includes("/garantias") &&
          !location.pathname.includes("/sucursales") && (
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
                <div className="flex items-center gap-4 bg-white shadow px-4 py-2 rounded-lg">
                  <div className="text-right">
                    <h2 className="font-semibold text-gray-700">Pancho Perez</h2>
                    <p className="text-sm text-gray-500">
                      Administrador • Sucursal #1
                    </p>
                  </div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
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
                      <span>Falco R32 - GSP D</span>{" "}
                      <span className="font-bold">45</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Mac R32 - GSP D</span>{" "}
                      <span className="font-bold">30</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Rocket R32 - GSP D</span>{" "}
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
                      <span>Falco R32 - GSP D</span>{" "}
                      <span className="font-bold">3</span>
                    </li>
                    <li className="flex justify-between text-red-600">
                      <span>Mac R32 - GSP D</span>{" "}
                      <span className="font-bold">2</span>
                    </li>
                    <li className="flex justify-between text-red-600">
                      <span>Rocket R32 - GSP D</span>{" "}
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
      </main>
    </div>
  );
}

export default AdminDashboard;
