import React, { useState } from "react";
import {
  PlusCircle,
  ClipboardList,
  Package,
  FileDown,
  FileUp,
  History,
  Edit,
  Trash2,
  Plus,
  X
} from "lucide-react";

const InventoryPanel = () => {
  const [view, setView] = useState("list");
  const [modal, setModal] = useState({ open: false, type: "", product: null });

  // Datos simulados (más adelante se reemplazan con backend)
  const [products, setProducts] = useState([
    { id: 1, marca: "Faico", caja: "32 850", polaridad: "Iz", stock: 23, ventas: 8 },
    { id: 2, marca: "Mac", caja: "32 950", polaridad: "D", stock: 15, ventas: 10 },
    { id: 3, marca: "Rocket", caja: "NS40 650", polaridad: "I", stock: 5, ventas: 2 },
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

  // --- MODALES ---
  const openModal = (type, product = null) => {
    setModal({ open: true, type, product });
    if (type === "edit" && product) setNewProduct(product);
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
        products.map((p) => (p.id === modal.product.id ? { ...p, ...newProduct } : p))
      );
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    closeModal();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-blue-600">POWERSTOCK</div>
        <nav className="flex-1 p-4 space-y-3 text-sm">
          <button onClick={() => setView("list")} className="flex items-center gap-2 hover:bg-blue-600 w-full p-2 rounded">
            <ClipboardList size={18} /> Inventario
          </button>
          <button onClick={() => setView("inventory")} className="flex items-center gap-2 hover:bg-blue-600 w-full p-2 rounded">
            <Package size={18} /> Hacer inventario
          </button>
          <div className="border-t border-blue-600 my-2" />
          <button className="flex items-center gap-2 hover:bg-blue-600 w-full p-2 rounded">
            <History size={18} /> Historial
          </button>
        </nav>
        <button
          onClick={() => (window.location.href = "/admin")}
          className="bg-blue-900 hover:bg-blue-800 p-3 m-4 rounded-xl flex items-center justify-center font-semibold"
        >
          Atrás
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {view === "list" && "GESTIÓN DE INVENTARIO"}
            {view === "inventory" && "HACER INVENTARIO"}
          </h1>
          <p className="text-gray-500">
            {view === "list" && "Administra tus productos y controla el stock del sistema."}
            {view === "inventory" && "Realiza conteos físicos y actualiza existencias."}
          </p>
        </div>

        {/* --- VISTA DE LISTADO --- */}
        {view === "list" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => openModal("add")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <PlusCircle size={18} /> Agregar producto
              </button>
              <button
                onClick={() => setView("inventory")}
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
                      <div className="relative group">
                        <Edit
                          size={20}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                          onClick={() => openModal("edit", p)}
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          Editar
                        </span>
                      </div>

                      <div className="relative group">
                        <Plus
                          size={20}
                          className="text-green-600 hover:text-green-800 cursor-pointer transition"
                          onClick={() => openModal("add")}
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          Agregar
                        </span>
                      </div>

                      <div className="relative group">
                        <Trash2
                          size={20}
                          className="text-red-600 hover:text-red-800 cursor-pointer transition"
                          onClick={() => openModal("delete", p)}
                        />
                        <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          Eliminar
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- VISTA HACER INVENTARIO --- */}
        {view === "inventory" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Subinterfaz de inventario</h2>
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
                    <td className="p-2 font-semibold text-blue-600">{p.stock - p.ventas}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-3 mt-6">
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                <FileDown size={18} /> Generar inventario
              </button>
              <button
                onClick={() => setView("list")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* --- MODALES --- */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-lg relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>

              {/* Modal Agregar / Editar */}
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

              {/* Modal Eliminar */}
              {modal.type === "delete" && (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-red-600">Eliminar producto</h2>
                  <p className="text-gray-700 mb-6">
                    ¿Deseas eliminar permanentemente el producto{" "}
                    <span className="font-semibold">{modal.product.marca}</span>?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(modal.product.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InventoryPanel;
