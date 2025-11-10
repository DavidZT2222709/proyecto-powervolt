import React, { useState, useEffect } from "react";
import { Home, User, LogOut, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers, getRoles } from "../api/usuarios";
import { getSucursales } from "../api/sucursales";
import { useSucursal } from "../context/SucursalContext";

function Header() {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  // --- Función simplificada para cargar datos del usuario ---
  const loadUserData = async () => {
    const cachedStr = localStorage.getItem("user");
    const emailActual = localStorage.getItem("userEmail") || "";
    const roleCache = localStorage.getItem("userRole") || "Usuario";

    // Cargar desde cache inmediatamente
    if (cachedStr) {
      try {
        const u = JSON.parse(cachedStr);
        setProfileData(prev => ({
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

      let u = usuarios.find(x => x.email === emailActual) || usuarios[0];
      if (u) {
        setProfileData(prev => ({
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
      console.error("Error cargando usuario:", err);
    }
  };

  // --- Cargar usuario al montar ---
  useEffect(() => {
    loadUserData();
  }, []);



  // === NUEVO useEffect para cargar las sucursales ===
  useEffect(() => {
    let mounted = true;

    getSucursales()
      .then((data) => {
        if (!mounted) return; // Evita actualizar si el componente ya fue desmontado
        setSucursales(data || []); // Guarda la lista completa

        // Si no hay ninguna seleccionada todavía
        if (!selectedSucursal && data && data.length > 0) {
          setSelectedSucursal(data[0]); // Selecciona la primera como predeterminada
        }
      })
      .catch((err) => {
        console.warn("❌ No se pudieron cargar las sucursales:", err);
      });

    return () => {
      mounted = false; // limpieza del efecto
    };
  }, [selectedSucursal, setSelectedSucursal]);



  
  // --- Logout ---
  const handleLogout = () => {
    ["access_token", "refresh_token", "userRole", "userEmail", "user", "selected_sucursal"].forEach(k =>
      localStorage.removeItem(k)
    );
    navigate("/", { replace: true });
  };

  // --- Guardar cambios de perfil ---
  const handleProfileSave = () => {
    alert("Información actualizada correctamente ✅");
    setIsEditing(false);
    loadUserData(); // recarga datos automáticamente
  };

  // --- Estilos por rol ---
  const roleStyles =
    profileData.role === "Administrador"
      ? "bg-white text-gray-800 border border-gray-300"
      : "bg-yellow-50 border border-yellow-200 text-yellow-800";
  const roleTextColor =
    profileData.role === "Administrador" ? "text-gray-500" : "text-yellow-600";

  return (
    <>
      <header className={`fixed top-0 right-0 w-full flex justify-end items-center space-x-4 p-4 pr-10 transition-transform duration-500 z-50`}>
        {/* Botón Sucursal */}
        <div className="relative">
          <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center shadow-md hover:shadow-lg transition-shadow"
          >
            <Home className="mr-2" size={16} />
            {(selectedSucursal && selectedSucursal.nombre) || "Sucursal"} <span className="ml-2">▼</span>
          </button>
          {isLocationOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-2 min-w-[220px]">
              <ul className="max-h-72 overflow-auto">
                {sucursales.map(s => (
                  <li
                    key={s.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSelectedSucursal(s);
                      setIsLocationOpen(false);
                    }}
                  >
                    <span>{s.nombre}</span>
                    {selectedSucursal?.id === s.id && <span className="text-blue-600 text-sm">✓</span>}
                  </li>
                ))}
                {sucursales.length === 0 && <li className="px-4 py-2 text-gray-500">Sin sucursales</li>}
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

      {/* Modal de perfil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Mi perfil</h2>

            <div className="flex flex-col items-center mb-4">
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full mb-3 border border-gray-300 object-cover"
              />
              {isEditing && (
                <label className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-700">
                  Cambiar foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setProfileData({ ...profileData, avatar: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium">Nombre completo</label>
                <input
                  type="text"
                  value={profileData.name}
                  disabled={!isEditing}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  className={`w-full border rounded-md px-3 py-2 mt-1 ${isEditing ? "focus:ring focus:ring-blue-200 border-gray-300" : "bg-gray-100 cursor-not-allowed text-gray-600"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium">Correo electrónico</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                  className={`w-full border rounded-md px-3 py-2 mt-1 ${isEditing ? "focus:ring focus:ring-blue-200 border-gray-300" : "bg-gray-100 cursor-not-allowed text-gray-600"}`}
                />
              </div>

              {isEditing && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium">Nueva contraseña</label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 gap-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Actualizar información</button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancelar</button>
                  <button onClick={handleProfileSave} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Guardar cambios</button>
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
