import React, { useState, useEffect } from "react";
import { Home, User, LogOut, Edit3, Tags, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers, getRoles } from "../api/usuarios";
import { getSucursales } from "../api/sucursales";
import { useSucursal } from "../context/SucursalContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchWithToken } from "../api/fetchWithToken.js";

const API_URL = "https://gestor-inventarios-7jm8.onrender.com/api";
const EMPTY_LABEL = "Sucursales";
const LS_SELECTED = "selected_sucursal";

function Header() {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  // Perfil
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Marcas
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [editingMarca, setEditingMarca] = useState(null);
  const [marcaNombre, setMarcaNombre] = useState("");

  // Modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [marcaAEliminar, setMarcaAEliminar] = useState(null);

  // Scroll header
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Perfil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    sucursalNombre: "",
    password: "",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  const { selectedSucursal, setSelectedSucursal } = useSucursal();
  const [sucursales, setSucursales] = useState([]);
  const navigate = useNavigate();

  //=========================== SCROLL HEADER ===========================//
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setVisible(false);
      } else setVisible(true);

      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  //=========================== SUCURSALES ==============================//
  const persistSelected = (s) => {
    if (s?.id != null) localStorage.setItem(LS_SELECTED, String(s.id));
    else localStorage.removeItem(LS_SELECTED);
  };

  const refreshSucursales = async (opts = {}) => {
    try {
      const list = (await getSucursales()) || [];
      setSucursales(list);

      const savedId = localStorage.getItem(LS_SELECTED);

      if (list.length === 0) {
        setSelectedSucursal(null);
        persistSelected(null);
        return;
      }

      if (
        opts.deletedId &&
        selectedSucursal &&
        Number(selectedSucursal.id) === Number(opts.deletedId)
      ) {
        const next = list[0] || null;
        setSelectedSucursal(next);
        persistSelected(next);
        return;
      }

      if (savedId) {
        const found = list.find((s) => String(s.id) === String(savedId));
        if (found) {
          if (!selectedSucursal || String(selectedSucursal.id) !== String(found.id)) {
            setSelectedSucursal(found);
          }
          persistSelected(found);
          return;
        }
      }

      if (!selectedSucursal || !list.some((s) => Number(s.id) === Number(selectedSucursal.id))) {
        const first = list[0];
        setSelectedSucursal(first);
        persistSelected(first);
      }
    } catch (err) {
      setSucursales([]);
      setSelectedSucursal(null);
      persistSelected(null);
      toast.error("No se pudieron cargar las sucursales");
    }
  };

  useEffect(() => {
    refreshSucursales();

    const onUpdate = (ev) => {
      const deletedId = ev?.detail?.deletedId;
      refreshSucursales({ deletedId });
    };

    window.addEventListener("sucursalesActualizadas", onUpdate);
    return () => window.removeEventListener("sucursalesActualizadas", onUpdate);
  }, []);

  //=========================== PERFIL ================================//
  const loadUserData = async () => {
    const cachedStr = localStorage.getItem("user");
    const emailActual = localStorage.getItem("userEmail") || "";
    const roleCache = localStorage.getItem("userRole") || "Usuario";

    if (cachedStr) {
      try {
        const u = JSON.parse(cachedStr);
        setProfileData((prev) => ({
          ...prev,
          name: u.nombre || u.username || emailActual,
          email: u.email || "",
          role: u.rol_nombre || roleCache,
          sucursalNombre: u.sucursal_nombre || "",
        }));
      } catch {}
    }

    try {
      const roles = await getRoles();
      const rolesMap = roles.reduce((acc, r) => ({ ...acc, [r.id]: r.nombre }), {});
      const usuarios = await getUsers();
      let u = usuarios.find((x) => x.email === emailActual) || usuarios[0];

      if (u) {
        setProfileData((prev) => ({
          ...prev,
          name: u.nombre || u.username,
          email: u.email,
          role: rolesMap[u.rol] || u.rol_nombre || roleCache,
          sucursalNombre: u.sucursal_nombre || "",
        }));
        localStorage.setItem("user", JSON.stringify(u));
        if (u.rol_nombre) localStorage.setItem("userRole", u.rol_nombre);
      }
    } catch (err) {
      toast.error("Error al cargar datos del usuario");
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  //=========================== LOGOUT ===============================//
  const handleLogout = () => {
    ["access_token", "refresh_token", "userRole", "userEmail", "user", LS_SELECTED].forEach((k) =>
      localStorage.removeItem(k)
    );
    toast.success("Sesión cerrada correctamente");
    setTimeout(() => navigate("/", { replace: true }), 800);
  };

  //=========================== MARCAS CRUD ==========================//
  const cargarMarcas = async () => {
    try {
      const res = await fetchWithToken(`${API_URL}/marcas/`);
      const data = await res.json();
      setMarcas(data);
    } catch {
      toast.error("Error cargando marcas");
    }
  };

  const crearMarca = async () => {
    if (!marcaNombre.trim()) return toast.error("El nombre es obligatorio");

    try {
      const res = await fetchWithToken(`${API_URL}/marcas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: marcaNombre }),
      });

      if (!res.ok) {
        toast.error("No se pudo crear la marca");
        return;
      }

      toast.success("Marca creada exitosamente");
      setMarcaNombre("");
      cargarMarcas();
    } catch {
      toast.error("Error creando marca");
    }
  };

  const actualizarMarca = async () => {
    if (!marcaNombre.trim()) return toast.error("Ingrese un nombre válido");

    try {
      const res = await fetchWithToken(`${API_URL}/marcas/${editingMarca.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: marcaNombre }),
      });

      if (!res.ok) {
        toast.error("No se pudo actualizar la marca");
        return;
      }

      toast.success("Marca actualizada correctamente");
      setEditingMarca(null);
      setMarcaNombre("");
      cargarMarcas();
    } catch {
      toast.error("Error actualizando marca");
    }
  };

  // Mostramos el modal de confirmación
  const pedirConfirmarEliminar = (marca) => {
    setMarcaAEliminar(marca);
    setDeleteModalOpen(true);
  };

  // Confirmación y borrado real
  const confirmarEliminarMarca = async () => {
    try {
      const res = await fetchWithToken(`${API_URL}/marcas/${marcaAEliminar.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Marca eliminada con éxito");
        setDeleteModalOpen(false);
        setMarcaAEliminar(null);
        cargarMarcas();
      } else {
        toast.error("No se pudo eliminar la marca");
      }
    } catch {
      toast.error("Error eliminando marca");
    }
  };

  //========== Estilos Rol ==========//
  const roleStyles =
    profileData.role === "Administrador"
      ? "bg-white text-gray-800 border border-gray-300"
      : "bg-yellow-50 border border-yellow-200 text-yellow-800";

  const roleTextColor =
    profileData.role === "Administrador" ? "text-gray-500" : "text-yellow-600";

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 right-0 w-full flex justify-end items-center space-x-4 p-4 pr-10 
        transition-transform duration-500 z-50 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ background: "transparent", boxShadow: "none" }}
      >
        {/* Sucursales */}
        <div className="relative">
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center shadow-md hover:shadow-lg transition-shadow"
          >
            <Home className="mr-2" size={16} />
            {(selectedSucursal && selectedSucursal.nombre) || EMPTY_LABEL}
            <span className="ml-2">▼</span>
          </button>

          {isLocationOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-2 min-w-[220px]">
              <ul className="max-h-72 overflow-auto">
                {sucursales.map((s) => (
                  <li
                    key={s.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSelectedSucursal(s);
                      persistSelected(s);
                      setIsLocationOpen(false);
                      toast.success(`Sucursal cambiada a: ${s.nombre}`);
                    }}
                  >
                    <span>{s.nombre}</span>
                    {selectedSucursal?.id === s.id && (
                      <span className="text-blue-600 text-sm">✓</span>
                    )}
                  </li>
                ))}
                {sucursales.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">Sin sucursales</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Usuario */}
        <div className="relative">
          <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className={`${roleStyles} px-4 py-2 rounded-md flex items-center shadow-md hover:shadow-lg transition-shadow`}
          >
            <User className="mr-2" size={16} />
            <span className="font-bold">{profileData.name || "Usuario"}</span>
            <span className={`ml-2 ${roleTextColor}`}>{profileData.role || "Usuario"}</span>
            <img
              src={profileData.avatar}
              alt="Avatar"
              className="ml-2 w-8 h-8 rounded-full border border-gray-200"
            />
          </button>

          {isUserOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-2">
              <ul>
                <li
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsUserOpen(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Edit3 size={16} /> Mi perfil
                </li>
                {/* NUEVA OPCIÓN MARCAS */}
                <li
                  onClick={() => {
                    cargarMarcas();
                    setIsMarcaModalOpen(true);
                    setIsUserOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Tags size={16} /> Marcas
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          className="bg-red-500 text-white px-4 py-4 rounded-md flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          onClick={handleLogout}
        >
          <LogOut className="mr-0" size={16} />
        </button>
      </header>

      {/* ================= MODAL MARCAS ================= */}
      {isMarcaModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setIsMarcaModalOpen(false);
                setMarcaNombre("");
                setEditingMarca(null);
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
              Marcas
            </h2>

            {/* Form */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nombre de la marca"
                value={marcaNombre}
                onChange={(e) => setMarcaNombre(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
              />

              {!editingMarca ? (
                <button
                  onClick={crearMarca}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  Agregar
                </button>
              ) : (
                <button
                  onClick={actualizarMarca}
                  className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                >
                  Guardar
                </button>
              )}
            </div>

            {/* LISTADO */}
            <ul className="space-y-2 max-h-60 overflow-auto">
              {marcas.map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span>{m.nombre}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingMarca(m);
                        setMarcaNombre(m.nombre);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => pedirConfirmarEliminar(m)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
              {marcas.length === 0 && (
                <p className="text-center text-gray-500">Sin marcas registradas</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ================= MODAL CONFIRMAR ELIMINAR ================= */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">
              ¿Desea eliminar la marca "{marcaAEliminar?.nombre}"?
            </h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMarcaAEliminar(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarMarca}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL PERFIL ================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
              Mi perfil
            </h2>

            <div className="flex flex-col items-center mb-4">
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full mb-3 border border-gray-300 object-cover"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className={`w-full border rounded-md px-3 py-2 mt-1 ${
                    isEditing
                      ? "focus:ring focus:ring-blue-200 border-gray-300"
                      : "bg-gray-100 cursor-not-allowed text-gray-600"
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className={`w-full border rounded-md px-3 py-2 mt-1 ${
                    isEditing
                      ? "focus:ring focus:ring-blue-200 border-gray-300"
                      : "bg-gray-100 cursor-not-allowed text-gray-600"
                  }`}
                />
              </div>

              {isEditing && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) =>
                      setProfileData({ ...profileData, password: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Actualizar información
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Información actualizada correctamente");
                      setIsEditing(false);
                      loadUserData();
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Guardar cambios
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
