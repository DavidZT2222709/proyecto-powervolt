import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser, getRoles } from "../../../api/usuarios"; 
import toast from "react-hot-toast";

const UserManagement = () => {
  const [modal, setModal] = useState({ open: false, type: "", user: null });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesMap, setRolesMap] = useState({});
  const [newUser, setNewUser] = useState({
    nombre: "",
    email: "",
    username: "",
    numero_telefono: "",
    rol_id: "",
    password: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRoles(token);
      setRoles(data);

      const map = {};
      data.forEach(r => {
        map[String(r.id)] = r.nombre;
      });
      setRolesMap(map);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: name === "rol_id" ? parseInt(value, 10) : value
    });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const payload = {
        nombre: newUser.nombre,
        username: newUser.username,
        email: newUser.email,
        numero_telefono: newUser.numero_telefono,
        rol_id: newUser.rol_id,
        password: newUser.password
      };

      if (modal.type === "edit" && !payload.password) delete payload.password;

      console.log("Guardando usuario limpio:", payload);

      if (modal.type === "add") {
        await createUser(payload);
        alert("✅ Usuario creado correctamente");
      } else {
        const payload = {
        nombre: newUser.nombre,
        username: newUser.username,
        email: newUser.email,
        numero_telefono: newUser.numero_telefono,
        rol: newUser.rol_id,
        password: newUser.password
      };
        await updateUser(newUser.id, payload);
        alert("✅ Usuario actualizado correctamente");
      }

      await loadUsers();
      closeModal();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toast.error("❌ Error al guardar usuario. Verifica los campos.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, token);
      await loadUsers();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (type, user = null) => {
    setModal({ open: true, type, user });
    if (type === "edit" && user) {
      setNewUser({ ...user });
    } else {
      setNewUser({
        id: null,
        nombre: "",
        username: "",
        email: "",
        rol_id: "",
        numero_telefono: "",
        password: "",
      }
    );
  };

  const closeModal = () => {
    setModal({ open: false, type: "", user: null });
  };

  return (
    <div className="rounded-2xl shadow-sm">
      {/* ===== Encabezado ===== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          GESTIÓN DE USUARIOS
        </h1>
        <p className="text-gray-500">
          Administra las cuentas y roles del sistema PowerStock.
        </p>
      </div>

      {/* ===== Contenedor principal ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Botón de acción principal */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <PlusCircle size={18} /> Agregar usuario
          </button>
        </div>

        {/* ===== Tabla ===== */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Correo</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 border-b h-12">
                  <td className="p-2 align-middle">{u.nombre}</td>
                  <td className="p-2 align-middle">{u.correo}</td>
                  <td className="p-2 align-middle">{u.rol}</td>
                  <td
                    className={`p-2 align-middle font-semibold ${
                      u.estado === "Activo"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {u.estado}
                  </td>
                  <td className="p-2 align-middle text-center flex justify-center gap-5">
                    <Edit
                      size={20}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                      onClick={() => openModal("edit", u)}
                    />
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
      </div>

      {/* ===== Modal ===== */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition"
            >
              <X size={20} />
            </button>

            {(modal.type === "add" || modal.type === "edit") && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
                  {modal.type === "add"
                    ? "Agregar Usuario"
                    : "Editar Usuario"}
                </h2>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Nombre
                    </label>
                    <input
                      name="nombre"
                      value={newUser.nombre}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring focus:ring-blue-200"
                      required
                    />
                    {formErrors.nombre && <p className="text-red-600 text-sm mt-1">{formErrors.nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Correo
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={newUser.correo}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Rol</label>
                    <select
                      name="rol_id"
                      value={newUser.rol_id || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring focus:ring-blue-200"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={newUser.estado}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring focus:ring-blue-200"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>

                  {modal.type === "add" && (
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium">Contraseña</label>
                      <input
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 mt-1"
                        required
                      />
                      {formErrors.password && <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>}
                    </div>
                  )}

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

            {modal.type === "delete" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-red-600 text-center">
                  Eliminar usuario
                </h2>
                <p className="text-center text-gray-600 mb-6">
                  ¿Seguro que deseas eliminar al usuario{" "}
                  <span className="font-semibold">
                    {modal.user?.nombre}
                  </span>
                  ?
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
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
