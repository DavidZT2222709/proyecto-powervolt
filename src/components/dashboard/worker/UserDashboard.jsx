import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
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
  Clock,
} from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userRole");
    navigate("/", { replace: true }); 
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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col shadow-lg">
        <div className="p-5 text-center border-b border-blue-500">
          <h1 className="text-2xl font-bold tracking-wide">⚡ POWERSTOCK</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/worker")}
            className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
              isActive("/worker") ? "bg-blue-600" : "hover:bg-blue-600"
            }`}
          >
            <Home size={20} /> Dashboard
          </button>

          <button
            onClick={() => navigate("/worker/inventario")}
            className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
              isActive("/worker/inventario")
                ? "bg-blue-600"
                : "hover:bg-blue-600"
            }`}
          >
            <Package size={20} /> Inventario
          </button>

          {/* 🔹 Historial (sube arriba de Garantías) */}
          <button
            onClick={() => navigate("/worker/historial")}
            className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
              isActive("/worker/historial")
                ? "bg-blue-600"
                : "hover:bg-blue-600"
            }`}
          >
            <Clock size={20} /> Historial
          </button>

          {/* 🔹 Garantías (ahora queda debajo del historial) */}
          <button
            onClick={() => navigate("/worker/garantias")}
            className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
              isActive("/worker/garantias")
                ? "bg-blue-600"
                : "hover:bg-blue-600"
            }`}
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

      {/* ===== Contenido Principal ===== */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {/* 📌 Aquí se renderizan los subcomponentes de rutas */}
        <Outlet />

        {/* Dashboard visible solo en la ruta base /worker */}
        {!location.pathname.includes("/inventario") &&
          !location.pathname.includes("/garantias") &&
          !location.pathname.includes("/historial") && (
            <>
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

              {/* Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <MetricCard
                  title="Productos registrados"
                  value="3"
                  subtitle="2 con stock bajo"
                  color="from-blue-600 to-blue-500"
                  icon={<BarChart3 size={22} />}
                />
                <MetricCard
                  title="Movimientos de entrada"
                  value="23"
                  subtitle="Último registro hace 1h"
                  color="from-green-500 to-emerald-600"
                  icon={<TrendingUp size={22} />}
                />
                <MetricCard
                  title="Movimientos de salida"
                  value="18"
                  subtitle="Último registro hace 30min"
                  color="from-red-500 to-pink-600"
                  icon={<TrendingDown size={22} />}
                />
              </div>

              {/* Top productos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Top productos más vendidos" icon={<ShoppingCart />}>
                  <TopList
                    items={[
                      ["Falco R32 - GSP D", "45"],
                      ["Mac R32 - GSP D", "30"],
                      ["Rocket R32 - GSP D", "24"],
                    ]}
                  />
                </Card>

                <Card title="Top productos con menor stock" icon={<Package />}>
                  <TopList
                    items={[
                      ["Falco R32 - GSP D", "3"],
                      ["Mac R32 - GSP D", "2"],
                      ["Rocket R32 - GSP D", "4"],
                    ]}
                    red
                  />
                </Card>
              </div>

              {/* Gráfica y sugerencias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card title="Porcentaje de ventas por marca" icon={<BarChart3 />}>
                  <Pie data={data} />
                </Card>

                <Card title="Sugerencias de compra" icon={<ClipboardList />}>
                  <ul className="space-y-2">
                    {["Batería X", "Batería Y", "Batería Z"].map((b, i) => (
                      <li
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </>
          )}
      </main>
    </div>
  );
}

/* ====== Componentes auxiliares ====== */
const MetricCard = ({ title, value, subtitle, color, icon }) => (
  <div
    className={`bg-gradient-to-r ${color} text-white p-5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1`}
  >
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm opacity-90">{subtitle}</p>
  </div>
);

const Card = ({ title, icon, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
    <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-700">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const TopList = ({ items, red = false }) => (
  <ul className="space-y-2">
    {items.map(([name, qty], i) => (
      <li
        key={i}
        className={`flex justify-between ${
          red ? "text-red-600" : "text-gray-700"
        }`}
      >
        <span>{name}</span>
        <span className="font-bold">{qty}</span>
      </li>
    ))}
  </ul>
);

export default UserDashboard;
