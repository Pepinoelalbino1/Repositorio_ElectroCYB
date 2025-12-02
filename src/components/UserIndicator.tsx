import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ChevronDown, Settings, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserIndicator: React.FC = () => {
  const { state, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  const firstName = state.user.nombre?.split(' ')[0] || state.user.nombre;
  const isAdmin = state.user.role === 'ADMIN';
  const isCustomer = state.user.role === 'CUSTOMER';

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{firstName}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {/* User Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{state.user.nombre}</p>
                <p className="text-xs text-gray-500">{state.user.email}</p>
                <p className="text-[11px] text-gray-400 uppercase mt-1">Rol: {state.user.role}</p>
              </div>

              {/* 👇 Mis pedidos SOLO CUSTOMER */}
              {isCustomer && (
                <Link
                  to="/mis-pedidos"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Mis pedidos
                </Link>
              )}

              {/* 👇 Opciones SOLO ADMIN */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Panel de Administración
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/productos"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Gestionar productos
                  </Link>
                </>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserIndicator;
