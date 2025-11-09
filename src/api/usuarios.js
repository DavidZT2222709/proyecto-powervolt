// src/api/usuarios.js
import { fetchWithToken } from "./fetchWithToken";

const API_URL = "http://localhost:8000/api";

// Obtener todos los usuarios
export const getUsers = async () => {
  const res = await fetchWithToken(`${API_URL}/usuarios/`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al obtener usuarios:", errorData);
    throw new Error(errorData.detail || "Error al obtener usuarios");
  }
  return await res.json();
};

// Crear un usuario
export const createUser = async (data) => {
  const res = await fetchWithToken(`${API_URL}/usuarios/registro/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al crear usuario:", errorData);
    throw new Error(
      errorData.detail || 
      errorData.message || 
      JSON.stringify(errorData) || 
      "Error al crear usuario"
    );
  }

  return await res.json();
};

// Actualizar un usuario
export const updateUser = async (id, data) => {
  const res = await fetchWithToken(`${API_URL}/usuarios/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al actualizar usuario:", errorData);
    throw new Error(
      errorData.detail || 
      errorData.message || 
      JSON.stringify(errorData) || 
      "Error al actualizar usuario"
    );
  }

  return await res.json();
};

// Eliminar un usuario
export const deleteUser = async (id) => {
  const res = await fetchWithToken(`${API_URL}/usuarios/${id}/`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al eliminar usuario:", errorData);
    throw new Error(errorData.detail || "Error al eliminar usuario");
  }
};

// Obtener todos los roles
export const getRoles = async () => {
  const res = await fetchWithToken(`${API_URL}/roles/`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al obtener roles:", errorData);
    throw new Error(errorData.detail || "Error al obtener roles");
  }
  return await res.json();
};

// Cambiar el estado activo/inactivo de un usuario

export const toggleUserStatus = async (id) => {
  const res = await fetchWithToken(`${API_URL}/usuarios/${id}/toggle_active/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Error al cambiar estado:", errorData);
    throw new Error(errorData.detail || "Error al cambiar estado");
  }

  return await res.json();
};
