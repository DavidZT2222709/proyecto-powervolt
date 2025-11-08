// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Key, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [view, setView] = useState("login");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl mx-auto items-center px-6">
        {/* LADO IZQUIERDO */}
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

        {/* FORMULARIO */}
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

                  {/* PASSWORD */}
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

                  {/* OLVIDO CONTRASEÑA */}
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
                    className="w-full py-4 text-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200 shadow-md"
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
                <CheckCircle className="w-14 h-14 text-blue-600 drop-shadow-[0_1px_1px_rgb(125,211,252)]" />
                <p className="text-xl font-semibold text-gray-700 text-center">
                  Contraseña enviada al correo
                </p>
                <button
                  onClick={() => setView("login")}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold rounded-2xl hover:scale-[1.03] transition-transform duration-200 shadow-md"
                >
                  Volver al inicio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
