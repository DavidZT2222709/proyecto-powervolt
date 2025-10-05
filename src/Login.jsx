import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Mail, Key, CheckCircle } from "lucide-react";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import UserDashboard from "./components/dashboard/worker/UserDashboard";
import InventoryPanel from "./components/InventoryPanel";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [view, setView] = useState("login"); // "login" | "recover" | "success"
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔹 Validación estática
    if (email === "admin@fake.com" && password === "admin123") {
      navigate("/admin"); // redirige al panel de administración
    } else if (email === "worker@fake.com" && password === "worker123") {
      navigate("/worker"); // redirige al panel de trabajador
    } else {
      alert("❌ Credenciales incorrectas");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    console.log("Recuperar contraseña ->", resetEmail);
    setResetEmail("");
    setView("success");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row items-center bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center md:mr-10 mb-6 md:mb-0">
          <img
            src="/Logo.png"
            alt="Powerstock"
            className="w-40 h-40 drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]"
          />
          <h1 className="drop-shadow-[0_0_5px_rgba(59,130,246,0.7)] mt-4 text-2xl font-bold italic text-blue-600">
            POWERSTOCK
          </h1>
        </div>

        {/* Caja de formulario */}
        <div className="bg-blue-500 text-white p-12 rounded-3xl w-[400px] h-[500px] shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Inicio de sesión
          </h2>
          <div className="flex-grow flex items-center w-full">
            {view === "login" && (
              <>
                <form onSubmit={handleLogin} className="space-y-4 w-full flex flex-col items-center max-w-xs">
                  <div className="relative w-full">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  <div className="relative mt-4 w-full">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  <div className="text-sm text-left w-full pl-0">
                    <button
                      type="button"
                      onClick={() => setView("recover")}
                      className="font-bold text-white underline hover:text-gray-200"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-800 hover:bg-purple-800 text-white font-semibold py-2 rounded-2xl"
                  >
                    Entrar
                  </button>
                </form>
              </>
            )}

            {/* Pantalla de recuperación */}
            {view === "recover" && (
              <>
                <h2 className="text-xl font-bold mb-6 text-center">
                  Recuperación de contraseña
                </h2>
                <form onSubmit={handlePasswordReset} className="space-y-4 w-full flex flex-col items-center max-w-xs">
                  <div className="relative w-full">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-800 hover:bg-purple-800 text-white font-semibold py-2 rounded-2xl"
                  >
                    Recuperar
                  </button>

                  <div className="text-sm text-center mt-4 w-full">
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="font-bold text-white underline hover:text-gray-200"
                    >
                      Volver al inicio de sesión
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Pantalla de éxito */}
            {view === "success" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="w-12 h-12 text-white" />
                <p className="text-lg font-bold text-center">
                  Contraseña enviada al correo
                </p>
                <button
                  onClick={() => setView("login")}
                  className="bg-blue-800 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-2xl"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Envolvemos todo en el Router aquí mismo
const Login = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/worker" element={<UserDashboard />} />
        <Route path="/inventario" element={<InventoryPanel />} />
      </Routes>
    </Router>
  );
};

export default Login;