import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Mail, Key, CheckCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { loginUser, passwordReset, passwordConfirm } from "./api/auth";
import { getUsers } from "./api/usuarios";


// ---------------- LOGIN PAGE ----------------
const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [view, setView] = useState("login");

  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [token, setToken] = useState(""); // token para reset
  const [newPassword, setNewPassword] = useState(""); // nueva contraseña

  const location = useLocation();

const hasShownAlert = React.useRef(false);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("error") === "oauth" && !hasShownAlert.current) {
    hasShownAlert.current = true; // marca que ya se mostró
    alert("❌ Tu cuenta de Google no tiene acceso");

    // Limpia la URL
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}, [location.search]);




useEffect(() => {
  if (userRole) {
    navigate(userRole === "Administrador" ? "/admin" : "/worker");
  }
}, [userRole, navigate]);


  //jwt con google oauth
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const access = params.get("token");
  const refresh = params.get("refresh");

  if (access) {
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);

    const decoded = jwt_decode(access);
    localStorage.setItem("userRole", decoded.rol);
    setUserRole(decoded.rol);

    navigate(decoded.rol === "Administrador" ? "/admin" : "/worker");

    window.history.replaceState({}, document.title, "/");
  }
}, [navigate]);



// logeo con TOKEN
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Login
    const data = await loginUser(email, password);

    // Guardar tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    // Decodificar token para leer claims
    const payload = JSON.parse(atob(data.access.split(".")[1]));
    console.log("Token decodificado:", payload);

    // Guardar rol y email/username
    const roleFromToken = payload.rol || "Usuario";
    localStorage.setItem("userRole", roleFromToken);
    localStorage.setItem("userEmail", payload.email || payload.username || email);

    // Traer la lista y cachear el usuario actual por email/username
    try {
      const usuarios = await getUsers(); // usa fetchWithToken internamente
      const current =
        usuarios.find((x) => x.email === (payload.email || email)) ||
        usuarios.find((x) => x.username === (payload.username || email));

      if (current) {
        localStorage.setItem("user", JSON.stringify(current));
      }
    } catch (e) {
      console.warn("No se pudo cachear el usuario:", e);
      // no es fatal; el Header igual intentará resolver con lo que haya
    }

    // Redirigir según el rol
    navigate(roleFromToken === "Administrador" ? "/admin" : "/worker");
  } catch (err) {
    alert("❌ " + err.message);
  }
};


const [loading, setLoading] = useState(false); // para que quede cargando y el usuario no haga doble click

//me envía el correo para restablecer la contraseña

const handlePasswordReset = async (e) => {
  e.preventDefault();
  setLoading(true); // se activa al iniciar, es decir, cuando se envía el formulario
  try {
    await passwordReset(resetEmail);
    setView("success");
  } catch (err) {
    alert("❌ " + err.message);
  } finally {
    setLoading(false); // se desactiva al finalizar, ya sea éxito o error
  }
};



//me restablece la contraseña, nueva
const handlePasswordConfirm = async (e) => {
  e.preventDefault();
  try {
    const data = await passwordConfirm(token, newPassword);
    console.log("Respuesta backend:", data);

    if (data.status?.toLowerCase() === "ok") {
      alert("✅ Contraseña restablecida correctamente");
      setView("login");
      setToken("");
      setNewPassword("");
    } else if (data.password) {
      // Error de validación de contraseña
      alert("❌ " + data.password.join(", "));
    } else if (data.token) {
      // Token inválido
      alert("❌ " + data.token.join(", "));
    } else {
      alert("❌ Error al restablecer la contraseña");
    }
  } catch (err) {
    alert("❌ " + err.message);
  }
};





  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl mx-auto items-center px-6">
        {/* LOGO LADO IZQUIERDO */}
        <div className="flex flex-col items-center justify-center text-center py-10">
          <img
            src="/Logo.png"
            alt="Powerstock"
            className="w-72 h-72 md:w-[28rem] md:h-[28rem] drop-shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse"
          />
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold italic text-blue-700 drop-shadow-[0_2px_2px_rgb(125,211,252)] tracking-wide">
            POWERSTOCK
          </h1>
        </div>

        {/* FORMULARIO LADO DERECHO */}
        <div className="flex justify-center md:justify-start">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-[400px] md:w-[460px] text-gray-800">
            {view === "login" && (
              <>
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
                  Inicio de sesión
                </h2>
                <form onSubmit={handleLogin} className="space-y-8 text-lg">
                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-blue-700 font-semibold mb-2 text-xl drop-shadow-[0_1px_1px_rgb(125,211,252)]"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 
                                   shadow-[0_6px_15px_rgba(125,211,252,0.6)]
                                   hover:shadow-[0_8px_20px_rgba(125,211,252,0.8)]
                                   transition-all duration-200 ease-in-out
                                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                  </div>

                  {/* CONTRASEÑA */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-blue-700 font-semibold mb-2 text-xl drop-shadow-[0_1px_1px_rgb(125,211,252)]"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                      <input
                        id="password"
                        type="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 
                                   shadow-[0_6px_15px_rgba(125,211,252,0.6)]
                                   hover:shadow-[0_8px_20px_rgba(125,211,252,0.8)]
                                   transition-all duration-200 ease-in-out
                                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>


                  </div>

                  {/* OLVIDÓ CONTRASEÑA */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setView("recover")}
                      className="text-base font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200 shadow-md"
                  >
                    Ingresar
                  </button>
                </form>



                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "http://127.0.0.1:8000/oauth/login/google-oauth2/";
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-white border rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-200 text-gray-700 font-semibold"
                >
                  <FcGoogle size={22} />
                  Iniciar con Google
                </button>

              </>
            )}

            {/* RECUPERAR CONTRASEÑA */}
            {view === "recover" && (
              <>
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
                  Recuperar contraseña
                </h2>
                <form
                  onSubmit={handlePasswordReset}
                  className="space-y-8 text-lg"
                >
                  <div>
                    <label
                      htmlFor="resetEmail"
                      className="block text-blue-700 font-semibold mb-2 text-xl drop-shadow-[0_1px_1px_rgb(125,211,252)]"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                      <input
                        id="resetEmail"
                        type="email"
                        placeholder="Ingrese su correo"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 
                                   shadow-[0_6px_15px_rgba(125,211,252,0.6)]
                                   hover:shadow-[0_8px_20px_rgba(125,211,252,0.8)]
                                   transition-all duration-200 ease-in-out
                                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading} 
                    className={`w-full py-4 text-xl text-white font-bold rounded-2xl shadow-md transition-transform duration-200
                                ${loading 
                                  ? "bg-blue-300 cursor-not-allowed" 
                                  : "bg-gradient-to-r from-blue-700 to-blue-400 hover:scale-[1.03]"}`}
                  >
                    {loading ? "Enviando..." : "Recuperar"} 
                  </button>


                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="text-base font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Volver al inicio de sesión
                    </button>
                  </div>
                </form>
              </>
            )}
            {view === "reset" && (
              <>
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Restablecer contraseña</h2>
                <form onSubmit={handlePasswordConfirm} className="space-y-8 text-lg">
                
                    <div>
                      <label htmlFor="token">Token</label>
                      <input id="token" type="text" value={token} onChange={(e) => setToken(e.target.value)} className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 
                                  shadow-[0_6px_15px_rgba(125,211,252,0.6)]
                                  hover:shadow-[0_8px_20px_rgba(125,211,252,0.8)]
                                  transition-all duration-200 ease-in-out
                                  focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                    </div>
               
                  <div>
                    <label htmlFor="newPassword">Nueva contraseña</label>
                    <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 
                                  shadow-[0_6px_15px_rgba(125,211,252,0.6)]
                                  hover:shadow-[0_8px_20px_rgba(125,211,252,0.8)]
                                  transition-all duration-200 ease-in-out
                                  focus:outline-none focus:ring-2 focus:ring-blue-400"  required />
                  </div>
                  <button type="submit" className="w-full py-4 text-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200 shadow-md">Restablecer contraseña</button>
                </form>
              </>
            )}

            {view === "success" && (
              <div className="flex flex-col items-center justify-center space-y-6 py-8">
                <CheckCircle className="w-14 h-14 text-blue-600 drop-shadow-md" />
                <p className="text-xl font-semibold text-gray-700 text-center">Correo enviado con instrucciones</p>
                <button onClick={() => setView("reset")} className="px-8 py-3 text-lg bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200 shadow-md">Continuar recuperación</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;