import React, { useState } from 'react';
import { Home, User, LogOut } from 'lucide-react';

function Header() {
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    return (
        <div className="fixed top-8 right-10 flex items-center space-x-4 p-0 bg-transparent z-50">
        {/* Botón azul: Piedecuesta con desplegable */}
        <div className="relative">
            <button
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
            <Home className="mr-2" size={16} /> {/* Icono Home */}
            Piedecuesta <span className="ml-2">▼</span>
            </button>
            {isLocationOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-2">
                <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opción 1</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opción 2</li>
                </ul>
            </div>
            )}
        </div>

        {/* Botón blanco: Nombre de usuario con avatar y desplegable */}
        <div className="relative">
            <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="bg-white text-gray-800 px-4 py-2 rounded-md flex items-center border border-gray-300"
            >
            <User className="mr-2" size={16} /> {/* Icono User */}
            <span className="font-bold">Pepito Perez</span>
            <span className="ml-2 text-gray-500">Administrador</span>
            <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Avatar"
                className="ml-2 w-8 h-8 rounded-full"
            />
            </button>
            {isUserOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-2">
                <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Perfil</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Configuración</li>
                </ul>
            </div>
            )}
        </div>

        {/* Botón rojo: Cerrar sesión */}
        <button className="bg-red-500 text-white px-4 py-4 rounded-md flex items-center justify-center">
            <LogOut className="mr-0" size={16} /> {/* Icono LogOut */}
        </button>
        </div>
    );
}

export default Header;