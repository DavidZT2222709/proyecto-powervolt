
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SucursalProvider } from "./context/SucursalContext";

import { BrowserRouter } from "react-router-dom";
import './index.css'
import AppRoutes from './routes/AppRoutes.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SucursalProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SucursalProvider>
  </StrictMode>
);
