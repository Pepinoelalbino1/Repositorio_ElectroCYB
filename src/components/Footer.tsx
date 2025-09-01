import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Truck, Clock, Star, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  const contactarWhatsApp = () => {
    const mensaje = "Hola! Me gustaría obtener más información sobre sus productos.";
    const numeroWhatsApp = "51940310317"; 
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">Electro C & B</span>
            </div>
            <p className="text-gray-300 mb-4">
              Tu tienda especializada en iluminación LED moderna. Calidad, eficiencia y diseño en cada producto.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={contactarWhatsApp}
                className="bg-green-500 hover:bg-green-600 p-2 rounded-full transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/catalogo" className="text-gray-300 hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Delivery disponible</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Garantía en productos</span>
              </li>
              <li className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Asesoría especializada</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Instalación disponible</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Electro C & B. Todos los derechos reservados. | Especialistas en iluminación LED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;