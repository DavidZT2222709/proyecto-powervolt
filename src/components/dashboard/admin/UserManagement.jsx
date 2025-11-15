import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";

// API
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  toggleUserStatus
} from "../../../api/usuarios";

// TOASTIFY (ya no usamos react-hot-toast)
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [modal, setModal] = useState({ open: false, type: "", user: null });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesMap, setRolesMap] = useState({});
  const [search, setSearch] = useState("");

  const [newUser, setNewUser] = useState({
    id: null,
    nombre: "",
    email: "",
    username: "",
    numero_telefono: "",
    rol_id: "",
    password: "",
    is_active: true
  });

  const token = localStorage.getItem("access_token");

  /* =============================
      LOAD INITIAL DATA
  ============================== */
  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error(error);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRoles(token);
      setRoles(data);

      const map = {};
      data.forEach((r) => {
        map[String(r.id)] = r.nombre;
      });
      setRolesMap(map);
    } catch (error) {
      toast.error("Error al cargar roles");
      console.error(error);
    }
  };

  /* =============================
      MODALS
  ============================== */
  const openModal = (type, user = null) => {
    setModal({ open: true, type, user });

    setNewUser(
      user || {
        id: null,
        nombre: "",
        email: "",
        username: "",
        numero_telefono: "",
        rol_id: "",
        password: "",
        is_active: true
      }
    );
  };

  const closeModal = () => {
    setModal({ open: false, type: "", user: null });
  };

  /* =============================
      FORM CHANGE HANDLER (faltaba en tu código)
  ============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  /* =============================
      SAVE (add / edit)
  ============================== */
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        nombre: newUser.nombre,
        username: newUser.username,
        email: newUser.email,
        numero_telefono: newUser.numero_telefono,
        rol: newUser.rol_id,
        password: newUser.password
      };

      if (modal.type === "edit" && !payload.password) delete payload.password;

      if (modal.type === "add") {
        await createUser(payload);
        toast.success("Usuario creado correctamente");
      } else {
        await updateUser(newUser.id, payload);
        toast.success("Usuario actualizado correctamente");
      }

      loadUsers();
      closeModal();
    } catch (error) {
      toast.error("Error al guardar usuario");
      console.error(error);
    }
  };

  /* =============================
      DELETE USER
  ============================== */
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
      toast.success("Usuario eliminado");
      closeModal();
    } catch (error) {
      toast.error("No se pudo eliminar usuario");
      console.error(error);
    }
  };

  /* =============================
      ACTIVATE / DEACTIVATE USER
  ============================== */
  const handleToggleEstado = async (id) => {
    try {
      await toggleUserStatus(id);
      loadUsers();
      toast.success("Estado actualizado");
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  /* =============================
      FILTERED USERS
  ============================== */
  const filteredUsers = users.filter((u) =>
    `${u.nombre} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl shadow-sm p-4 md:p-6">

      {/* ===== Encabezado ===== */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          GESTIÓN DE USUARIOS
        </h1>
        <p className="text-gray-500">
          Administra las cuentas y roles del sistema PowerStock.
        </p>
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        {/* BUSCADOR + BOTÓN */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">

          {/* Buscador */}
          <div className="relative w-full max-w-xl group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z" />
            </svg>

            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl py-2 pl-10 pr-10 
              text-gray-700 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-400 transition"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>

          {/* Botón Agregar */}
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <PlusCircle size={18} /> Agregar usuario
          </button>
        </div>

        {/* ===== TABLA ===== */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Correo</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Teléfono</th>
                <th className="p-2 text-center">Estado</th>
                <th className="p-2 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 border-b h-12">
                  <td className="p-2">{u.nombre}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{rolesMap[u.rol] || "---"}</td>
                  <td className="p-2">{u.numero_telefono}</td>

                  <td className="p-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        u.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="p-2 text-center flex justify-center items-center gap-5">
                    <Edit
                      size={20}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => openModal("edit", u)}
                    />

                    <button
                      onClick={() => handleToggleEstado(u.id)}
                      className={`px-3 py-1 rounded-lg text-sm border ${
                        u.is_active
                          ? "text-red-600 border-red-600 hover:bg-red-50"
                          : "text-green-600 border-green-600 hover:bg-green-50"
                      }`}
                    >
                      {u.is_active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh]">

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2"
            >
              <X size={20} />
            </button>

            {/* AGREGAR / EDITAR */}
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
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Username</label>
                    <input
                      name="username"
                      value={newUser.username}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Rol</label>
                    <select
                      name="rol_id"
                      value={newUser.rol_id || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Teléfono</label>
                    <input
                      name="numero_telefono"
                      value={newUser.numero_telefono}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                      required
                    />
                  </div>

                  {modal.type === "add" && (
                    <div>
                      <label className="block text-gray-700 font-medium">Contraseña</label>
                      <input
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        required
                      />
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

            {/* ELIMINAR */}
            {modal.type === "delete" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-[#D50000] text-center">
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

      {/* ======================================================
           TOASTIFY CONTAINER (REQUIRED)
      ====================================================== */}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        pauseOnHover
        closeOnClick
        theme="colored"
      />

    </div>
  );
};

export default UserManagement;
