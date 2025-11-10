// src/context/SucursalContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const SucursalContext = createContext(null);

export function SucursalProvider({ children }) {
    const [selectedSucursal, setSelectedSucursal] = useState(null);

    // Cargar desde localStorage al iniciar
    useEffect(() => {
        const raw = localStorage.getItem("selected_sucursal");
        if (raw) {
        try {
            setSelectedSucursal(JSON.parse(raw)); // { id, nombre, ... }
        } catch {}
        }
    }, []);

    // Persistir cada cambio
    useEffect(() => {
        if (selectedSucursal) {
        localStorage.setItem("selected_sucursal", JSON.stringify(selectedSucursal));
        }
    }, [selectedSucursal]);

    return (
        <SucursalContext.Provider value={{ selectedSucursal, setSelectedSucursal }}>
        {children}
        </SucursalContext.Provider>
    );
    }

    export function useSucursal() {
    const ctx = useContext(SucursalContext);
    if (!ctx) {
        throw new Error("useSucursal debe usarse dentro de <SucursalProvider>");
    }
    return ctx;
}
