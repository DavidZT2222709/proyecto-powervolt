// src/components/HistoryPanel.jsx
import { useEffect, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, User, Info, X, Edit2, Trash2, Check } from "lucide-react";
import { useSucursal } from "../../../context/SucursalContext";
import { fetchWithToken } from "../../../api/fetchWithToken.js";
import { getUsers } from "../../../api/usuarios.js";

const API_URL = "http://localhost:8000/api"; // generalizado

const HistoryPanel = () => {
  const { selectedSucursal } = useSucursal(); // { id, nombre, ... }
  const [loading, setLoading] = useState(false);
  const [rawInventarios, setRawInventarios] = useState([]);
  const [error, setError] = useState(null);
  const [usersById, setUsersById] = useState({});

  // Modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPayload, setDetailPayload] = useState(null); // { type: "entrada"|"salida"|"lote", item | items[] }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithToken(`${API_URL}/inventarios/`, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const data = await res.json();
        setRawInventarios(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "No se pudo cargar inventarios");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Cargar usuarios una vez y construir el mapa id->nombre
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getUsers();
        if (!mounted || !Array.isArray(list)) return;
        const map = {};
        for (const u of list) {
          map[u.id] = u.nombre || u.username || u.email || String(u.id);
        }
        setUsersById(map);
        // opcional: cache local
        localStorage.setItem("usersById", JSON.stringify(map));
      } catch (err) {
        // fallback desde cache si existe
        const cached = localStorage.getItem("usersById");
        if (cached) {
          try {
            setUsersById(JSON.parse(cached));
          } catch {}
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // -------- Helpers --------
  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString(); // 15/01/2025, 09:30 (según locale)
  };

  const getTipoBadge = (tipo) => {
    switch ((tipo || "").toLowerCase()) {
      case "entrada":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
            <ArrowUpCircle size={16} /> Entrada
          </span>
        );
      case "salida":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
            <ArrowDownCircle size={16} /> Salida
          </span>
        );
      default:
        return (
          <span className="inline-flex bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
            Inventario
          </span>
        );
    }
  };

  // helper para convertir id -> nombre
  const userName = (id, fallbackNombre) => {
    if (fallbackNombre) return fallbackNombre;
    if (id == null) return "—";
    return usersById[id] || String(id);
  };

  // Filtra por sucursal del contexto
  const inventariosBySucursal = useMemo(() => {
    // ⚠️ Si selectedSucursal es un string, reemplaza por: const suc = selectedSucursal;
    const suc = selectedSucursal?.nombre?.toLowerCase();
    if (!suc) return rawInventarios;
    return rawInventarios.filter(
      (i) => (i.sucursal_nombre || "").toLowerCase() === suc
    );
  }, [rawInventarios, selectedSucursal]);

  // Agrupa LOTES (solo tipo "inventario") y deja separadas entradas/salidas
  const rows = useMemo(() => {
    const entradasSalidas = [];
    const lotes = new Map(); // lote_numero -> items[]

    for (const i of inventariosBySucursal) {
      const tipo = (i.tipo_inventario_nombre || "").toLowerCase();
      if (tipo === "inventario" && i.lote_numero != null) {
        const k = String(i.lote_numero);
        if (!lotes.has(k)) lotes.set(k, []);
        lotes.get(k).push(i);
      } else {
        entradasSalidas.push(i);
      }
    }

    // Normaliza filas para la tabla:
    // - Entradas/Salidas: una fila por item
    // - Inventario: una fila por lote (toma fecha del primer registro del lote)
    const loteRows = Array.from(lotes.entries()).map(([lote, items]) => {
      // ordena por fecha asc para tener el "primero" de forma estable
      const sorted = [...items].sort(
        (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      );
      const head = sorted[0];
      return {
        kind: "lote",
        lote: Number(lote),
        items: sorted, // para el modal
        fecha_creacion: head?.fecha_creacion,
        tipo_inventario_nombre: "inventario",
        usuario: head?.usuario,
        sucursal_nombre: head?.sucursal_nombre,
      };
    });

    const simpleRows = entradasSalidas.map((i) => ({
      kind: "single",
      item: i,
    }));

    // Ordena por fecha DESC
    const all = [
      ...loteRows,
      ...simpleRows
    ].sort((a, b) => {
      const fa = new Date(a.kind === "lote" ? a.fecha_creacion : a.item.fecha_creacion).getTime();
      const fb = new Date(b.kind === "lote" ? b.fecha_creacion : b.item.fecha_creacion).getTime();
      return fb - fa;
    });

    return all;
  }, [inventariosBySucursal]);

  const openDetail = (row) => {
    if (row.kind === "lote") {
      setDetailPayload({ type: "lote", items: row.items, lote: row.lote });
    } else {
      const tipo = (row.item.tipo_inventario_nombre || "").toLowerCase();
      setDetailPayload({
        type: tipo === "entrada" ? "entrada" : "salida",
        item: row.item,
      });
    }
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailPayload(null);
  };

  // -------- Render --------
  return (
    <div className="rounded-2xl shadow-sm">
      {/* Encabezado superior */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          HISTORIAL DE MOVIMIENTOS
        </h1>
        <p className="text-gray-500">
          Registro completo de inventario, entradas y salidas de inventario.
        </p>
      </div>

      {/* Estados */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {loading ? (
          <div className="text-gray-500">Cargando…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-gray-700">
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-left">Tipo</th>
                  <th className="p-2 text-left">Producto</th>
                  <th className="p-2 text-left">Usuario</th>
                  <th className="p-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No hay movimientos para la sucursal seleccionada.
                    </td>
                  </tr>
                )}

                {rows.map((row, idx) => {
                  if (row.kind === "lote") {
                    const fecha = formatDate(row.fecha_creacion);
                    const usuario = userName(row.usuario, row.usuario_nombre); 
                    return (
                      <tr key={`lote-${row.lote}-${idx}`} className="hover:bg-gray-50 border-b h-12">
                        <td className="p-2 align-middle">{fecha}</td>
                        <td className="p-2 align-middle">{getTipoBadge("Inventario")}</td>
                        <td className="p-2 align-middle">
                          Lote #{row.lote} ({row.items.length} ítems)
                        </td>
                        <td className="p-2 align-middle flex items-center gap-2 text-gray-700">
                          <User size={16} /> {usuario}
                        </td>
                        <td className="p-2 align-middle">
                          <button
                            onClick={() => openDetail(row)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Info size={16} /> Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  // SINGLE (entrada/salida)
                  const i = row.item;
                  const fecha = formatDate(i.fecha_creacion);
                  const tipo = i.tipo_inventario_nombre || "—";
                  const usuario = userName(i.usuario);
                  const producto = i.producto_nombre || "—"; // si tu API no lo trae, quedará "—"
                  return (
                    <tr key={`single-${i.id}-${idx}`} className="hover:bg-gray-50 border-b h-12">
                      <td className="p-2 align-middle">{fecha}</td>
                      <td className="p-2 align-middle">{getTipoBadge(tipo)}</td>
                      <td className="p-2 align-middle">{producto}</td>
                      <td className="p-2 align-middle flex items-center gap-2 text-gray-700">
                        <User size={16} /> {usuario}
                      </td>
                      <td className="p-2 align-middle">
                        <button
                          onClick={() => openDetail(row)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Info size={16} /> Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {detailOpen && (
        <DetailModal onClose={closeDetail} payload={detailPayload} userName={userName} />
      )}
    </div>
  );
};

export default HistoryPanel;

/* ========================= Modal ========================= */

const Box = ({ label, value, danger = false }) => (
  <div className="flex justify-between items-center border rounded-lg px-3 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={danger ? "text-red-600 font-semibold" : "text-gray-900"}>
      {value}
    </span>
  </div>
);

const DetailModal = ({ onClose, payload, userName }) => {
  if (!payload) return null;

  const isLote = payload.type === "lote";
  const title =
    payload.type === "entrada"
      ? "Detalle de Entrada"
      : payload.type === "salida"
      ? "Detalle de Salida"
      : `Detalle Inventario – Lote #${payload.lote}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">
        {/* Encabezado solo con el título */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold pr-8">{title}</h3>
        </div>

        {/* Botón de cerrar flotante en la esquina */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600 hover:bg-red-100 rounded-full p-2 transition"
          title="Cerrar"
        >
          <X size={20} />
        </button>

        {/* CONTENIDO */}
        {!isLote ? (
          <DetailSingle item={payload.item} userName={userName} />
        ) : (
          <DetailLote items={payload.items} userName={userName} />
        )}
        <FooterActions payload={payload} onClose={onClose} />
      </div>
    </div>
  );
};

const FooterActions = ({ payload, onClose }) => {
  return (
    <div className="mt-5 flex items-center gap-2">
      {/* Editar comentario (con Guardar/Cancelar cuando está editando) */}
      <EditCommentButton payload={payload} />

      {/* Eliminar (lote completo o simple) */}
      <DeleteButton payload={payload} onClose={onClose} />
    </div>
  );
};


const EditCommentButton = ({ payload }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(payload.type === "lote" ? payload.items[0]?.comentario || "" : payload.item?.comentario || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (payload.type === "lote") {
        // PATCH a todos los ítems del lote
        const resps = await Promise.all(
          payload.items.map((p) =>
            fetchWithToken(`${API_URL}/inventarios/${p.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ comentario: value }),
            })
          )
        );
        const allOk = resps.every((r) => r && r.ok);
        if (!allOk) throw new Error("Alguna actualización falló");
      } else {
        // PATCH a un solo inventario (entrada/salida)
        const resp = await fetchWithToken(`${API_URL}/inventarios/${payload.item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario: value }),
        });
        if (!resp || !resp.ok) throw new Error("Actualización falló");
      }

      setEditing(false);
      alert("Comentario actualizado correctamente.");
      window.location.reload(); // refresca los datos desde el servidor
    } catch (err) {
      alert("Error al actualizar el comentario.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="flex items-center gap-2">
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200"
        >
          <Edit2 size={16} /> Editar comentario
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border rounded-md px-2 py-1 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={saving}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            <Check size={16} /> Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};


const DeleteButton = ({ payload, onClose }) => {
  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      if (payload.type === "lote") {
        // Eliminar todos los items del lote
        await Promise.all(
          payload.items.map((p) =>
            fetchWithToken(`${API_URL}/inventarios/${p.id}`, {
              method: "DELETE",
            })
          )
        );
      } else {
        // Eliminar uno solo
        await fetchWithToken(`${API_URL}/inventarios/${payload.item.id}`, {
          method: "DELETE",
        });
      }
      alert("Eliminado correctamente.");
      onClose();
      window.location.reload();
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
    >
      <Trash2 size={16} /> Eliminar
    </button>
  );
};


const DetailSingle = ({ item, userName }) => {
  const tipo = (item.tipo_inventario_nombre || "").toLowerCase();
  const fecha = new Date(item.fecha_creacion).toLocaleString();

  // cálculos comunes
  const entrada = (item.conteo ?? 0) - (item.stock_anterior ?? 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Box label="Fecha" value={fecha} />
        <Box label="Tipo de inventario" value={item.tipo_inventario_nombre || "—"} />
        <Box label="Producto" value={item.producto_nombre || "—"} />
        <Box label="Usuario" value={userName(item.usuario, item.usuario_nombre)} />
      </div>

      {tipo === "salida" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Box label="Stock anterior" value={item.stock_anterior ?? "—"} />
          <Box label="Ventas" value={item.ventas ?? "—"} />
        </div>
      )}

      {tipo === "entrada" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Box label="Stock anterior" value={item.stock_anterior ?? "—"} />
          <Box label="Entrada" value={entrada} />
        </div>
      )}

      <div>
        <Box label="Comentario" value={item.comentario || "—"} />
      </div>
    </div>
  );
};

const DetailLote = ({ items, userName }) => {
  if (!items?.length) return null;
  const head = items[0];
  const fecha = new Date(head.fecha_creacion).toLocaleString();
  const loteComment = head.comentario || "—";
  const listClass =
    items.length > 3
      ? "space-y-2 max-h-80 overflow-y-auto pr-1"
      : "space-y-2";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Box label="Fecha" value={fecha} />
        <Box label="Tipo de inventario" value="Inventario" />
        <Box label="Usuario" value={userName(head.usuario, head.usuario_nombre)} />
        <Box label="Sucursal" value={head.sucursal_nombre || "—"} />
      </div>

      <div className="mt-2">
        <h4 className="font-semibold mb-2">Productos del lote</h4>
        <div className={listClass}>
          {items.map((p) => {
            const entrada = (p.conteo ?? 0) - (p.stock_anterior ?? 0);
            return (
              <div
                key={p.id}
                className="border rounded-xl p-3 bg-gray-50 flex flex-col gap-2"
              >
                <div className="text-sm text-gray-700">
                  <strong>Producto:</strong> {p.producto_nombre || "—"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Box label="Stock anterior" value={p.stock_anterior ?? "—"} />
                  <Box label="Stock" value={p.conteo ?? "—"} />
                  <Box label="Ventas" value={p.ventas ?? "—"} />
                  <Box
                    label="Diferencias"
                    value={p.num_diferencias ?? "—"}
                    danger={(p.num_diferencias ?? 0) !== 0}
                  />
                  <Box label="Entrada" value={entrada} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Comentario del lote (una sola vez) */}
        <div className="mt-4">
          <Box label="Comentario del lote" value={loteComment} />
        </div>
      </div>
    </div>
  );
};
