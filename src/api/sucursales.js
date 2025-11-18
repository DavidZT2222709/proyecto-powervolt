// src/api/sucursales.js
import { fetchWithToken } from "./fetchWithToken";

const API_URL = "https://gestor-inventarios-7jm8.onrender.com/api";

// Lista de sucursales
export async function getSucursales() {
  const res = await fetchWithToken(`${API_URL}/sucursales/`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "No se pudieron obtener las sucursales");
  }
  return res.json();
}
