// src/components/HistoryPanel.jsx

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  User,
  Info,
  X,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";
import { useSucursal } from "../context/SucursalContext.jsx";
import { fetchWithToken } from "../api/fetchWithToken.js";
import { getUsers } from "../api/usuarios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const API_URL = "https://gestor-inventarios-7jm8.onrender.com/api";

const HistoryPanel = () => {
  const { selectedSucursal } = useSucursal();
  const [loading, setLoading] = useState(false);
  const [rawInventarios, setRawInventarios] = useState([]);
  const [error, setError] = useState(null);
  const [usersById, setUsersById] = useState({});

  // Modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPayload, setDetailPayload] = useState(null);

  // ==== Cargar inventarios ====
  const loadInventarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithToken(`${API_URL}/inventarios/`);
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setRawInventarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
      toast.error("No se pudieron cargar los inventarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventarios();
  }, []);

  // ==== Cargar usuarios ====
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

        localStorage.setItem("usersById", JSON.stringify(map));
      } catch {
        const cached = localStorage.getItem("usersById");
        if (cached) {
          try {
            setUsersById(JSON.parse(cached));
          } catch {}
        }
      }
    })();
    return () => (mounted = false);
  }, []);

  // Helpers
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString() : "—";

  const getTipoBadge = (tipo) => {
    const t = (tipo || "").toLowerCase();
    if (t === "entrada")
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
          <ArrowUpCircle size={16} /> Entrada
        </span>
      );
    if (t === "salida")
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
          <ArrowDownCircle size={16} /> Salida
        </span>
      );

    return (
      <span className="inline-flex bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-semibold">
        Inventario
      </span>
    );
  };

  const userName = (id, fallback) =>
    fallback || usersById[id] || "—";

  // Filtrar por sucursal
  const inventariosBySucursal = useMemo(() => {
    const suc = selectedSucursal?.nombre?.toLowerCase();
    if (!suc) return rawInventarios;

    return rawInventarios.filter(
      (i) => (i.sucursal_nombre || "").toLowerCase() === suc
    );
  }, [rawInventarios, selectedSucursal]);

  // Agrupación de lotes
  const rows = useMemo(() => {
    const entradasSalidas = [];
    const lotes = new Map();

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

    const loteRows = Array.from(lotes.entries()).map(([lote, items]) => {
      const sorted = [...items].sort(
        (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      );
      const head = sorted[0];

      return {
        kind: "lote",
        lote: Number(lote),
        items: sorted,
        fecha_creacion: head.fecha_creacion,
        usuario: head.usuario,
        sucursal_nombre: head.sucursal_nombre,
      };
    });

    const simpleRows = entradasSalidas.map((i) => ({
      kind: "single",
      item: i,
    }));

    return [...loteRows, ...simpleRows].sort((a, b) => {
      const fa = new Date(a.kind === "lote" ? a.fecha_creacion : a.item.fecha_creacion);
      const fb = new Date(b.kind === "lote" ? b.fecha_creacion : b.item.fecha_creacion);
      return fb - fa;
    });
  }, [inventariosBySucursal]);

  const openDetail = (row) => {
    if (row.kind === "lote") {
      setDetailPayload({
        type: "lote",
        items: row.items,
        lote: row.lote,
      });
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

  // ========================= Render =========================

  return (
    <div className="rounded-2xl shadow-sm">

      <ToastContainer position="top-right" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          HISTORIAL DE MOVIMIENTOS
        </h1>
        <p className="text-gray-500">
          Registro completo de inventario, entradas y salidas.
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

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
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No hay movimientos en esta sucursal.
                    </td>
                  </tr>
                )}

                {rows.map((row, idx) => {
                  if (row.kind === "lote") {
                    const usuario = userName(row.usuario, row.usuario_nombre);

                    return (
                      <tr key={`lote-${row.lote}-${idx}`} className="border-b hover:bg-gray-50 h-12">
                        <td className="p-2">{formatDate(row.fecha_creacion)}</td>
                        <td className="p-2">{getTipoBadge("Inventario")}</td>
                        <td className="p-2">Lote #{row.lote}</td>
                        <td className="p-2 flex items-center gap-2">
                          <User size={16} /> {usuario}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => openDetail(row)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 inline-flex items-center gap-1"
                          >
                            <Info size={16} /> Ver detalle
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  // SINGLE
                  const i = row.item;
                  const usuario = userName(i.usuario);

                  return (
                    <tr key={`single-${i.id}-${idx}`} className="border-b hover:bg-gray-50 h-12">
                      <td className="p-2">{formatDate(i.fecha_creacion)}</td>
                      <td className="p-2">{getTipoBadge(i.tipo_inventario_nombre)}</td>
                      <td className="p-2">{i.producto_nombre || "—"}</td>
                      <td className="p-2 flex items-center gap-2">
                        <User size={16} /> {usuario}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => openDetail(row)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 inline-flex items-center gap-1"
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

      {detailOpen && (
        <DetailModal
          onClose={closeDetail}
          payload={detailPayload}
          userName={userName}
          reload={loadInventarios}
          onUpdatePayload={(updater) =>
            setDetailPayload((prev) => (prev ? updater(prev) : prev))
          }
        />
      )}
    </div>
  );
};

export default HistoryPanel;

/* ============================================
   MODAL + SUBCOMPONENTES
============================================ */

const Box = ({ label, value, danger }) => (
  <div className="flex justify-between border rounded-lg px-3 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={danger ? "text-red-600 font-semibold" : "text-gray-900"}>
      {value}
    </span>
  </div>
);

const CommentBlock = ({ title, text }) => (
  <div className="border rounded-lg px-3 py-2">
    <div className="font-semibold text-gray-700">{title}</div>
    <div className="text-gray-900 whitespace-pre-wrap">
      {text?.trim() ? text : "—"}
    </div>
  </div>
);

// ===== Modal principal =====
const DetailModal = ({ onClose, payload, userName, reload, onUpdatePayload }) => {
  if (!payload) return null;

  const title =
    payload.type === "entrada"
      ? "Detalle de Entrada"
      : payload.type === "salida"
      ? "Detalle de Salida"
      : `Detalle Inventario – Lote #${payload.lote}`;

  return (
    <div className="fixed inset-0 bg-black/30 z-[9999] flex justify-center items-center">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600 hover:bg-red-100 rounded-full p-2"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        {payload.type === "lote" ? (
          <DetailLote items={payload.items} userName={userName} />
        ) : (
          <DetailSingle item={payload.item} userName={userName} />
        )}

        <ModalFooterActions
          payload={payload}
          onClose={onClose}
          reload={reload}
          onUpdatePayload={onUpdatePayload}
        />
      </div>
    </div>
  );
};

// ===== FOOTER: Editar + Eliminar =====
const ModalFooterActions = ({ payload, onClose, reload, onUpdatePayload }) => {
  return (
    <div className="mt-4 flex items-center gap-3">
      <EditCommentButton
        payload={payload}
        reload={reload}
        onUpdatePayload={onUpdatePayload}
      />
      <DeleteButton payload={payload} onClose={onClose} reload={reload} />
    </div>
  );
};

// ===== Editar comentario =====
const EditCommentButton = ({ payload, reload, onUpdatePayload }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState(
    payload.type === "lote"
      ? payload.items[0]?.comentario || ""
      : payload.item?.comentario || ""
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      if (payload.type === "lote") {
        await Promise.all(
          payload.items.map((p) =>
            fetchWithToken(`${API_URL}/inventarios/${p.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ comentario: value }),
            })
          )
        );

        // Actualizar el payload local del modal (comentario de todos los items del lote)
        onUpdatePayload?.((prev) => ({
          ...prev,
          items: prev.items.map((p) => ({
            ...p,
            comentario: value,
          })),
        }));
      } else {
        await fetchWithToken(`${API_URL}/inventarios/${payload.item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario: value }),
        });

        // Actualizar el payload local del modal (comentario del item único)
        onUpdatePayload?.((prev) => ({
          ...prev,
          item: {
            ...prev.item,
            comentario: value,
          },
        }));
      }

      toast.success("Comentario actualizado");
      setEditing(false);
      reload(); // recarga la tabla de abajo
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar el comentario");
    } finally {
      setSaving(false);
    }
  };


  if (!editing)
    return (
      <button
        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 inline-flex items-center gap-1"
        onClick={() => setEditing(true)}
      >
        <Edit2 size={16} /> Editar comentario
      </button>
    );

  return (
    <div className="flex items-center gap-2 w-full">
      <textarea
        rows="3"
        className="w-full border rounded-md p-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 inline-flex items-center gap-1"
      >
        <Check size={16} /> Guardar
      </button>
      <button onClick={() => setEditing(false)} className="text-gray-500">
        Cancelar
      </button>
    </div>
  );
};

// ===== Eliminar =====
const DeleteButton = ({ payload, onClose, reload }) => {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const doDelete = async () => {
    setDeleting(true);
    try {
      if (payload.type === "lote") {
        await Promise.all(
          payload.items.map((p) =>
            fetchWithToken(`${API_URL}/inventarios/${p.id}`, {
              method: "DELETE",
            })
          )
        );
      } else {
        await fetchWithToken(
          `${API_URL}/inventarios/${payload.item.id}`,
          { method: "DELETE" }
        );
      }

      toast.success("Eliminado correctamente");
      onClose();
      reload();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  // Estado normal: solo botón rojo "Eliminar"
  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 inline-flex items-center gap-1"
      >
        <Trash2 size={16} /> Eliminar
      </button>
    );
  }

  // Estado de confirmación: botones dentro del modal
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={doDelete}
        disabled={deleting}
        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center gap-1"
      >
        {deleting ? "Eliminando..." : "Confirmar"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={deleting}
        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
      >
        Cancelar
      </button>
    </div>
  );
};


/* ============================================
   DETALLE SINGLE
============================================ */

const DetailSingle = ({ item, userName }) => {
  const fecha = new Date(item.fecha_creacion).toLocaleString();
  const tipo = (item.tipo_inventario_nombre || "").toLowerCase();
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
        <div className="grid grid-cols-2 gap-3">
          <Box label="Stock anterior" value={item.stock_anterior ?? "—"} />
          <Box label="Ventas" value={item.ventas ?? "—"} />
        </div>
      )}

      {tipo === "entrada" && (
        <div className="grid grid-cols-2 gap-3">
          <Box label="Stock anterior" value={item.stock_anterior ?? "—"} />
          <Box label="Entrada" value={entrada} />
        </div>
      )}

      <CommentBlock title="Comentario" text={item.comentario} />
    </div>
  );
};

/* ============================================
   DETALLE LOTE
============================================ */

const DetailLote = ({ items, userName }) => {
  if (!items?.length) return null;

  const head = items[0];
  const fecha = new Date(head.fecha_creacion).toLocaleString();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Box label="Fecha" value={fecha} />
        <Box label="Tipo de inventario" value="Inventario" />
        <Box label="Usuario" value={userName(head.usuario, head.usuario_nombre)} />
        <Box label="Sucursal" value={head.sucursal_nombre || "—"} />
      </div>

      <h4 className="font-semibold mt-2">Productos del lote</h4>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {items.map((p) => {
          const entrada = (p.conteo ?? 0) - (p.stock_anterior ?? 0);

          return (
            <div key={p.id} className="border rounded-xl p-3 bg-gray-50 space-y-2">
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

      <CommentBlock title="Comentario del lote" text={head.comentario} />
    </div>
  );
};
