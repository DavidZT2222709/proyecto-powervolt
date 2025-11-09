import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  MinusCircle,
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

  // Tipos de inventario (para elegir "inventario")
  const [tiposInventario, setTiposInventario] = useState([]);

  // Flujo de generación de inventario
  const [precheckOpen, setPrecheckOpen] = useState(false);   // muestra panel previo si hay diferencias
  const [precheckDiffs, setPrecheckDiffs] = useState([]);    // [{id, nombre, diff}]
  const [genComment, setGenComment] = useState("");          // comentario general (si hay diferencias)
  const [posting, setPosting] = useState(false);             // loading para POST


  // Estados para búsqueda y filtro en inventario
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Productos agregados al listado de inventario (cajita)
  const [selectedInventory, setSelectedInventory] = useState([]);


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

  ///////////////////////////////////////////////
  // Agregar desde el resultado de búsqueda a la cajita
  const handleAddFromSearch = (prod) => {
    // Evita duplicados
    setSelectedInventory((prev) => {
      if (prev.some((p) => p.id === prod.id)) return prev;
      return [...prev, { ...prod, conteo: 0, ventas: 0 }];
    });
    // Saca el producto de los resultados de búsqueda
    setSearchResults((prev) => prev.filter((p) => p.id !== prod.id));
  };

  // Helpers para editar valores en la cajita
  const handleIncrement = (id) =>
    setSelectedInventory((prev) =>
      prev.map((it) => (it.id === id ? { ...it, conteo: it.conteo + 1 } : it))
    );

  const handleDecrement = (id) =>
    setSelectedInventory((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, conteo: Math.max(0, it.conteo - 1) } : it
      )
    );

  const calcDiff = (item) =>
  (Number(item.stock) || 0) - (Number(item.conteo) || 0) - (Number(item.ventas) || 0);


  const handleConteoInput = (id, value) =>
    setSelectedInventory((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, conteo: Math.max(0, Number(value) || 0) } : it
      )
    );

  const handleVentasChange = (id, value) =>
    setSelectedInventory((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, ventas: Math.max(0, Number(value) || 0) } : it
      )
    );
    ///////////////////////////////////////////////

  
  // Quitar un producto de la cajita y reponerlo en la lista de búsqueda si aplica
  const handleRemoveFromInventory = (id) => {
    setSelectedInventory((prev) => {
      const removed = prev.find((p) => p.id === id);
      const rest = prev.filter((p) => p.id !== id);

      // Si hay texto de búsqueda activo, y el ítem coincide con el filtro actual, lo reponemos en resultados
      if (removed && searchTerm.trim() !== "") {
        const matchesText = removed.nombre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        const removedMarca = (removed.marca_nombre || "").toLowerCase().trim();
        const matchesMarca = !selectedMarca || removedMarca === selectedMarca;

        if (matchesText && matchesMarca) {
          setSearchResults((prevResults) => {
            // Evitar duplicado si ya está
            if (prevResults.some((r) => r.id === removed.id)) return prevResults;
            return [removed, ...prevResults];
          });
        }
      }

      return rest;
    });
  };

  // Buscar productos en tiempo real según texto y marca
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]); // no buscar si no hay texto
        return;
      }

      try {
        let url = `http://127.0.0.1:8000/api/productos/?q=${encodeURIComponent(searchTerm)}`;
        if (selectedMarca) {
          url += `&marca=${selectedMarca}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error al buscar productos:", error);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedMarca]);

  // Función para obtener tipos de inventario desde la API
  const fetchTiposInventario = async () => {
    try {
      const resp = await fetch("http://localhost:8000/api/tipos-inventario/");
      const data = await resp.json();
      setTiposInventario(data);
    } catch (e) {
      console.error("Error fetching tipos inventario:", e);
    }
  };

  // Efecto para cargar productos, marcas y sucursales al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchMarcas();
    fetchSucursales();
    fetchTiposInventario();
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

  // Derivados para no mostrar en búsqueda lo ya agregado a la cajita
  const selectedIds = new Set(selectedInventory.map((i) => i.id));
  const visibleResults = searchResults.filter((p) => !selectedIds.has(p.id));

  ///////////////////////////////////////////////////
  //Al pulsar "Generar inventario": validar diferencias y abrir panel previo si aplica
  const handleGenerateClick = () => {
    if (selectedInventory.length === 0) {
      alert("No hay productos en el listado de inventario.");
      return;
    }

    const diffs = selectedInventory
      .map(it => ({ id: it.id, nombre: it.nombre, diff: calcDiff(it) }))
      .filter(x => x.diff !== 0);

    if (diffs.length > 0) {
      setPrecheckDiffs(diffs);
      setGenComment("");      // comentario en blanco
      setPrecheckOpen(true);  // abrimos panel de confirmación con comentario
    } else {
      // Sin diferencias => ir directo a confirmar y postear
      confirmAndPost("");
    }
  };

  //Confirmación y POST
  const confirmAndPost = async (comentarioGeneral) => {
    const ok = window.confirm("¿Está seguro de generar el inventario?");
    if (!ok) return;

    try {
      setPosting(true);

      // tipo_inventario: el que se llama "inventario"
      const tipoInv = (tiposInventario || []).find(
        (t) => (t.nombre || "").toLowerCase().trim() === "inventario"
      );
      const tipo_inventario_id = tipoInv ? tipoInv.id : undefined;

      // sucursal: temporalmente "Piedecuesta"
      const piedecuesta = (sucursales || []).find(
        (s) => (s.nombre || "").toLowerCase().trim() === "piedecuesta"
      );
      const sucursal_id = piedecuesta ? piedecuesta.id : sucursales[0]?.id;

      if (!tipo_inventario_id || !sucursal_id) {
        alert("No fue posible resolver tipo de inventario o sucursal. Verifique catálogos.");
        setPosting(false);
        return;
      }

      const usuario_id = 1;

      // 🔹 1) Enviar todos los productos en un solo POST (lista)
      const url = "http://127.0.0.1:8000/inventarios/";
      const payloadList = selectedInventory.map((it) => ({
        tipo_inventario_id,
        sucursal_id,
        producto_id: it.id,
        conteo: Number(it.conteo) || 0,
        ventas: Number(it.ventas) || 0,
        comentario: comentarioGeneral || "",
        usuario: usuario_id,
      }));

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadList),
      });

      if (!resp.ok) {
        throw new Error(`Error ${resp.status}: ${await resp.text()}`);
      }

      // 🔹 2) Leer respuesta para obtener el número de lote
      const created = await resp.json();
      const lote = created?.[0]?.lote_numero;

      // 🔹 3) Mostrar mensaje indicando el lote
      alert(`✅ Inventario generado exitosamente.\nLote #${lote}`);

      // 🔹 4) Limpiar listado y recargar productos
      setSelectedInventory([]);
      await fetchProducts();

      // Cerrar el modal de precheck si estaba abierto
      setPrecheckOpen(false);
      setPrecheckDiffs([]);
      setGenComment("");

    } catch (e) {
      console.error(e);
      alert("Hubo un error generando el inventario. Revisa la consola para más detalle.");
    } finally {
      setPosting(false);
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
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] font-[Inter,sans-serif]">
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

                {/* --- Barra de búsqueda y filtro --- */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <select
                    value={selectedMarca}
                    onChange={(e) => setSelectedMarca(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="">Filtrar por marca</option>
                    {marcas.map((marca) => (
                      // La API espera texto (ej: faico). Normalizamos a minúsculas y sin espacios en extremos.
                      <option key={marca.id} value={marca.nombre.toLowerCase().trim()}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- Resultados de búsqueda --- */}
                {searchTerm.trim() !== "" && (
                  <div
                    className="mb-6 border rounded-lg overflow-y-auto"
                    style={{ maxHeight: 228 }}
                  >
                    {/* >>> 5) Usar visibleResults en lugar de searchResults */}
                    {visibleResults.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">Sin resultados</div>
                    ) : (
                      visibleResults.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 transition border-b"
                          style={{ minHeight: 72 }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imagen}
                              alt={prod.nombre}
                              className="w-12 h-12 rounded object-cover border"
                            />
                            <span className="font-medium text-gray-800">{prod.nombre}</span>
                          </div>

                          {/* >>> 5) Este botón ahora agrega a la cajita y saca el ítem de los resultados */}
                          <button
                            type="button"
                            onClick={() => handleAddFromSearch(prod)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Agregar al inventario"
                          >
                            <PlusCircle size={22} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {/* ---------------------------------------------------- */}


                {/*Cajita del inventario (scroll después de 5 ítems) */}
                {/* Cajita del inventario (una sola tabla, header sticky, sin scroll horizontal) */}
                {selectedInventory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Listado de inventario</h3>

                    <div className="rounded-lg border overflow-hidden">
                      {/* Contenedor con scroll vertical y ocultando horizontal */}
                      <div className="max-h-[340px] overflow-y-auto overflow-x-hidden">
                        <table className="w-full text-sm table-fixed">
                          {/* Proporciones parecidas a tu mock: menos ancho para “Baterías” */}
                          <colgroup>
                            <col style={{ width: "36%" }} /> {/* Baterías */}
                            <col style={{ width: "12%" }} /> {/* Stock */}
                            <col style={{ width: "22%" }} /> {/* Conteo */}
                            <col style={{ width: "20%" }} /> {/* Ventas */}
                            <col style={{ width: "10%" }} /> {/* + / - */}
                          </colgroup>


                        <thead className="bg-gray-100 sticky top-0 z-10">
                          <tr>
                            <th className="text-left px-4 py-3 text-base font-extrabold">Baterías</th>
                            <th className="text-center px-3 py-3 text-base font-extrabold">Stock</th>
                            <th className="text-center px-3 py-3 text-base font-extrabold">Conteo</th>
                            <th className="text-center px-3 py-3 text-base font-extrabold">Ventas</th>
                            <th className="text-center px-3 py-3 text-base font-extrabold whitespace-nowrap">+ / −</th>
                          </tr>
                        </thead>

                        <tbody>
                          {selectedInventory.map((it) => {
                            const diff = calcDiff(it);
                            const isZero = diff === 0;  

                            return (
                              <tr key={it.id} className="bg-white border-b last:border-b-0">
                                {/* Baterías */}
                                <td className="px-4 py-3 align-middle">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img
                                      src={it.imagen}
                                      alt={it.nombre}
                                      className="w-11 h-11 rounded object-cover border flex-shrink-0"
                                    />
                                    <div className="font-semibold truncate">{it.nombre}</div>
                                  </div>
                                </td>

                                {/* Stock */}
                                <td className="px-3 py-2.5 text-center align-middle">
                                  <span className="font-extrabold text-[17px]">{it.stock}</span>
                                </td>

                                {/* Conteo -> + / − juntos + “píldora” azul con el valor */}
                                <td className="px-3 py-3 text-center align-middle">
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleIncrement(it.id)}
                                      className="text-green-600 hover:text-green-800"
                                      title="Sumar"
                                    >
                                      <PlusCircle size={22} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDecrement(it.id)}
                                      className="text-red-600 hover:text-red-800"
                                      title="Restar"
                                    >
                                      <MinusCircle size={22} />
                                    </button>

                                    {/* “Píldora” editable opcional: si la quieres editable, deja el input; si no, úsalo como display */}
                                    <input
                                      type="number"
                                      value={it.conteo}
                                      onChange={(e) => handleConteoInput(it.id, e.target.value)}
                                      className="w-14 text-center font-extrabold text-white rounded-full px-2 py-1 bg-blue-600
                                                appearance-none
                                                [--tw-ring-offset-shadow:0_0_#0000] [--tw-ring-shadow:0_0_#0000]
                                                [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                  </div>
                                </td>

                                {/* Ventas */}
                                <td className="px-3 py-3 text-center align-middle">
                                  <div className="inline-flex items-center gap-3">
                                    <input
                                      type="number"
                                      value={it.ventas}
                                      onChange={(e) => handleVentasChange(it.id, e.target.value)}
                                      className="w-20 text-center rounded-lg px-2 py-1 border
                                                appearance-none
                                                [&::-webkit-outer-spin-button]:appearance-none
                                                [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                  </div>
                                </td>


                                {/* + / - (diferencia) + eliminar */}
                                <td className="px-3 py-3 text-center align-middle">
                                  <div className="flex items-center justify-center gap-3">
                                    <span
                                      className={`font-semibold ${isZero ? "text-blue-600" : "text-red-600"}`}
                                      title="Diferencia = Stock - Conteo - Ventas"
                                    >
                                      {diff}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFromInventory(it.id)}
                                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded"
                                      title="Eliminar de inventario"
                                    >
                                      <X size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {/* ---------------------------------------------------- */}

                {/* --- PRECHECK: solo visible si hay diferencias --- */}
                {precheckOpen && (
                  <div className="mt-4 border rounded-lg p-4 bg-orange-50">
                    <h4 className="font-bold text-orange-800 mb-2">Se detectaron diferencias</h4>
                    <p className="text-orange-700 mb-3 text-sm">
                      Revisa las baterías con diferencia distinta de 0 o deja un comentario general explicando la causa.
                    </p>

                    <ul className="list-disc pl-6 mb-4 text-sm text-orange-900">
                      {precheckDiffs.map(d => (
                        <li key={d.id}>
                          <span className="font-semibold">{d.nombre}</span>: diferencia {d.diff}
                        </li>
                      ))}
                    </ul>

                    {/* Comentario general (solo se pide si hay diferencias) */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comentario general
                    </label>
                    <textarea
                      rows={3}
                      value={genComment}
                      onChange={(e) => setGenComment(e.target.value)}
                      placeholder="Describe brevemente la razón de las diferencias..."
                      className="w-full border rounded-lg p-2 mb-3"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        onClick={() => setPrecheckOpen(false)}
                      >
                        Regresar al inventario
                      </button>

                      <button
                        type="button"
                        disabled={posting}
                        className={`px-4 py-2 rounded-lg text-white
                                    ${posting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        onClick={() => confirmAndPost(genComment)}
                      >
                        {posting ? "Enviando..." : "Continuar y generar"}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* ---------------------------------------------------- */}
                <div className="flex gap-3 mt-6">
                  <button
                    disabled={posting}
                    onClick={handleGenerateClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-white
                                ${posting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    <FileDown size={18} />
                    {posting ? "Generando..." : "Generar inventario"}
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
