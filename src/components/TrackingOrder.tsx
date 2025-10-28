import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  RefreshCw,
  User,
  CreditCard,
  Store,
  Smartphone
} from 'lucide-react';
import { useOrder, OrderStatus } from '../context/OrderContext';
import { formatPriceWithSymbol } from '../config/currency';

interface TrackingOrderProps {
  orderId: string;
}

const TrackingOrder: React.FC<TrackingOrderProps> = ({ orderId }) => {
  const { getOrderById, simulateOrderProgress } = useOrder();
  const [order, setOrder] = useState(getOrderById(orderId));
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const currentOrder = getOrderById(orderId);
    setOrder(currentOrder);
  }, [orderId, getOrderById]);

  const startSimulation = () => {
    if (!order) return;
    setIsSimulating(true);
    simulateOrderProgress(orderId);
    
    // Detener simulación después de que se complete
    setTimeout(() => {
      setIsSimulating(false);
    }, 240000); // 4 minutos total
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return <Package className="h-6 w-6" />;
      case 'asignado':
        return <Truck className="h-6 w-6" />;
      case 'en_camino':
        return <Truck className="h-6 w-6" />;
      case 'entregado':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
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
        return 'Pedido Recibido';
      case 'asignado':
        return 'Asignado a Movilidad';
      case 'en_camino':
        return 'En Camino';
      case 'entregado':
        return 'Entregado';
      default:
        return 'Estado Desconocido';
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case 'recibido':
        return 'Tu pedido ha sido recibido y está siendo procesado';
      case 'asignado':
        return 'Tu pedido ha sido asignado a un repartidor';
      case 'en_camino':
        return 'Tu pedido está en camino a tu ubicación';
      case 'entregado':
        return 'Tu pedido ha sido entregado exitosamente';
      default:
        return 'Estado del pedido desconocido';
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedido no encontrado</h2>
          <p className="text-gray-600 mb-6">El pedido que buscas no existe o ha sido eliminado</p>
          <Link 
            to="/catalogo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const statusOrder: OrderStatus[] = ['recibido', 'asignado', 'en_camino', 'entregado'];
  const currentStatusIndex = statusOrder.indexOf(order.estado);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Link 
              to="/catalogo"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al Catálogo
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Seguimiento de Pedido</span>
          </div>
          
          {/* Botón de simulación para testing */}
          <button
            onClick={startSimulation}
            disabled={isSimulating || order.estado === 'entregado'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isSimulating || order.estado === 'entregado'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulando...' : 'Simular Progreso'}</span>
          </button>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Pedido #{order.numeroPedido}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(order.fecha).toLocaleDateString('es-PE')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(order.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(order.estado)}`}>
              {getStatusIcon(order.estado)}
              <span className="font-medium">{getStatusText(order.estado)}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{getStatusDescription(order.estado)}</p>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos del Pedido</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                    <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      {formatPriceWithSymbol(item.precio)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: {formatPriceWithSymbol((parseFloat(item.precio.replace(/[^\d.]/g, '')) * item.cantidad).toString())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total del Pedido:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPriceWithSymbol(order.total.toString())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Progreso del Pedido</h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-8">
              {statusOrder.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={status} className="relative flex items-start space-x-4">
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? getStatusColor(status)
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {getStatusIcon(status)}
                    </div>
                    
                    {/* Status Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-lg font-medium ${
                          isCompleted ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {getStatusText(status)}
                        </h4>
                        {isCurrent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Actual
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {getStatusDescription(status)}
                      </p>
                      
                      {/* Timestamp */}
                      {isCompleted && (
                        <div className="mt-2 text-xs text-gray-500">
                          {order.historialEstados
                            .filter(h => h.estado === status)
                            .map(h => new Date(h.fecha).toLocaleString('es-PE'))
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Cliente</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-800">{order.cliente.nombre}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-800">{order.cliente.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-800">{order.cliente.telefono}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Entrega</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {order.metodoEntrega === 'domicilio' ? (
                  <MapPin className="h-5 w-5 text-gray-400" />
                ) : (
                  <Store className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-gray-800">
                  {order.metodoEntrega === 'domicilio' ? 'Entrega a Domicilio' : 'Recojo en Tienda'}
                </span>
              </div>
              
              {order.metodoEntrega === 'domicilio' && order.cliente.direccion && (
                <div className="ml-8 text-sm text-gray-600">
                  <p>{order.cliente.direccion}</p>
                  {order.cliente.distrito && <p>{order.cliente.distrito}</p>}
                  {order.cliente.referencia && <p>Ref: {order.cliente.referencia}</p>}
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                {order.metodoPago === 'yape' ? (
                  <Smartphone className="h-5 w-5 text-gray-400" />
                ) : (
                  <CreditCard className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-gray-800">
                  Pago: {order.metodoPago === 'yape' ? 'YAPE' : 'Transferencia Bancaria'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        {order.comentarios && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Comentarios Adicionales</h3>
            <p className="text-gray-600">{order.comentarios}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/catalogo"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Seguir Comprando
          </Link>
          <Link
            to="/contacto"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackingOrder;
