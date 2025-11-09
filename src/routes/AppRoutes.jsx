// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../components/dashboard/admin/AdminDashboard";
import UserDashboard from "../components/dashboard/worker/UserDashboard";
import InventoryPanel from "../components/InventoryPanel";
import Layout from "../components/Layout";
import LoginPage from "../Login";
import WarrantiesPanel from "../components/dashboard/worker/WarrantiesPanel.jsx";
import HistoryPanel from "../components/dashboard/admin/HistoryPanel.jsx";

const AppRoutes = () => {
    return (
        <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Todo lo de aquí abajo tendrá Header fijo */}
        <Route element={<Layout />}>
            <Route
            path="/admin"
            element={
                <ProtectedRoute role="admin">
                <AdminDashboard />
                </ProtectedRoute>
            }
            >
            <Route path="historial" element={<HistoryPanel />} />
            <Route path="garantias" element={<WarrantiesPanel />} />
            <Route path="inventario" element={<InventoryPanel />} />
            </Route>

            <Route
            path="/worker"
            element={
                <ProtectedRoute role="worker">
                <UserDashboard />
                </ProtectedRoute>
            }
            >
            <Route path="inventario" element={<InventoryPanel />} />
            <Route path="historial" element={<HistoryPanel />} />
            <Route path="garantias" element={<WarrantiesPanel />} />
            </Route>
        </Route>
        </Routes>
    );
};

export default AppRoutes;
