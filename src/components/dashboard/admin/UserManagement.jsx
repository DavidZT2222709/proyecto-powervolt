import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, X, CheckCircle, UserPlus } from "lucide-react";

const UserManagement = () => {
  const [modal, setModal] = useState({ open: false, type: "", user: null });

  const [users, setUsers] = useState([
    {
      id: 1,
      nombre: "Carlos Pérez",
      correo: "carlos@powerstock.com",
      rol: "Administrador",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "María Gómez",
      correo: "maria@powerstock.com",
      rol: "Vendedor",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Julián Rojas",
      correo: "julian@powerstock.com",
      rol: "Inventarista",
      estado: "Inactivo",
    },
  ]);

  const [newUser, setNewUser] = useState({
    nombre: "",
    correo: "",
    rol: "",
    estado: "Activo",
  });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const openModal = (type, user = null) => {
    setModal({ open: true, type, user });
    if (type === "edit" && user) setNewUser(user);
  };

  const closeModal = () => {
    setModal({ open: false, type: "", user: null });
    setNewUser({ nombre: "", correo: "", rol: "", estado: "Activo" });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modal.type === "add") {
      setUsers([...users, { id: Date.now(), ...newUser }]);
    } else if (modal.type === "edit") {
      setUsers(users.map((u) => (u.id === modal.user.id ? newUser : u)));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    closeModal();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE USUARIOS</h1>
        <p className="text-gray-500">
          Administra las cuentas y roles del sistema PowerStock.
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Agregar usuario
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left text-gray-700">
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Estado</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 border-b">
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.correo}</td>
                <td className="p-2">{u.rol}</td>
                <td className={`p-2 font-semibold ${
                  u.estado === "Activo" ? "text-green-600" : "text-red-600"
                }`}>
                  {u.estado}
                </td>
                <td className="p-2 text-center flex justify-center gap-5">
                  {/* Editar */}
                  <Edit
                    size={20}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                    onClick={() => openModal("edit", u)}
                  />
                  {/* Eliminar */}
                  <Trash2
                    size={20}
                    className="text-red-600 hover:text-red-800 cursor-pointer transition"
                    onClick={() => openModal("delete", u)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALES */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh] font-[Inter,sans-serif]">
            {/* Cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition"
            >
              <X size={20} />
            </button>

            {/* Agregar / Editar */}
            {(modal.type === "add" || modal.type === "edit") && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
                  {modal.type === "add" ? "Agregar Usuario" : "Editar Usuario"}
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium">Nombre</label>
                    <input
                      name="nombre"
                      value={newUser.nombre}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Correo</label>
                    <input
                      name="correo"
                      type="email"
                      value={newUser.correo}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Rol</label>
                    <select
                      name="rol"
                      value={newUser.rol}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Vendedor">Vendedor</option>
                      <option value="Inventarista">Inventarista</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">Estado</label>
                    <select
                      name="estado"
                      value={newUser.estado}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Eliminar */}
            {modal.type === "delete" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-[#D50000] text-center">
                  Eliminar usuario
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  ¿Seguro que deseas eliminar al usuario{" "}
                  <span className="font-semibold">{modal.user?.nombre}</span>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(modal.user.id)}
                    className="bg-[#D50000] hover:bg-[#C00000] text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
