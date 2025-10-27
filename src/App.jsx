import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './Login';
import AdminDashboard from './components/dashboard/admin/AdminDashboard.jsx'; 
import UserDashboard from './components/dashboard/worker/UserDashboard.jsx'; 

function App() {
    return (
        <Router>
        <Routes>
            {/* Rutas sin header */}
            <Route path="/login" element={<Login />} />

            {/* Rutas con header (protegidas) */}
            <Route path="/" element={<Layout><AdminDashboard /></Layout>} /> {/* Raíz va a admin */}
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/user" element={<Layout><UserDashboard /></Layout>} />
            {/* Agrega más rutas aquí si las necesitas */}
        </Routes>
        </Router>
    );
}

export default App;