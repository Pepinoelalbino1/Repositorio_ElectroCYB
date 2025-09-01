import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const contactarWhatsApp = () => {
    const mensaje = "Hola! Me gustaría obtener más información sobre sus productos.";
    const numeroWhatsApp = "51940310317"; 
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={contactarWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default WhatsAppButton;