

const API_URL = "http://localhost:8000"; 

// loguearse 
export const loginUser = async (email, password) => {
const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
});

if (!response.ok) throw new Error("Credenciales incorrectas");

return await response.json(); // { access: "...", refresh: "..." }
};



//recuperar contraseña, metodo para enviar el correo
export const passwordReset = async (email) => {
const response = await fetch(`${API_URL}/api/password_reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
});

if (!response.ok) throw new Error("Error al enviar correo");

return await response.json();
};


//me va a confirmar este cambio de contraseña actualizando el backend
export const passwordConfirm = async (token, newPassword) => {
try {
    const res = await fetch(`${API_URL}/api/password_reset/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password: newPassword }),
    });
    const data = await res.json();
    return data;
} catch (err) {
    throw new Error("Error al restablecer contraseña");
}
};

//refrescar el token cuando expire el de corto pero manual
export const refreshToken = async () => {
const refresh = localStorage.getItem("refresh_token");
if (!refresh) throw new Error("No hay token de refresco");

const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
});

if (!response.ok) throw new Error("No se pudo renovar token");

const data = await response.json();
localStorage.setItem("access_token", data.access);
return data.access;
};
