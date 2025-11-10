import React, { useState, useEffect } from "react";
import { Home, User, LogOut, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers, getRoles } from "../api/usuarios";
import { getSucursales } from "../api/sucursales";
import { useSucursal } from "../context/SucursalContext";

function Header() {

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { selectedSucursal, setSelectedSucursal } = useSucursal();
  const [sucursales, setSucursales] = useState([]);


  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    sucursalNombre: "", // si luego la traes de otro endpoint, aquí cae
    password: "",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  useEffect(() => {
    const cachedStr = localStorage.getItem("user");      // snapshot guardado en el paso 1
    const emailActual = localStorage.getItem("userEmail") || "";
    const roleCache   = localStorage.getItem("userRole") || "Usuario";

    // 1) Pintar inmediatamente desde cache si existe
    if (cachedStr) {
      try {
        const u = JSON.parse(cachedStr);
        setProfileData((prev) => ({
          ...prev,
          name: u.nombre || u.username || "",
          email: u.email || "",
          role: u.rol_nombre || roleCache,          // si no hay nombre de rol, lo completamos abajo
          sucursalNombre: u.sucursal_nombre || "",  // si tu API lo trae
        }));
      } catch {}
    } else {
      // sin cache, al menos deja el rol que ya tenías
      setProfileData((prev) => ({ ...prev, role: roleCache }));
    }

    // 2) Enriquecer/validar con roles + lista actual (para mapear rol id -> nombre)
    let rolesMap = {};
    getRoles()
      .then((roles) => {
        rolesMap = roles.reduce((acc, r) => {
          acc[String(r.id)] = r.nombre;
          return acc;
        }, {});
      })
      .catch(() => {})
      .finally(() => {
        getUsers()
          .then((usuarios) => {
            // usa el cache si lo había; si no, busca por email/username
            let u = null;
            try { u = cachedStr ? JSON.parse(cachedStr) : null; } catch {}
            if (!u) {
              u =
                usuarios.find((x) => x.email === emailActual) ||
                usuarios.find((x) => x.username === emailActual);
            }

            if (u) {
              setProfileData((prev) => ({
                ...prev,
                name: u.nombre || u.username || prev.name || "Usuario",
                email: u.email || prev.email || "",
                role: rolesMap[String(u.rol)] || u.rol_nombre || prev.role || "Usuario",
                sucursalNombre: u.sucursal_nombre || prev.sucursalNombre || "",
              }));
              // refresca cache para próximas cargas
              localStorage.setItem("user", JSON.stringify(u));
              if (u.rol_nombre) localStorage.setItem("userRole", u.rol_nombre);
            }
          })
          .catch(() => {});
      });
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


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("selected_sucursal");
    navigate("/", { replace: true }); 
  };

  const handleProfileSave = () => {
    alert("Información actualizada correctamente ✅");
    setIsEditing(false);
  };

  // Estilos condicionales por rol
  const roleStyles =
    profileData.role === "Administrador"
      ? "bg-white text-gray-800 border border-gray-300"
      : "bg-yellow-50 border border-yellow-200 text-yellow-800";

  const roleTextColor =
    profileData.role === "Administrador" ? "text-gray-500" : "text-yellow-600";

  return (
    <>
      <header
        className={`fixed top-0 right-0 w-full flex justify-end items-center space-x-4 p-4 pr-10 transition-transform duration-500 z-50 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ background: "transparent", boxShadow: "none" }}
      >
        {/* Botón azul: Sucursal */}
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
                {sucursales.map((s) => (
                  <li
                    key={s.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSelectedSucursal(s);        // guarda globalmente la sucursal seleccionada
                      setIsLocationOpen(false);      // cierra el menú
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

        {/* Usuario con menú desplegable */}
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

        {/* Cerrar sesión */}
        <button
          className="bg-red-500 text-white px-4 py-4 rounded-md flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          onClick={handleLogout}
        >
          <LogOut className="mr-0" size={16} />
        </button>
      </header>

      {/* ===== Modal de perfil ===== */}
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

            {/* Foto de perfil */}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () =>
                          setProfileData({
                            ...profileData,
                            avatar: reader.result,
                          });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Información del perfil */}
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

              {/* Contraseña: sólo en modo edición */}
              {isEditing && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        password: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>

            {/* Botones inferiores */}
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
                    onClick={handleProfileSave}
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
