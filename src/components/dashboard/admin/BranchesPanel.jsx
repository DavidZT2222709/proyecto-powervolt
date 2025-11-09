import React, { useState } from "react";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";

const BranchesPanel = () => {
  const [branches, setBranches] = useState([
    {
      id: 1,
      nombre: "Sucursal Piedecuesta",
      direccion: "Cra 18 # 8 - 12 Palermo I",
      encargado: "Luis Lopez",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    encargado: "",
  });

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditing(branch.id);
      setFormData(branch);
    } else {
      setEditing(null);
      setFormData({ nombre: "", direccion: "", encargado: "" });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setBranches(
        branches.map((b) => (b.id === editing ? { ...formData, id: editing } : b))
      );
    } else {
      setBranches([...branches, { ...formData, id: branches.length + 1 }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setBranches(branches.filter((b) => b.id !== id));
    setDeleteModal(false);
  };

  return (
    <div className="rounded-2xl shadow-sm">
      {/* ===== Encabezado ===== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE SUCURSALES</h1>
        <p className="text-gray-500">
          Registro y administración de las sucursales registradas en el sistema.
        </p>
      </div>

      {/* ===== Botón principal fuera del listado ===== */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Nueva sucursal
        </button>
      </div>

      {/* ===== Contenedor del listado ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {branches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay sucursales registradas.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {branches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-4 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Building2 size={34} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {b.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">{b.direccion}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Encargado:</span>{" "}
                      {b.encargado}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-2 rounded-md hover:bg-gray-100 transition text-blue-600"
                    title="Editar sucursal"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => setDeleteModal(b.id)}
                    className="p-2 rounded-md hover:bg-gray-100 transition text-red-600"
                    title="Eliminar sucursal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Modal Crear / Editar ===== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              {editing ? "Editar sucursal" : "Crear sucursal"}
            </h3>

            <div className="flex items-start gap-6 mb-4">
              <div className="p-4 rounded-md bg-gray-50 border border-gray-100">
                <Building2 size={48} className="text-blue-600" />
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Encargado"
                    value={formData.encargado}
                    onChange={(e) =>
                      setFormData({ ...formData, encargado: e.target.value })
                    }
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    className="w-full md:col-span-2 border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  {editing && (
                    <button
                      onClick={() => setDeleteModal(editing)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Confirmar Eliminación ===== */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Aviso</h3>
            <p className="mb-4">
              ¿Desea eliminar permanentemente esta sucursal?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleDelete(deleteModal)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
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

export default BranchesPanel;