import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './Login';

/* ADMINISTRADOR */
import AdminDashboard from './components/dashboard/admin/AdminDashboard.jsx';

/* COLABORADOR */
import UserDashboard from './components/dashboard/worker/WorkerDashboard.jsx';


function App() {
    return (
        <Router>
        <Routes>
            {/* Rutas sin header */}
            <Route path="/" element={<Login />} />

            {/* Rutas con header (protegidas) */}
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/worker" element={<Layout><UserDashboard /></Layout>} />
            {/* Agrega más rutas aquí si las necesitas */}
        </Routes>
        </Router>
    );
}

export default App;