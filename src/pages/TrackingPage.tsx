import React from 'react';
import { useParams } from 'react-router-dom';
import TrackingOrder from '../components/TrackingOrder';

const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ID de Pedido Requerido</h2>
          <p className="text-gray-600">No se proporcionó un ID de pedido válido</p>
        </div>
      </div>
    );
  }

  return <TrackingOrder orderId={orderId} />;
};

export default TrackingPage;
