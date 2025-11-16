import React, { useState, useEffect } from "react";
import { AlertOctagon, Edit, Plus, Trash2 } from "lucide-react";
import {
  getGarantias,
  createGarantia,
  updateGarantia,
  deleteGarantia
} from "../api/garantias";
import { buscarProductos } from "../api/productos";
import { fetchWithToken } from "../api/fetchWithToken";

import { useSucursal } from "../context/SucursalContext";

const WarrantiesPanel = () => {
  const [warranties, setWarranties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [sucursales, setSucursales] = useState([]);

  const { selectedSucursal } = useSucursal();
console.log("Sucursal seleccionada:", selectedSucursal);


  const [formData, setFormData] = useState({
    serial: "",
    fecha_inicio_garantia: "",
    fecha_fin_garantia: "",
    producto: "",
    nombre_producto: "",
    nombre_estado: "",
    sucursal: ""
  });

  const [searchProducto, setSearchProducto] = useState("");
const [productos, setProductos] = useState([]);

  const [search, setSearch] = useState("");
  const API_URL = "http://localhost:8000/api";

  const fetchSucursales = async () => {
  try {
    const response = await fetchWithToken(`${API_URL}/sucursales/`);
    const data = await response.json();
    setSucursales(data);
  } catch (error) {
    console.error("Error cargando sucursales:", error);
  }
};

useEffect(() => {
  fetchSucursales();
}, []);



const handleSelectProducto = (p) => {
  setFormData((prev) => ({
    ...prev,
    producto: p.id,
    nombre_producto: p.nombre
  }));

  setSearchProducto(p.nombre);   // Cambia inmediatamente el texto del input
  setProductos([]);              // Cierra la lista
};




useEffect(() => {
  loadGarantias();
}, [selectedSucursal]);


const loadGarantias = async () => {
  if (!selectedSucursal) return;

  const data = await getGarantias(`?sucursal=${selectedSucursal.id}`);
  setWarranties(data);
};



    const handleOpenModal = (g = null) => {
    if (g) {
      setEditing(g.id);
      setSearchProducto(g.nombre_producto);
      setFormData({
        serial: g.serial,
        fecha_inicio_garantia: g.fecha_inicio_garantia,
        fecha_fin_garantia: g.fecha_fin_garantia,
        producto: g.producto,
        nombre_producto: g.nombre_producto,
        estado: g.estado,
        sucursal: selectedSucursal?.id ?? "", 
      });
    } else {
      setEditing(null);
      setSearchProducto("");
      setFormData({
        serial: "",
        fecha_inicio_garantia: "",
        fecha_fin_garantia: "",
        producto: "",
        nombre_producto: "",
        estado: "",
        sucursal: selectedSucursal?.id ?? "", 
      });
    }
    setModalOpen(true);
  };
  const handleSave = async () => {
    console.log("DATA ENVIADA:", formData);
    if (editing) {
      await updateGarantia(editing, formData);
      alert("Garantía actualizada exitosamente.");
    } else {
      await createGarantia(formData);
      alert("Garantía creada exitosamente.");
    }

    setModalOpen(false);
    loadGarantias();
  };

    const handleDelete = async (id) => {
    await deleteGarantia(id);
    setDeleteModal(false);
    loadGarantias();
  };

    const filteredGarantias = warranties.filter((w) =>
    w.serial?.toLowerCase().includes(search.toLowerCase()) ||
    w.nombre_producto?.toLowerCase().includes(search.toLowerCase())
  );



useEffect(() => {
  if (!selectedSucursal?.id) return;  // ⛔ No busques hasta que exista la sucursal

  const fetchSearchResults = async () => {
    if (searchProducto.trim() === "") {
      setProductos([]);
      return;
    }

    try {
      let url = `${API_URL}/productos/?q=${encodeURIComponent(searchProducto)}`;

if (selectedSucursal?.nombre) {
  url += `&sucursal=${encodeURIComponent(selectedSucursal.nombre)}`;
}

      console.log("URL que se consulta Productos:", url);

      const response = await fetchWithToken(url);
      const data = await response.json();

      console.log("Productos encontrados:", data);

      setProductos(data);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  const delay = setTimeout(fetchSearchResults, 300);
  return () => clearTimeout(delay);
}, [searchProducto, selectedSucursal?.nombre]);






  return (
    <div className="rounded-2xl shadow-sm p-4 md:p-6">
      {/* ====== Encabezado ====== */}
      
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE GARANTÍAS</h1>
          <p className="text-gray-500">
            Registro y control de productos con garantía activa o vencida
          </p>
        </div>

    
      </header>
      

<div className="bg-white shadow-md rounded-xl p-6 padding-lg">
              {/* ✅ BUSCADOR */}

              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full max-w-xl mb-4 group transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 absolute left-3 top-2.5 group-focus-within:text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z" />
          </svg>

          <input
            type="text"
            placeholder="Buscar por serial o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl py-2 pl-10 pr-10 text-gray-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2 text-gray-400 hover:text-red-500 transition"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Agregar garantía
        </button>

      </div>

      {/* ====== Tabla estilizada ====== */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100 text-gray-900 font-semibold text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Serial</th>
              <th className="px-4 py-3 text-left">Fecha_Inicio</th>
              <th className="px-4 py-3 text-left">Fecha_Fin</th>
              <th className="px-4 py-3 text-left">Tiempo restante</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              {filteredGarantias.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{w.nombre_producto}</td>
                  <td className="px-4 py-3">{w.serial}</td>
                  <td className="px-4 py-3">{w.fecha_inicio_garantia}</td>
                  <td className="px-4 py-3">{w.fecha_fin_garantia}</td>
                  <td className="px-4 py-3">{w.tiempo_restante}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        w.nombre_estado === "Activa"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {w.nombre_estado}
                    </span>
                  </td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenModal(w)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={18} />
                  </button>
                  {/* <button
                    onClick={() => setDeleteModal(w.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* ====== Modal Crear / Editar ====== */}

      {/* ------- MODAL ------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-red-500 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center text-blue-600">
              {editing ? "Editar Garantía" : "Crear Garantía"}
            </h3>

            <div className="flex flex-col gap-3">
              
              {/* ✅ PRODUCTO BUSCADOR */}
              <label className="text-sm font-semibold">Producto</label>
              <input
                type="text"
                placeholder="Buscar por nombre o serial"
                disabled={editing}
                value={editing ? formData.nombre_producto : searchProducto}
                onChange={(e) => !editing && setSearchProducto(e.target.value)}

                className={`border w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200 
                  ${editing && "bg-gray-100 text-gray-600 cursor-not-allowed"}`}
              />

              {/* ✅ LISTA DE RESULTADOS */}
              {!editing && productos.length > 0 && (
                <ul className="border bg-white rounded shadow max-h-40 overflow-auto">
                  {productos.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => handleSelectProducto(p)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {p.nombre} — {p.serial}
                    </li>
                  ))}
                </ul>
              )}

              {/* ✅ FECHAS */}
              <label className="text-sm font-semibold">Fecha inicio</label>
              <input
                type="date"
                value={formData.fecha_inicio_garantia}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio_garantia: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />

              <label className="text-sm font-semibold">Fecha fin</label>
              <input
                type="date"
                value={formData.fecha_fin_garantia}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin_garantia: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />

              <label className="text-sm font-semibold">Serial</label>
              <input
                type="text"
                value={formData.serial}
                onChange={(e) =>
                  setFormData({ ...formData, serial: e.target.value })
                }
                className="border border-gray-300 rounded px-3 py-2"
              />

<label className="text-sm font-semibold">Estado</label>
<select
  value={formData.estado}
  disabled={editing}  // ✅ No permite editar cuando editing = true
  onChange={(e) =>
    setFormData({ ...formData, estado: e.target.value })
  }
  className={`border border-gray-300 rounded px-3 py-2 ${
    editing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
  }`}
>
  <option value="">Seleccionar...</option>
  <option value="1">Activa</option>
  <option value="2">Inactiva</option>
</select>




              <div className="flex justify-end mt-4 gap-2">
                {/* {editing && (
                  <button
                    onClick={() => setDeleteModal(editing)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                )} */}
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== Modal Confirmar Eliminación ====== */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-3">Aviso</h3>
            <p className="mb-4">
              ¿Desea eliminar permanentemente esta garantía?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleDelete(deleteModal)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default WarrantiesPanel;