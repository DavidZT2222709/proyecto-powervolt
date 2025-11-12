import { fetchWithToken } from "./fetchWithToken";

const API_URL = "http://localhost:8000/api/productos/";

export const buscarProductos = async (query) => {
const res = await fetchWithToken(`${API_URL}?search=${query}`);
return await res.json();
};
