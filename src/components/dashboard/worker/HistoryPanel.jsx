import { ArrowDownCircle, ArrowUpCircle, ClipboardList, User } from "lucide-react";

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
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800">HISTORIAL DE MOVIMIENTOS</h1>
      <p className="text-gray-600 ">
        Registro completo de inventario, entradas y salidas de inventario
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100 text-gray-900 font-semibold text-sm">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 border-b">Fecha</th>
              <th className="px-4 py-3 border-b">Tipo</th>
              <th className="px-4 py-3 border-b">Producto</th>
              <th className="px-4 py-3 border-b">Cantidad</th>
              <th className="px-4 py-3 border-b">Usuario</th>
              <th className="px-4 py-3 border-b">Obs</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{m.fecha}</td>
                <td className="px-4 py-3">{getTipoBadge(m.tipo)}</td>
                <td className="px-4 py-3">{m.producto}</td>
                <td className="px-4 py-3 text-center">{m.cantidad}</td>
                <td className="px-4 py-3 flex items-center gap-2 text-gray-700">
                  <User size={16} /> {m.usuario}
                </td>
                <td className="px-4 py-3 text-gray-500">{m.obs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPanel;
