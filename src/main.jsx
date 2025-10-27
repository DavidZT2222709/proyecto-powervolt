<<<<<<< HEAD
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// 🔹 Importar tus componentes
import Login from "./Login.jsx";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard.jsx";
import UserDashboard from "./components/dashboard/worker/UserDashboard.jsx";
import InventoryPanel from "./components/InventoryPanel.jsx";
import WarrantiesPanel from "./components/dashboard/worker/WarrantiesPanel.jsx";
import HistoryPanel from "./components/dashboard/admin/HistoryPanel.jsx";

// ⚙️ Crear la raíz
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🔹 Página de Login */}
        <Route path="/" element={<Login />} />

        {/* 🔹 Rutas del Administrador */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="historial" element={<HistoryPanel />} />
          <Route path="garantias" element={<WarrantiesPanel />} />
        </Route>

        {/* 🔹 Rutas del Usuario / Empleado */}
        <Route path="/worker" element={<UserDashboard />}>
          <Route path="inventario" element={<InventoryPanel />} />
          <Route path="historial" element={<HistoryPanel />} />
          <Route path="garantias" element={<WarrantiesPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> jeison
