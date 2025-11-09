import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser, getRoles, toggleUserStatus } from "../../../api/usuarios"; 
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
    password: "",
    is_active: true
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
        password: newUser.password,
        is_active: true
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
    setNewUser(
      user || {
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
const handleToggleEstado = async (id) => {
  try {
    await toggleUserStatus(id);
    loadUsers();
    toast.success("✅ Estado actualizado");
  } catch (err) {
    toast.error("❌ Error al cambiar estado");
  }
};

const [search, setSearch] = useState("");

const filteredUsers = users.filter(u =>
  u.nombre.toLowerCase().includes(search.toLowerCase()) ||
  u.email.toLowerCase().includes(search.toLowerCase()) ||
  String(u.numero_telefono).includes(search)
);



  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE USUARIOS</h1>
        <p className="text-gray-500">Administra las cuentas y roles del sistema PowerStock.</p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
     


            <div className="relative w-full max-w-xl  mb-4 group transition-all">
              {/* 🔍 Icono lupa */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 absolute left-3 top-2.5 transition-all group-focus-within:text-blue-500"
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
                className="w-full bg-white border border-gray-300 rounded-xl py-2 pl-10 pr-10 text-gray-700 
                  shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2 text-gray-400 hover:text-red-500 transition"
                >
                  ✕
                </button>
              )}
            </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Agregar usuario
          </button>

        </div>

        </div>




        <table className="w-full border-collapse">
  <thead>
    <tr className="bg-blue-100 text-left text-gray-700">
      <th className="p-2">Nombre</th>
      <th className="p-2">Email</th>
      <th className="p-2">Rol</th>
      <th className="p-2">Teléfono</th>
      <th className="p-2 text-center">Estado</th>
      <th className="p-2 text-center">Acciones</th>
    </tr>
  </thead>

  
    <tbody>
  {filteredUsers.map((u) => (

      <tr key={u.id} className="hover:bg-gray-50 border-b">
        <td className="p-2">{u.nombre}</td>
        <td className="p-2">{u.email}</td>
        <td className="p-2">{rolesMap[String(u.rol)] || "Sin rol"}</td>
        <td className="p-2">{u.numero_telefono}</td>

        {/* ✅ Columna estado */}
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

        {/* ✅ Acciones (editar + activar/desactivar) */}
        <td className="p-2 text-center flex justify-center gap-5">
          <Edit
            size={20}
            className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
            onClick={() => openModal("edit", u)}
          />

        <button
          onClick={() => handleToggleEstado(u.id, u.is_active)}
          className={`px-3 py-1 rounded-lg text-sm border transition ${
            u.is_active
              ? "text-red-600 border-red-600 hover:text-red-800 hover:border-red-800"
              : "text-green-600 border-green-600 hover:text-green-800 hover:border-green-800"
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

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition"
            >
              <X size={20} />
            </button>

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
                    {formErrors.nombre && <p className="text-red-600 text-sm mt-1">{formErrors.nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    />
                    {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Username</label>
                    <input
                      name="username"
                      value={newUser.username}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    />
                    {formErrors.username && <p className="text-red-600 text-sm mt-1">{formErrors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">Rol</label>
                    <select
                      name="rol_id"
                      value={newUser.rol_id || ""}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
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
                    <label className="block text-gray-700 font-medium">Teléfono</label>
                    <input
                      name="numero_telefono"
                      value={newUser.numero_telefono}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    />
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
                <h2 className="text-2xl font-bold mb-4 text-[#D50000] text-center">Eliminar usuario</h2>
                <p className="text-center text-gray-600 mb-6">
                  ¿Seguro que deseas eliminar al usuario <span className="font-semibold">{modal.user?.nombre}</span>?
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
