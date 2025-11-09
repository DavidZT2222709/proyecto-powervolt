import { ArrowDownCircle, ArrowUpCircle, User } from "lucide-react";

const HistoryPanel = () => {
  const movimientos = [
    {
      fecha: "15/01/2025, 09:30",
      tipo: "Salida",
      producto: "Faico 32 850 De",
      cantidad: -5,
      usuario: "Juan Perez",
      obs: "Revisión de stock",
    },
    {
      fecha: "10/01/2025, 07:20",
      tipo: "Entrada",
      producto: "Faico 32 850 De",
      cantidad: +10,
      usuario: "Juan Perez",
      obs: "Reposición de inventario",
    },
    {
      fecha: "09/01/2025, 10:20",
      tipo: "Inventario",
      producto: "---",
      cantidad: "---",
      usuario: "Juan Perez",
      obs: "Conteo general",
    },
  ];

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case "Entrada":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
            <ArrowUpCircle size={16} /> Entrada
          </span>
        );
      case "Salida":
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
            <ArrowDownCircle size={16} /> Salida
          </span>
        );
      default:
        return (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
            Inventario
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl shadow-sm">
      {/* Encabezado superior */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          HISTORIAL DE MOVIMIENTOS
        </h1>
        <p className="text-gray-500">
          Registro completo de inventario, entradas y salidas de inventario.
        </p>
      </div>

      {/* Contenedor principal con la tabla */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Producto</th>
                <th className="p-2 text-center">Cantidad</th>
                <th className="p-2 text-left">Usuario</th>
                <th className="p-2 text-left">Obs</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b h-12">
                  <td className="p-2 align-middle">{m.fecha}</td>
                  <td className="p-2 align-middle">{getTipoBadge(m.tipo)}</td>
                  <td className="p-2 align-middle">{m.producto}</td>
                  <td className="p-2 align-middle text-center">
                    {m.cantidad}
                  </td>
                  <td className="p-2 align-middle flex items-center gap-2 text-gray-700">
                    <User size={16} /> {m.usuario}
                  </td>
                  <td className="p-2 align-middle text-gray-500">{m.obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;