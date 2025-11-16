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
import UserManagement from "./UserManagement.jsx";
import HistoryPanel from "./HistoryPanel";
import BranchesPanel from "./BranchesPanel.jsx"
import WarrantiesPanel from './WarrantiesPanel.jsx';
import { fetchWithToken } from "../../../api/fetchWithToken.js";
import { useSucursal } from "../../../context/SucursalContext";

const API_URL = "http://localhost:8000/api";

// Formatea un ISO date a "hace Xmin / hace Xh / hace X días"
const formatTimeAgo = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "hace menos de 1 min";
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} día${diffDays === 1 ? "" : "s"}`;
};


function AdminDashboard() {

  // sucursal desde el contexto
  const { selectedSucursal } = useSucursal();

  // Detectar si hay un hash en la URL (#/admin/usuarios, etc.)
  const getInitialView = () => {


    const hash = window.location.hash;
    if (hash.includes("inventario")) return "inventario";
    if (hash.includes("usuarios")) return "usuarios";
    if (hash.includes("historial")) return "historial";
    if (hash.includes("garantias")) return "garantias";
    if (hash.includes("sucursales")) return "sucursales";
    return "dashboard";
  };

  const [activeView, setActiveView] = useState(getInitialView);
  const [productsCount, setProductsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  const [entryCount, setEntryCount] = useState(0);       // cantidad de entradas
  const [exitCount, setExitCount] = useState(0);         // cantidad de salidas
  const [lastEntryText, setLastEntryText] = useState(""); // texto "hace X..." entrada
  const [lastExitText, setLastExitText] = useState("");   // texto "hace X..." salida


  const fetchProductsCount = async () => {
    try {
      const sucursal = selectedSucursal?.nombre;
      const url = sucursal
        ? `${API_URL}/productos/?sucursal=${encodeURIComponent(sucursal)}`
        : `${API_URL}/productos/`;

      const response = await fetchWithToken(url);
      const data = await response.json();

      // total de productos
      setProductsCount(Array.isArray(data) ? data.length : 0);

      // contar productos con stock bajo (< 3)
      const lowStock = Array.isArray(data)
        ? data.filter((p) => p.stock <= 3).length
        : 0;

      setLowStockCount(lowStock);

    } catch (error) {
      console.error("Error obteniendo cantidad de productos:", error);
      setProductsCount(0);
      setLowStockCount(0);
    }
  };

  // Obtener movimientos de inventario (entradas / salidas) por sucursal
  const fetchInventoriesStats = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/inventarios/`);
      const data = await response.json();

      const sucursalName = selectedSucursal?.nombre;

      // Filtrar por sucursal si hay una seleccionada
      const filtered = Array.isArray(data)
        ? sucursalName
          ? data.filter((item) => item.sucursal_nombre === sucursalName)
          : data
        : [];

      // Entradas
      const entradas = filtered.filter(
        (item) =>
          (item.tipo_inventario_nombre || "").toLowerCase().trim() === "entrada"
      );

      // Salidas
      const salidas = filtered.filter(
        (item) =>
          (item.tipo_inventario_nombre || "").toLowerCase().trim() === "salida"
      );

      setEntryCount(entradas.length);
      setExitCount(salidas.length);

      // Última entrada (por fecha_creacion)
      if (entradas.length > 0) {
        const ultimaEntrada = entradas.reduce((latest, item) =>
          !latest || item.fecha_creacion > latest.fecha_creacion ? item : latest
        );
        setLastEntryText(formatTimeAgo(ultimaEntrada.fecha_creacion));
      } else {
        setLastEntryText("");
      }

      // Última salida (por fecha_creacion)
      if (salidas.length > 0) {
        const ultimaSalida = salidas.reduce((latest, item) =>
          !latest || item.fecha_creacion > latest.fecha_creacion ? item : latest
        );
        setLastExitText(formatTimeAgo(ultimaSalida.fecha_creacion));
      } else {
        setLastExitText("");
      }
    } catch (error) {
      console.error("Error obteniendo movimientos de inventario:", error);
      setEntryCount(0);
      setExitCount(0);
      setLastEntryText("");
      setLastExitText("");
    }
  };


  // Actualiza el hash al cambiar de vista (esto evita el error al recargar)
  useEffect(() => {
    window.location.hash = `#/admin/${activeView}`;
  }, [activeView]);

  // cada vez que cambie la sucursal, recargar productos y movimientos
  useEffect(() => {
    fetchProductsCount();
    fetchInventoriesStats();
  }, [selectedSucursal]);

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
            onClick={() => setActiveView("usuarios")}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full text-left ${
              activeView === "usuarios" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <Users size={18} /> Usuarios
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

          <button
            onClick={() => setActiveView("sucursales")}
            className={`flex items-center gap-3 p-2 rounded-lg transition w-full text-left ${
              activeView === "sucursales" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
          >
            <MapPin size={18} /> Sucursales
          </button>
        </nav>
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
                <p className="text-3xl font-bold">{productsCount}</p>
                <p className="text-sm">{lowStockCount} con stock bajo</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow hover:scale-105 transition transform">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Movimientos de entrada</h2>
                  <TrendingUp />
                </div>
                <p className="text-3xl font-bold">{entryCount}</p>
                <p className="text-sm">
                  {lastEntryText ? `Último registro ${lastEntryText}` : "Sin registros"}
                </p>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow hover:scale-105 transition transform">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Movimientos de salida</h2>
                  <TrendingDown />
                </div>
                <p className="text-3xl font-bold">{exitCount}</p>
                <p className="text-sm">
                  {lastExitText ? `Último registro ${lastExitText}` : "Sin registros"}
                </p>
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

        {activeView === "inventario" && (
          <InventoryPanel
            onProductsChanged={() => {
              fetchProductsCount();
              fetchInventoriesStats(); // ⬅️ NUEVO
            }}
          />
        )}
        {activeView === "usuarios" && <UserManagement />}
        {activeView === "historial" && <HistoryPanel />}
        {activeView === "garantias" && <WarrantiesPanel />}
        {activeView === "sucursales" && <BranchesPanel />}
      </main>
    </div>
  );
}

export default AdminDashboard;
