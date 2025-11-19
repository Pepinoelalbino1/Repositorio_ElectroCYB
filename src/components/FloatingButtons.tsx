import React, { useState } from 'react';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingButtons: React.FC = () => {
  const { getTotalItems, openCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const totalItems = getTotalItems();

  const contactarWhatsApp = () => {
    const mensaje = 'Hola! Me gustaría obtener más información sobre sus productos.';
    const numeroWhatsApp = '51940310317';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-3">
        {/* Cart Button */}
        {totalItems > 0 && (
          <button
            onClick={openCart}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 relative"
            title="Ver carrito de compras"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          </button>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={contactarWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          title="Contactar por WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default FloatingButtons;
