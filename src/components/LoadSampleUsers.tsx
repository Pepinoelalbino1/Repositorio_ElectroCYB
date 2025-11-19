import React from 'react';
import { UserPlus } from 'lucide-react';

const LoadSampleUsers: React.FC = () => {
  const loadSampleUsers = () => {
    const sampleUsers = [
      {
        id: '1',
        nombre: 'Usuario Demo',
        email: 'demo@electro.com',
        telefono: '+51 999 999 999',
        password: 'demo123',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        telefono: '+51 987 654 321',
        password: 'password123',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        nombre: 'María García',
        email: 'maria@email.com',
        telefono: '+51 912 345 678',
        password: 'password123',
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem('users', JSON.stringify(sampleUsers));
    alert(
      'Usuarios de prueba cargados exitosamente!\n\nCredenciales de prueba:\nEmail: demo@electro.com\nContraseña: demo123'
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={loadSampleUsers}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center space-x-2"
        title="Cargar usuarios de prueba"
      >
        <UserPlus className="h-5 w-5" />
        <span className="hidden sm:block">Cargar Usuarios Demo</span>
      </button>
    </div>
  );
};

export default LoadSampleUsers;
