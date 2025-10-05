import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
  // Ejemplo datos pie
  const data = {
    labels: ["Marca A", "Marca B", "Marca C", "Marca D"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#2563eb", "#facc15", "#22c55e", "#a855f7"]
      }
    ]
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-700 text-white flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-blue-500">
          POWERSTOCK
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Dashboard
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Inventario
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Usuarios
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Historial
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Garantías
          </a>
          <a href="#" className="block hover:bg-blue-600 p-2 rounded">
            Sucursales
          </a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium">Pancho Perez</span>
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
              Administrador
            </span>
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
              Sucursal #1
            </span>
            <button className="bg-red-600 text-white px-3 py-1 rounded">
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Tarjetas métricas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-gray-600">Total productos registrados</h2>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-red-500">2 con stock bajo</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-gray-600">Movimientos de entrada</h2>
            <p className="text-2xl font-bold">23</p>
            <p className="text-sm text-green-500">Último registro</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <h2 className="text-gray-600">Movimientos de salida</h2>
            <p className="text-2xl font-bold">23</p>
            <p className="text-sm text-green-500">Último registro</p>
          </div>
        </div>

        {/* Contenido abajo */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top productos */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Top productos más vendidos</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Falco r32 - gsp D</span>
                <span className="font-bold">45</span>
              </li>
              <li className="flex justify-between">
                <span>Mac r32 - gsp D</span>
                <span className="font-bold">30</span>
              </li>
              <li className="flex justify-between">
                <span>Rocket r32 - gsp D</span>
                <span className="font-bold">24</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Top productos con menor stock</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-red-600">
                <span>Falco r32 - gsp D</span>
                <span className="font-bold">3</span>
              </li>
              <li className="flex justify-between text-red-600">
                <span>Mac r32 - gsp D</span>
                <span className="font-bold">2</span>
              </li>
              <li className="flex justify-between text-red-600">
                <span>Rocket r32 - gsp D</span>
                <span className="font-bold">4</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Gráfica y sugerencias */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-4">Porcentaje de ventas por marca</h3>
            <Pie data={data} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-4">Sugerencias de compra</h3>
            <ul className="space-y-2">
              <li className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                Batería X
              </li>
              <li className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                Batería Y
              </li>
              <li className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                Batería Z
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
