import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 🔹 Importar tus componentes

// ⚙️ Crear la raíz
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
