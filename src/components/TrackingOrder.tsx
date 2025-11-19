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
} from 'lucide-react';
import { getOrderByNumero, OrderResponse, OrderStatus } from '../api/orders';
import { formatPriceWithSymbol } from '../config/currency';

interface TrackingOrderProps {
  orderId: string; // aquí llega el numeroPedido, ej: EC-000001
}

const TrackingOrder: React.FC<TrackingOrderProps> = ({ orderId }) => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setError(null);
      const data = await getOrderByNumero(orderId);
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError('No se encontró un pedido con ese código.');
      setOrder(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return <Package className="h-6 w-6" />;
      case 'PAGO_VERIFICADO':
        return <Truck className="h-6 w-6" />;
      case 'EN_CAMINO':
        return <Truck className="h-6 w-6" />;
      case 'ENTREGADO':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return 'Pedido Recibido';
      case 'PAGO_VERIFICADO':
        return 'Pago Verificado';
      case 'EN_CAMINO':
        return 'En Camino';
      case 'ENTREGADO':
        return 'Entregado';
      default:
        return 'Estado Desconocido';
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return 'Tu pedido ha sido recibido y está siendo procesado.';
      case 'PAGO_VERIFICADO':
        return 'Tu pedido ha sido verificado correctamente.';
      case 'EN_CAMINO':
        return 'Tu pedido está en camino a tu ubicación.';
      case 'ENTREGADO':
        return 'Tu pedido ha sido entregado exitosamente.';
      default:
        return 'Estado del pedido desconocido.';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrder();
  };

  const statusOrder: OrderStatus[] = ['RECIBIDO', 'PAGO_VERIFICADO', 'EN_CAMINO', 'ENTREGADO'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando pedido...</h2>
          <p className="text-gray-600">Estamos obteniendo la información de tu pedido.</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedido no encontrado</h2>
          <p className="text-gray-600 mb-6">
            {error || 'El pedido que buscas no existe o ha sido eliminado.'}
          </p>
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

          {/* Botón para refrescar estado desde backend */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRefreshing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Actualizando...' : 'Actualizar estado'}</span>
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
                  <span>
                    {new Date(order.fecha).toLocaleTimeString('es-PE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(
                order.estado
              )}`}
            >
              {getStatusIcon(order.estado)}
              <span className="font-medium">{getStatusText(order.estado)}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{getStatusDescription(order.estado)}</p>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos del Pedido</h3>
            <div className="space-y-3">
              {order.items.map((item) => {
                const imagenSrc = item.imagen.startsWith('http')
                  ? item.imagen
                  : `http://localhost:8080${item.imagen}`;

                const itemUnitNumeric = parseFloat(item.precio);
                const itemTotalNumeric = itemUnitNumeric * item.cantidad;

                return (
                  <div
                    key={item.productoId}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={imagenSrc}
                      alt={item.nombre}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {formatPriceWithSymbol(itemUnitNumeric.toFixed(2))}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {formatPriceWithSymbol(itemTotalNumeric.toFixed(2))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔹 Desglose de montos: subtotal + envío + total */}
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-900 font-medium">
                  {formatPriceWithSymbol(order.subtotal.toFixed(2))}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Envío:</span>
                <span className="text-gray-900 font-medium">
                  {formatPriceWithSymbol(order.costoEnvio.toFixed(2))}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-800">Total del Pedido:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPriceWithSymbol(order.total.toFixed(2))}
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
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted ? getStatusColor(status) : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {getStatusIcon(status)}
                    </div>

                    {/* Status Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-lg font-medium ${
                            isCompleted ? 'text-gray-800' : 'text-gray-400'
                          }`}
                        >
                          {getStatusText(status)}
                        </h4>
                        {isCurrent && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Actual
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {getStatusDescription(status)}
                      </p>

                      {/* Timestamp desde historialEstados */}
                      {isCompleted && (
                        <div className="mt-2 text-xs text-gray-500">
                          {order.historialEstados
                            .filter((h) => h.estado === status)
                            .map((h) => new Date(h.fecha).toLocaleString('es-PE'))
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
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-800">
                  {order.cliente.direccion ? 'Entrega a Domicilio' : 'Recojo / Entrega a coordinar'}
                </span>
              </div>

              {order.cliente.direccion && (
                <div className="ml-8 text-sm text-gray-600">
                  <p>{order.cliente.direccion}</p>
                  {order.cliente.referencia && <p>Ref: {order.cliente.referencia}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

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
