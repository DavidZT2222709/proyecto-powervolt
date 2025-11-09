import { refreshToken } from "./auth";

//renova el token de forma automatica
export const fetchWithToken = async (url, options = {}) => {
let token = localStorage.getItem("access_token");

options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
};

let response = await fetch(url, options);

if (response.status === 401) {
    // Intentar renovar token
    try {
    token = await refreshToken();
    options.headers.Authorization = `Bearer ${token}`;
    response = await fetch(url, options);
    } catch {
    throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
    }
}

return response;
};
