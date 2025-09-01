import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Electro C & B</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/catalogo"
              className={`font-medium transition-colors ${
                isActive('/catalogo') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Catálogo
            </Link>
            <Link 
              to="/contacto"
              className={`font-medium transition-colors ${
                isActive('/contacto') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contáctanos
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium py-2 text-left transition-colors ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Inicio
              </Link>
              <Link 
                to="/catalogo"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium py-2 text-left transition-colors ${
                  isActive('/catalogo') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Catálogo
              </Link>
              <Link 
                to="/contacto"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium py-2 text-left transition-colors ${
                  isActive('/contacto') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Contáctanos
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;