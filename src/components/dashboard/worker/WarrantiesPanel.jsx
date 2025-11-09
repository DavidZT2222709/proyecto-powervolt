import React, { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

const WarrantiesPanel = () => {
  const [warranties, setWarranties] = useState([
    {
      id: 1,
      producto: "Falco 32 BBQ Die",
      cliente: "Luz Lopez",
      serial: "24845-23",
      vigencia: "12 meses",
      estado: "Activa",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    producto: "",
    cliente: "",
    serial: "",
    vigencia: "",
    estado: "",
  });

  const handleOpenModal = (warranty = null) => {
    if (warranty) {
      setEditing(warranty.id);
      setFormData(warranty);
    } else {
      setEditing(null);
      setFormData({
        producto: "",
        cliente: "",
        serial: "",
        vigencia: "",
        estado: "",
      });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setWarranties(
        warranties.map((w) =>
          w.id === editing ? { ...formData, id: editing } : w
        )
      );
    } else {
      setWarranties([...warranties, { ...formData, id: warranties.length + 1 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setWarranties(warranties.filter((w) => w.id !== id));
    setDeleteModal(false);
  };

  return (
    <div className="rounded-2xl shadow-sm">
      {/* ====== Encabezado ====== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          GESTIÓN DE GARANTÍAS
        </h1>
        <p className="text-gray-500">
          Registro y control de productos con garantía activa o vencida.
        </p>
      </div>

      {/* ====== Contenedor principal ====== */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Botón de acción principal */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} /> Agregar garantía
          </button>
        </div>

        {/* ====== Tabla ====== */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-2 text-left">Producto</th>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-left">Serial</th>
                <th className="p-2 text-left">Vigencia</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              {warranties.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 border-b h-12">
                  <td className="p-2 align-middle">{w.producto}</td>
                  <td className="p-2 align-middle">{w.cliente}</td>
                  <td className="p-2 align-middle">{w.serial}</td>
                  <td className="p-2 align-middle">{w.vigencia}</td>
                  <td className="p-2 align-middle">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        w.estado === "Activa"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {w.estado}
                    </span>
                  </td>
                  <td className="p-2 align-middle flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenModal(w)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteModal(w.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== Modal Crear / Editar ====== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-red-500 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
              {editing ? "Editar Garantía" : "Crear Garantía"}
            </h3>

            <div className="flex flex-col gap-2">
              {["producto", "cliente", "serial", "vigencia"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />
              ))}

              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
              >
                <option value="">Estado</option>
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>

              <div className="flex justify-end mt-4 gap-2">
                {editing && (
                  <button
                    onClick={() => setDeleteModal(editing)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== Modal Confirmar Eliminación ====== */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-3">Aviso</h3>
            <p className="mb-4">
              ¿Desea eliminar permanentemente esta garantía?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleDelete(deleteModal)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantiesPanel;