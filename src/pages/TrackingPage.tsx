import React from 'react';
import { useParams } from 'react-router-dom';
import TrackingOrder from '../components/TrackingOrder';

const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Código de pedido requerido</h2>
          <p className="text-gray-600">No se proporcionó un código de pedido válido.</p>
        </div>
      </div>
    );
  }

  // orderId aquí es el numeroPedido, por ejemplo EC-000001
  return <TrackingOrder orderId={orderId} />;
};

export default TrackingPage;
