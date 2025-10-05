import React, { useState } from "react";
import { Mail, Key, CheckCircle } from "lucide-react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [view, setView] = useState("login"); // "login" | "recover" | "success"

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔹 Validación simulada con correos falsos
    if (email === "admin@fake.com" && password === "admin123") {
      onLoginSuccess("admin"); // Va al AdminDashboard
    } else if (email === "worker@fake.com" && password === "worker123") {
      onLoginSuccess("worker"); // Va al UserDashboard
    } else {
      alert("❌ Credenciales incorrectas");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    console.log("Recuperar contraseña ->", resetEmail);
    setResetEmail("");
    setView("success"); // Mostrar pantalla de éxito
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
        <div className="bg-blue-500 text-white p-8 rounded-2xl w-80 shadow-lg">
          {/* Pantalla de login */}
          {view === "login" && (
            <>
              <h2 className="text-xl font-bold mb-6 text-center">
                Inicio de sesión
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div className="relative mt-4">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <div className="text-sm text-right">
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
                  className="w-full bg-blue-800 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg"
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
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg"
                >
                  Recuperar
                </button>

                <div className="text-sm text-center mt-4">
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
                className="bg-blue-800 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
