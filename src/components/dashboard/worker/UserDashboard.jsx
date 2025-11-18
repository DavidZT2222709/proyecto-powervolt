import React, { useState, useEffect } from "react";
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
  AlertOctagon,
} from "lucide-react";
import { fetchWithToken } from "../../../api/fetchWithToken.js";
import { getGarantias } from "../../../api/garantias";
import { useSucursal } from "../../../context/SucursalContext";

const API_URL = "https://gestor-inventarios-7jm8.onrender.com/api";

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

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSucursal } = useSucursal();

  const [productsCount, setProductsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [entryCount, setEntryCount] = useState(0);
  const [exitCount, setExitCount] = useState(0);
  const [lastEntryText, setLastEntryText] = useState("");
  const [lastExitText, setLastExitText] = useState("");
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [lowestStockProducts, setLowestStockProducts] = useState([]);
  const [purchaseSuggestions, setPurchaseSuggestions] = useState([]);
  const [expiringWarranties, setExpiringWarranties] = useState([]);

  const [brandSalesChartData, setBrandSalesChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#2563eb",
          "#facc15",
          "#22c55e",
          "#a855f7",
          "#f97316",
          "#14b8a6",
        ],
      },
    ],
  });

  const fetchProductsCount = async () => {
    let brandMap = {};
    let stockMap = {};

    try {
      const sucursal = selectedSucursal?.nombre;
      const url = sucursal
        ? `${API_URL}/productos/?sucursal=${encodeURIComponent(sucursal)}`
        : `${API_URL}/productos/`;

      const response = await fetchWithToken(url);
      const data = await response.json();

      setProductsCount(Array.isArray(data) ? data.length : 0);

      const lowStock = Array.isArray(data)
        ? data.filter((p) => p.stock <= 3).length
        : 0;
      setLowStockCount(lowStock);

      if (Array.isArray(data)) {
        brandMap = {};
        stockMap = {};

        data.forEach((p) => {
          brandMap[p.id] = p.marca_nombre || "Sin marca";
          stockMap[p.id] = {
            stock: p.stock ?? 0,
            nombre: `${p.marca_nombre ?? ""} ${p.caja ?? ""} ${
              p.polaridad ?? ""
            }`.trim(),
          };
        });

        const sortedByStockAsc = [...data].sort(
          (a, b) => (a.stock ?? 0) - (b.stock ?? 0)
        );

        const topMinStock = sortedByStockAsc.slice(0, 3);
        const mapped = topMinStock.map((p) => ({
          id: p.id,
          nombre: `${p.marca_nombre ?? ""} ${p.caja ?? ""} ${
            p.polaridad ?? ""
          }`.trim(),
          stock: p.stock ?? 0,
        }));

        setLowestStockProducts(mapped);
      } else {
        setLowestStockProducts([]);
      }

    } catch (error) {
      console.error("Error obteniendo cantidad de productos:", error);
      setProductsCount(0);
      setLowStockCount(0);
      setLowestStockProducts([]);
      brandMap = {};
      stockMap = {};
    }

    return { brandMap, stockMap };
  };

  const fetchInventoriesStats = async (brandMap = {}, stockMap = {}) => {
    try {
      const response = await fetchWithToken(`${API_URL}/inventarios/`);
      const data = await response.json();

      const sucursalName = selectedSucursal?.nombre;

      const filtered = Array.isArray(data)
        ? sucursalName
          ? data.filter((item) => item.sucursal_nombre === sucursalName)
          : data
        : [];

      const entradas = filtered.filter(
        (item) =>
          (item.tipo_inventario_nombre || "").toLowerCase().trim() === "entrada"
      );

      const salidas = filtered.filter(
        (item) =>
          (item.tipo_inventario_nombre || "").toLowerCase().trim() === "salida"
      );

      setEntryCount(entradas.length);
      setExitCount(salidas.length);

      if (entradas.length > 0) {
        const ultimaEntrada = entradas.reduce((latest, item) =>
          !latest || item.fecha_creacion > latest.fecha_creacion ? item : latest
        );
        setLastEntryText(formatTimeAgo(ultimaEntrada.fecha_creacion));
      } else {
        setLastEntryText("");
      }

      if (salidas.length > 0) {
        const ultimaSalida = salidas.reduce((latest, item) =>
          !latest || item.fecha_creacion > latest.fecha_creacion ? item : latest
        );
        setLastExitText(formatTimeAgo(ultimaSalida.fecha_creacion));
      } else {
        setLastExitText("");
      }

      const relevantes = filtered.filter((item) => {
        const tipo = (item.tipo_inventario_nombre || "").toLowerCase().trim();
        return tipo === "inventario" || tipo === "salida";
      });

      const ventasPorProducto = new Map();

      for (const item of relevantes) {
        const id = item.producto_id;
        const nombre = item.producto_nombre;
        const ventas = Number(item.ventas) || 0;

        if (!ventasPorProducto.has(id)) {
          ventasPorProducto.set(id, { id, nombre, totalVentas: 0 });
        }
        ventasPorProducto.get(id).totalVentas += ventas;
      }

      const topVendidos = Array.from(ventasPorProducto.values())
        .sort((a, b) => b.totalVentas - a.totalVentas)
        .slice(0, 3);

      setTopSoldProducts(topVendidos);

      const suggestions = Array.from(ventasPorProducto.values())
        .map((item) => {
          const info = stockMap[item.id] || {};
          const stock = info.stock ?? 0;
          const score = item.totalVentas - stock;

          return {
            id: item.id,
            nombre: info.nombre || item.nombre,
            totalVentas: item.totalVentas,
            stock,
            score,
          };
        })
        .filter((p) => p.stock < 4 && p.totalVentas > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

      setPurchaseSuggestions(suggestions);

      const ventasPorMarca = new Map();

      for (const item of relevantes) {
        const prodId = item.producto_id;
        const marcaNombre = brandMap[prodId] || "Sin marca";
        const ventas = Number(item.ventas) || 0;

        if (!ventasPorMarca.has(marcaNombre)) {
          ventasPorMarca.set(marcaNombre, 0);
        }
        ventasPorMarca.set(
          marcaNombre,
          ventasPorMarca.get(marcaNombre) + ventas
        );
      }

      const labels = Array.from(ventasPorMarca.keys());
      const values = Array.from(ventasPorMarca.values());

      setBrandSalesChartData((prev) => ({
        ...prev,
        labels,
        datasets: [
          {
            ...prev.datasets[0],
            data: values,
          },
        ],
      }));
    } catch (error) {
      console.error("Error obteniendo movimientos de inventario:", error);
      setEntryCount(0);
      setExitCount(0);
      setLastEntryText("");
      setLastExitText("");
      setTopSoldProducts([]);
      setBrandSalesChartData((prev) => ({
        ...prev,
        labels: [],
        datasets: [{ ...prev.datasets[0], data: [] }],
      }));
    }
  };

  const fetchExpiringWarranties = async () => {
    if (!selectedSucursal?.id) {
      setExpiringWarranties([]);
      return;
    }

    try {
      const data = await getGarantias(`?sucursal=${selectedSucursal.id}`);

      const now = new Date();
      const weekMs = 7 * 24 * 60 * 60 * 1000;

      const expiring = [];

      data.forEach((g) => {
        if (!g.fecha_fin_garantia) return;

        const end = new Date(g.fecha_fin_garantia);
        if (isNaN(end.getTime())) return;

        const diffMs = end - now;

        if (
          diffMs > 0 &&
          diffMs <= weekMs &&
          (g.nombre_estado === "Activa" || g.estado === 1)
        ) {
          const daysLeft = Math.ceil(
            diffMs / (1000 * 60 * 60 * 24)
          );

          if (daysLeft <= 0) return;

          expiring.push({
            ...g,
            diasRestantes: daysLeft,
          });
        }
      });

      setExpiringWarranties(expiring);
    } catch (error) {
      console.error("Error obteniendo garantías próximas a vencer:", error);
      setExpiringWarranties([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      const { brandMap, stockMap } = await fetchProductsCount();
      await fetchInventoriesStats(brandMap, stockMap);
      await fetchExpiringWarranties();
    };
    load();
  }, [selectedSucursal]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
        },
      },
    },
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
      </aside>

      {/* ===== Contenido Principal ===== */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <Outlet />

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
              </header>

              {expiringWarranties.length > 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-4 py-3 shadow-sm flex items-start gap-3">
                  <AlertOctagon size={20} className="mt-0.5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-base">
                      Hay {expiringWarranties.length} garantía(s) que vencen en los próximos 7 días.
                    </p>
                    <div className="mt-1 max-h-24 overflow-y-auto pr-1 text-sm">
                      {expiringWarranties.map((g) => (
                        <div
                          key={g.id}
                          className="flex justify-between items-start border-t border-yellow-100 py-1 last:border-b-0"
                        >
                          <div className="pr-2">
                            <span className="font-medium">{g.nombre_producto}</span>
                            <span className="ml-1 text-xs text-yellow-700">
                              — Serial: {g.serial}
                            </span>
                          </div>
                          <span className="text-xs text-yellow-700 whitespace-nowrap ml-2">
                            {g.diasRestantes === 1
                              ? "Queda 1 día"
                              : `Quedan ${g.diasRestantes} días`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <MetricCard
                  title="Productos registrados"
                  value={productsCount.toString()}
                  subtitle={`${lowStockCount} con stock bajo`}
                  color="from-blue-600 to-blue-500"
                  icon={<BarChart3 size={22} />}
                />
                <MetricCard
                  title="Movimientos de entrada"
                  value={entryCount.toString()}
                  subtitle={lastEntryText ? `Último registro ${lastEntryText}` : "Sin registros"}
                  color="from-green-500 to-emerald-600"
                  icon={<TrendingUp size={22} />}
                />
                <MetricCard
                  title="Movimientos de salida"
                  value={exitCount.toString()}
                  subtitle={lastExitText ? `Último registro ${lastExitText}` : "Sin registros"}
                  color="from-red-500 to-pink-600"
                  icon={<TrendingDown size={22} />}
                />
              </div>

              {/* Top productos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Top productos más vendidos" icon={<ShoppingCart />}>
                  <TopList
                    items={topSoldProducts.map(item => [item.nombre, item.totalVentas.toString()])}
                    emptyMessage="Sin datos de ventas"
                  />
                </Card>

                <Card title="Top productos con menor stock" icon={<Package />}>
                  <TopList
                    items={lowestStockProducts.map(item => [item.nombre, item.stock.toString()])}
                    red={true}
                    emptyMessage="Sin datos de stock"
                  />
                </Card>
              </div>

              {/* Gráfica y sugerencias */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card title="Porcentaje de ventas por marca" icon={<BarChart3 />}>
                  <div className="h-80">
                    <Pie data={brandSalesChartData} options={pieOptions} />
                  </div>
                </Card>

                <Card title="Sugerencias de compra" icon={<ClipboardList />}>
                  <ul className="space-y-2">
                    {purchaseSuggestions.length === 0 ? (
                      <li className="text-gray-500 text-sm">Sin sugerencias por ahora</li>
                    ) : (
                      purchaseSuggestions.map((item) => (
                        <li
                          key={item.id}
                          className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition"
                        >
                          {item.nombre}
                        </li>
                      ))
                    )}
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

const TopList = ({ items, red = false, emptyMessage = "Sin datos" }) => (
  <ul className="space-y-2">
    {items.length === 0 ? (
      <li className="text-gray-500 text-sm">{emptyMessage}</li>
    ) : (
      items.map(([name, qty], i) => (
        <li
          key={i}
          className={`flex justify-between ${
            red ? "text-red-600" : "text-gray-700"
          }`}
        >
          <span>{name}</span>
          <span className="font-bold">{qty}</span>
        </li>
      ))
    )}
  </ul>
);

export default UserDashboard;