import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, AlertCircle, Truck, CheckCircle } from 'lucide-react';
import { getMyOrders, OrderResponse, OrderStatus } from '../api/orders';
import { formatPriceWithSymbol } from '../config/currency';

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return 'Recibido';
      case 'PAGO_VERIFICADO':
        return 'Pago verificado';
      case 'EN_CAMINO':
        return 'En camino';
      case 'ENTREGADO':
        return 'Entregado';
      default:
        return status;
    }
  };

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return 'text-blue-600 bg-blue-100';
      case 'PAGO_VERIFICADO':
        return 'text-yellow-600 bg-yellow-100';
      case 'EN_CAMINO':
        return 'text-orange-600 bg-orange-100';
      case 'ENTREGADO':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const statusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return <Package className="h-4 w-4" />;
      case 'PAGO_VERIFICADO':
      case 'EN_CAMINO':
        return <Truck className="h-4 w-4" />;
      case 'ENTREGADO':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus pedidos.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando tus pedidos...</h2>
          <p className="text-gray-600">Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ocurrió un problema</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/catalogo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Mis pedidos</h1>
          <Link to="/catalogo" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Seguir comprando
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Aún no tienes pedidos</h2>
            <p className="text-gray-600 mb-4">
              Cuando realices compras, podrás ver aquí el historial de tus pedidos.
            </p>
            <Link
              to="/catalogo"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Pedido</span>
                    <span className="font-semibold text-gray-800">#{order.numeroPedido}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.fecha).toLocaleString('es-PE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items.length} producto
                    {order.items.length !== 1 ? 's' : ''} ·{' '}
                    {formatPriceWithSymbol(order.total.toFixed(2))}
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end space-y-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                      order.estado
                    )}`}
                  >
                    {statusIcon(order.estado)}
                    <span className="ml-1">{statusLabel(order.estado)}</span>
                  </span>

                  <Link
                    to={`/tracking/${order.numeroPedido}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver detalle →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
