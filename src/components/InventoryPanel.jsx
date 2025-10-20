import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Package,
  FileDown,
  Edit,
  ArrowBigDown,
  ArrowBigUp,
  X,
  CheckCircle,
} from "lucide-react";



const InventoryPanel = () => {
  const [modal, setModal] = useState({ open: false, type: "", product: null });
  const [quickEntry, setQuickEntry] = useState({
    cantidad: "",
    observacion: "",
    generarHistorial: false,
  });

  // Datos ahora vendrán de la API
  const [products, setProducts] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [newProduct, setNewProduct] = useState({
    caja: "",
    amperaje: "",
    polaridad: "",
    voltaje: "",
    stock: "",
    imagen: "",
    marca: "",
    sucursal: "",
  });

  // Función para obtener productos desde la API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/productos/");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Función para obtener marcas desde la API
  const fetchMarcas = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/marcas/");
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error("Error fetching marcas:", error);
    }
  };

  // Función para obtener sucursales desde la API
  const fetchSucursales = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/sucursales/");
      const data = await response.json();
      setSucursales(data);
    } catch (error) {
      console.error("Error fetching sucursales:", error);
    }
  };

  // Efecto para cargar productos, marcas y sucursales al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchMarcas();
    fetchSucursales();
  }, []);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const openModal = (type, product = null) => {
    setModal({ open: true, type, product });
    if (type === "edit" && product) {
      setNewProduct({
        ...product, // Copia todos los valores del producto existente
        sucursal: product.sucursal, // Fija el valor de sucursal al original
        imagen: product.imagen || "", // Mantiene la imagen como URL o vacía
      });
    } else if (type === "add") {
      setNewProduct({ caja: "", amperaje: "", polaridad: "", voltaje: "", stock: "", imagen: "", marca: "", sucursal: "" });
    }
    if (type === "addfast" && product) {
      setQuickEntry({
        cantidad: "",
        observacion: "",
        generarHistorial: false,
      });
    }
  };

  const closeModal = () => {
    setModal({ open: false, type: "", product: null });
    setNewProduct({ caja: "", amperaje: "", polaridad: "", voltaje: "", stock: "", imagen: "", marca: "", sucursal: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caja', newProduct.caja);
    formData.append('amperaje', parseInt(newProduct.amperaje, 10) || 0);
    formData.append('polaridad', newProduct.polaridad);
    formData.append('voltaje', parseInt(newProduct.voltaje, 10) || 0);
    formData.append('stock', parseInt(newProduct.stock, 10) || 0);
    formData.append('marca', parseInt(newProduct.marca, 10) || 0);
    // No agregar formData.append('sucursal', ...) en modo edit

    if (newProduct.imagen && newProduct.imagen instanceof File) {
      formData.append('imagen', newProduct.imagen);
    }

    let url = "http://localhost:8000/api/productos/";
    let method = "POST";

    if (modal.type === "edit") {
      url += `${modal.product.id}`;
      method = "PUT";
      // En modo edit, solo enviamos los campos que se pueden modificar
    } else if (modal.type === "add") {
      formData.append('sucursal', parseInt(newProduct.sucursal, 10) || 0); // Solo para agregar
    }

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      if (modal.type === "add") {
        setProducts([...products, data]);
      } else if (modal.type === "edit") {
        setProducts(products.map((p) => (p.id === data.id ? data : p)));
      }

      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error(`Error ${modal.type === "add" ? "creating" : "updating"} product:`, error);
    }
  };

  const handleQuickEntry = (e) => {
    e.preventDefault();
    console.log("Generar entrada rápida:", {
      producto: modal.product,
      cantidad: quickEntry.cantidad,
      observacion: quickEntry.observacion,
      generarHistorial: quickEntry.generarHistorial,
    });
    closeModal();
  };

  const handleDelete = async (productId) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/productos/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        // Actualiza el estado eliminando el producto
        setProducts(products.filter((p) => p.id !== productId));
        closeModal();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="rounded-2xl shadow-sm">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">GESTIÓN DE INVENTARIO</h1>
        <p className="text-gray-500">
          Administra tus productos y controla el stock del sistema.
        </p>
      </div>

      {/* --- LISTADO PRINCIPAL --- */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Agregar producto
          </button>
          <button
            onClick={() => openModal("inventory")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Package size={18} /> Hacer inventario
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="p-2 text-center">Imagen</th>
              <th className="p-2 text-center">Marca</th>
              <th className="p-2 text-center">Caja</th>
              <th className="p-2 text-center">Polaridad</th>
              <th className="p-2 text-center">Stock</th>
              <th className="p-2 text-center">Amperaje</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b h-12">
                <td className="p-2 align-middle flex justify-center items-center">
                  {p.imagen && (
                    <img
                      src={p.imagen}
                      alt={`${p.marca_nombre} ${p.caja}`}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-2 align-middle text-center">{p.marca_nombre}</td>
                <td className="p-2 align-middle text-center">{p.caja}</td>
                <td className="p-2 align-middle text-center">{p.polaridad}</td>
                <td className="p-2 align-middle text-center">{p.stock}</td>
                <td className="p-2 align-middle text-center">{p.amperaje}</td>
                <td className="p-2 align-middle text-center">
                  <div className="flex justify-center items-center gap-3 h-full">
                    <div className="relative group">
                      <Edit
                        size={20}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                        onClick={() => openModal("edit", p)}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200">
                        Editar
                      </span>
                    </div>
                    <div className="relative group">
                      <ArrowBigUp
                        size={20}
                        className="text-green-600 hover:text-green-800 cursor-pointer transition"
                        onClick={() => openModal("addfast", p)}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200">
                        Entrada de producto rapida
                      </span>
                    </div>
                    <div className="relative group">
                      <ArrowBigDown
                        size={20}
                        className="text-red-600 hover:text-red-800 cursor-pointer transition"
                        onClick={() => openModal("deletefast", p)}
                      />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200">
                        Salida de producto rapida
                      </span>
                    </div>
                  </div>  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALES --- */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh] font-[Inter,sans-serif]">
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 transition"
            >
              <X size={20} />
            </button>

            {/* --- Modal ADDFAST --- */}
            {modal.type === "addfast" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-[#00C853] text-center">
                  Entrada de stock rápida
                </h2>
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={modal.product?.imagen}
                    alt={modal.product?.marca_nombre}
                    className="w-14 h-14 rounded-lg border"
                  />
                  <p className="font-semibold text-gray-800">
                    {modal.product?.marca_nombre} {modal.product?.caja}{" "}
                    {modal.product?.polaridad}
                  </p>
                </div>
                <form onSubmit={handleQuickEntry} className="space-y-5">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      value={quickEntry.cantidad}
                      onChange={(e) =>
                        setQuickEntry({ ...quickEntry, cantidad: e.target.value })
                      }
                      placeholder="Ingrese la cantidad"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Observación
                    </label>
                    <textarea
                      rows="4"
                      value={quickEntry.observacion}
                      onChange={(e) =>
                        setQuickEntry({ ...quickEntry, observacion: e.target.value })
                      }
                      placeholder="Escriba una observación..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={quickEntry.generarHistorial}
                      onChange={(e) =>
                        setQuickEntry({
                          ...quickEntry,
                          generarHistorial: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-green-600"
                    />
                    <label className="text-gray-700 font-medium">
                      Generar historial
                    </label>
                  </div>
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="bg-[#00C853] hover:bg-[#00B44A] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <CheckCircle size={20} /> Generar entrada de producto
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Modal para agregar/editar producto */}
            {(modal.type === "add" || modal.type === "edit") && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {modal.type === "add" ? "Agregar producto" : "Editar producto"}
              </h2>
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium">Marca</label>
                  <select
                    name="marca"
                    value={newProduct.marca}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    required
                  >
                    <option value="">Seleccionar marca...</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Eliminamos el <div> de Sucursal completamente */}
                <div>
                  <label className="block text-gray-700 font-medium">Caja</label>
                  <input
                    name="caja"
                    value={newProduct.caja}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Amperaje</label>
                  <input
                    name="amperaje"
                    type="number"
                    value={newProduct.amperaje}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Polaridad</label>
                  <select
                    name="polaridad"
                    value={newProduct.polaridad}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Iz">Iz</option>
                    <option value="De">De</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Voltaje</label>
                  <input
                    name="voltaje"
                    type="number"
                    value={newProduct.voltaje}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Imagen</label>
                  <input
                    type="file"
                    name="imagen"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setNewProduct((prev) => ({ ...prev, imagen: file }));
                    }}
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                  {modal.type === "edit" && (
                    <button
                      type="button"
                      onClick={() => handleDelete(modal.product.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

            {modal.type === "deletefast" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-[#D50000] text-center">
                  Eliminación rápida de stock
                </h2>
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={modal.product?.imagen}
                    alt={modal.product?.marca_nombre}
                    className="w-14 h-14 rounded-lg border"
                  />
                  <p className="font-semibold text-gray-800">
                    {modal.product?.marca_nombre} {modal.product?.caja}{" "}
                    {modal.product?.polaridad}
                  </p>
                </div>
                <form onSubmit={handleQuickEntry} className="space-y-5">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      value={quickEntry.cantidad}
                      onChange={(e) =>
                        setQuickEntry({ ...quickEntry, cantidad: e.target.value })
                      }
                      placeholder="Ingrese la cantidad"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Observación
                    </label>
                    <textarea
                      rows="4"
                      value={quickEntry.observacion}
                      onChange={(e) =>
                        setQuickEntry({ ...quickEntry, observacion: e.target.value })
                      }
                      placeholder="Escriba una observación..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={quickEntry.generarHistorial}
                      onChange={(e) =>
                        setQuickEntry({
                          ...quickEntry,
                          generarHistorial: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-green-600"
                    />
                    <label className="text-gray-700 font-medium">
                      Generar historial
                    </label>
                  </div>
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="bg-[#D50000] hover:bg-[#C00000] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <ArrowBigDown size={22} /> Confirmar salida de producto
                    </button>
                    </div>
                  </form>
                </>
              )}

            {modal.type === "inventory" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Hacer inventario
                </h2>
                <p className="text-gray-500 mb-4">
                  Realiza conteos físicos y ajusta las existencias.
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100 text-gray-700 text-left">
                      <th className="p-2">Batería</th>
                      <th className="p-2">Stock</th>
                      <th className="p-2">Conteo</th>
                      <th className="p-2">Ventas</th>
                      <th className="p-2">+/-</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 border-b ">
                        <td className="p-2">{`${p.marca_nombre} ${p.caja} ${p.polaridad}`}</td>
                        <td className="p-2">{p.stock}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            defaultValue={p.stock}
                            className="border rounded-lg p-1 w-20"
                          />
                        </td>
                        <td className="p-2">{p.ventas || 0}</td>
                        <td className="p-2 font-semibold text-blue-600">
                          {p.stock - (p.ventas || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex gap-3 mt-6">
                  <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    <FileDown size={18} /> Generar inventario
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPanel;
