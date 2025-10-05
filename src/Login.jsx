import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { Mail, Key, CheckCircle } from "lucide-react";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import UserDashboard from "./components/dashboard/worker/UserDashboard";
import InventoryPanel from "./components/InventoryPanel";

// ---------------- LOGIN PAGE ----------------
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [view, setView] = useState("login");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔹 Validación estática de credenciales
    if (email === "admin@fake.com" && password === "admin123") {
      navigate("/admin");
    } else if (email === "worker@fake.com" && password === "worker123") {
      navigate("/worker");
    } else {
      alert("❌ Credenciales incorrectas");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setResetEmail("");
    setView("success");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="flex flex-col md:flex-row items-center bg-white/60 backdrop-blur-xl border border-white/30 p-10 rounded-3xl shadow-2xl">
        {/* LOGO */}
        <div className="flex flex-col items-center md:mr-10 mb-6 md:mb-0">
          <img
            src="/Logo.png"
            alt="Powerstock"
            className="w-36 h-36 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse"
          />
          <h1 className="mt-4 text-4xl font-extrabold italic text-blue-700 drop-shadow-sm">
            POWERSTOCK
          </h1>
        </div>

        {/* FORMULARIOS */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 w-[480px] shadow-2xl border border-blue-100 text-gray-800">
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
                    className="block text-blue-700 font-semibold mb-2 text-xl"
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
                      className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>

                {/* CONTRASEÑA */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-blue-700 font-semibold mb-2 text-xl"
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
                      className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400"
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
                  className="w-full py-4 text-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200"
                >
                  Ingresar
                </button>
              </form>
            </>
          )}

          {/* RECUPERAR CONTRASEÑA */}
          {view === "recover" && (
            <>
              <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
                Recuperar contraseña
              </h2>
              <form onSubmit={handlePasswordReset} className="space-y-8 text-lg">
                <div>
                  <label
                    htmlFor="resetEmail"
                    className="block text-blue-700 font-semibold mb-2 text-xl"
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
                      className="w-full pl-10 pr-3 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200"
                >
                  Recuperar
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

          {/* ÉXITO */}
          {view === "success" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <CheckCircle className="w-14 h-14 text-blue-600" />
              <p className="text-xl font-semibold text-gray-700 text-center">
                Contraseña enviada al correo
              </p>
              <button
                onClick={() => setView("login")}
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------- RUTAS ANIDADAS ----------------
const Login = () => {
  return (
    <Router>
      <Routes>
        {/* Página principal de login */}
        <Route path="/" element={<LoginPage />} />

        {/* DASHBOARD ADMIN */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="inventario" element={<InventoryPanel />} />
        </Route>

        {/* DASHBOARD WORKER */}
        <Route path="/worker" element={<UserDashboard />}>
          <Route path="inventario" element={<InventoryPanel />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Login;
