import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Eye, RefreshCw, Clock, Truck, CheckCircle } from 'lucide-react';
import { useOrder, OrderStatus } from '../context/OrderContext';
import LoadSampleData from '../components/LoadSampleData';
import { formatPriceWithSymbol } from '../config/currency';

const AdminPanel: React.FC = () => {
  const { state, updateOrderStatus, simulateOrderProgress } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return <Package className="h-4 w-4" />;
      case 'asignado':
        return <Truck className="h-4 w-4" />;
      case 'en_camino':
        return <Truck className="h-4 w-4" />;
      case 'entregado':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return 'text-blue-600 bg-blue-100';
      case 'asignado':
        return 'text-yellow-600 bg-yellow-100';
      case 'en_camino':
        return 'text-orange-600 bg-orange-100';
      case 'entregado':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return 'Recibido';
      case 'asignado':
        return 'Asignado';
      case 'en_camino':
        return 'En Camino';
      case 'entregado':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusOrder: OrderStatus[] = ['recibido', 'asignado', 'en_camino', 'entregado'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSimulateProgress = (orderId: string) => {
    simulateOrderProgress(orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-8">
          <Link 
            to="/catalogo"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al Catálogo
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Panel de Administración</span>
        </div>

        {/* Load Sample Data */}
        <LoadSampleData />

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
            <p className="text-gray-600 mt-1">
              Administra el estado de los pedidos y simula el progreso de entrega
            </p>
          </div>

          {state.orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay pedidos</h3>
              <p className="text-gray-600 mb-4">
                Carga datos de prueba o realiza un pedido para ver el sistema en acción
              </p>
              <Link
                to="/catalogo"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Ir al Catálogo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.orders.map((order) => {
                    const nextStatus = getNextStatus(order.estado);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{order.numeroPedido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.cliente.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.cliente.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                            {getStatusIcon(order.estado)}
                            <span className="ml-1">{getStatusText(order.estado)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPriceWithSymbol(order.total.toString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.fecha).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/tracking/${order.id}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Ver</span>
                            </Link>
                            
                            {nextStatus && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <RefreshCw className="h-4 w-4" />
                                <span>Actualizar</span>
                              </button>
                            )}
                            
                            {order.estado !== 'entregado' && (
                              <button
                                onClick={() => handleSimulateProgress(order.id)}
                                className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                              >
                                <Clock className="h-4 w-4" />
                                <span>Simular</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Instrucciones de Prueba - ElectroCYB</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>1. Cargar Datos:</strong> Usa el botón "Cargar Datos" para agregar pedidos de ejemplo con productos LED</p>
            <p><strong>2. Ver Tracking:</strong> Haz clic en "Ver" para ver el seguimiento detallado del pedido</p>
            <p><strong>3. Actualizar Estado:</strong> Usa "Actualizar" para cambiar manualmente el estado del pedido</p>
            <p><strong>4. Simular Progreso:</strong> Usa "Simular" para que el pedido progrese automáticamente</p>
            <p><strong>5. IDs de Prueba:</strong> Puedes acceder directamente a /tracking/order_sample_1, order_sample_2, etc.</p>
            <p><strong>6. Productos Incluidos:</strong> Lámparas LED, Tiras LED RGB, Focos LED, Fuentes de poder, Kit Solar, Detector de billetes, Extensiones, Mangueras LED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
