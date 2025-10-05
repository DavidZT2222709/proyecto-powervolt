import React, { useState } from "react";
import {
  PlusCircle,
  Package,
  FileDown,
  Edit,
  Trash2,
  Plus,
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

  // Datos simulados (más adelante se reemplazan con backend)
  const [products, setProducts] = useState([
    {
      id: 1,
      marca: "Faico",
      caja: "32 850",
      polaridad: "Iz",
      stock: 23,
      ventas: 8,
      img: "https://cdn-icons-png.flaticon.com/512/1049/1049872.png",
    },
    {
      id: 2,
      marca: "Mac",
      caja: "32 950",
      polaridad: "D",
      stock: 15,
      ventas: 10,
      img: "https://cdn-icons-png.flaticon.com/512/1049/1049872.png",
    },
    {
      id: 3,
      marca: "Rocket",
      caja: "NS40 650",
      polaridad: "I",
      stock: 5,
      ventas: 2,
      img: "https://cdn-icons-png.flaticon.com/512/1049/1049872.png",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    marca: "",
    caja: "",
    polaridad: "",
    stock: "",
  });

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const openModal = (type, product = null) => {
    setModal({ open: true, type, product });
    if (type === "edit" && product) setNewProduct(product);
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
    setNewProduct({ marca: "", caja: "", polaridad: "", stock: "" });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modal.type === "add") {
      setProducts([...products, { id: Date.now(), ...newProduct }]);
    } else if (modal.type === "edit") {
      setProducts(
        products.map((p) =>
          p.id === modal.product.id ? { ...p, ...newProduct } : p
        )
      );
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    closeModal();
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

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
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
            <tr className="bg-blue-100 text-left text-gray-700">
              <th className="p-2">Marca</th>
              <th className="p-2">Caja</th>
              <th className="p-2">Polaridad</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Ventas</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-b">
                <td className="p-2">{p.marca}</td>
                <td className="p-2">{p.caja}</td>
                <td className="p-2">{p.polaridad}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">{p.ventas}</td>
                <td className="p-2 text-center flex justify-center gap-3">
                  <td className="p-2 text-center flex justify-center gap-5">
                    {/* Editar */}
                    <div className="relative group flex items-center justify-center">
                        <Edit
                        size={20}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                        onClick={() => openModal("edit", p)}
                        />
                        <span
                        className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                                    whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200"
                        >
                        Editar
                        </span>
                    </div>

                    {/* AddFast */}
                    <div className="relative group flex items-center justify-center">
                        <Plus
                        size={22}
                        className="text-green-600 hover:text-green-800 cursor-pointer transition"
                        onClick={() => openModal("addfast", p)}
                        />
                        <span
                        className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                                    whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200"
                        >
                        AddFast
                        </span>
                    </div>

                    {/* Eliminar */}
                    <div className="relative group flex items-center justify-center">
                        <Trash2
                        size={20}
                        className="text-red-600 hover:text-red-800 cursor-pointer transition"
                        onClick={() => openModal("deletefast", p)}
                        />
                        <span
                        className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 
                                    whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200"
                        >
                        DeleteFast
                        </span>
                    </div>
                    </td>

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

                {/* Producto seleccionado */}
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <img
                    src={modal.product?.img}
                    alt={modal.product?.marca}
                    className="w-14 h-14 rounded-lg border"
                  />
                  <p className="font-semibold text-gray-800">
                    {modal.product?.marca} {modal.product?.caja}{" "}
                    {modal.product?.polaridad}
                  </p>
                </div>

                <form onSubmit={handleQuickEntry} className="space-y-5">
                  {/* Cantidad */}
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

                  {/* Observación */}
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

                  {/* Checkbox */}
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

                  {/* Botón acción */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="bg-[#00C853] hover:bg-[#00B44A] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <CheckCircle size={20} /> Generar entrada
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Otros modales ya existentes */}
            {(modal.type === "add" || modal.type === "edit") && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {modal.type === "add" ? "Agregar producto" : "Editar producto"}
                </h2>
                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium">Marca</label>
                    <input
                      name="marca"
                      value={newProduct.marca}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    />
                  </div>
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
                    <label className="block text-gray-700 font-medium">Polaridad</label>
                    <select
                      name="polaridad"
                      value={newProduct.polaridad}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Iz">Izquierda</option>
                      <option value="D">Derecha</option>
                    </select>
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
                  </div>
                </form>
              </>
            )}

            {modal.type === "deletefast" && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-[#D50000] text-center">
                Eliminación rápida de stock
                </h2>

                {/* Producto seleccionado */}
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <img
                    src={modal.product?.img}
                    alt={modal.product?.marca}
                    className="w-14 h-14 rounded-lg border"
                />
                <p className="font-semibold text-gray-800">
                    {modal.product?.marca} {modal.product?.caja}{" "}
                    {modal.product?.polaridad}
                </p>
                </div>

                <form onSubmit={handleQuickEntry} className="space-y-5">
                  {/* Cantidad */}
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

                  {/* Observación */}
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

                  {/* Checkbox */}
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

                  {/* Botón acción */}
                  <div className="flex justify-center pt-4">
                    <button
                    type="submit"
                    className="bg-[#D50000] hover:bg-[#C00000] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                        <Trash2 size={20} /> Confirmar eliminación
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
                      <tr key={p.id} className="hover:bg-gray-50 border-b">
                        <td className="p-2">{`${p.marca} ${p.caja} ${p.polaridad}`}</td>
                        <td className="p-2">{p.stock}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            defaultValue={p.stock}
                            className="border rounded-lg p-1 w-20"
                          />
                        </td>
                        <td className="p-2">{p.ventas}</td>
                        <td className="p-2 font-semibold text-blue-600">
                          {p.stock - p.ventas}
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
