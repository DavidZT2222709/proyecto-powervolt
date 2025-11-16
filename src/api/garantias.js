
import { fetchWithToken } from "./fetchWithToken";

const API_URL = "http://localhost:8000/api/garantias/";

export const getGarantias = async (query = "") => {
  const res = await fetchWithToken(`${API_URL}${query}`);
  return await res.json();
};

export const createGarantia = async (data) => {
const res = await fetchWithToken(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});
return await res.json();
};

export const updateGarantia = async (id, data) => {
const res = await fetchWithToken(`${API_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});
return await res.json();
};

export const deleteGarantia = async (id) => {
const res = await fetchWithToken(`${API_URL}${id}/`, {
    method: "DELETE",
});
return res.status === 204;
};
