import { fetchWithToken } from "./fetchWithToken";

const API_URL = "https://gestor-inventarios-7jm8.onrender.com/api/productos/";

export const buscarProductos = async (query) => {
const res = await fetchWithToken(`${API_URL}?search=${query}`);
return await res.json();
};
