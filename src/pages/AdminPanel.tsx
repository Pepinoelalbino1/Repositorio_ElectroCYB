import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Eye, RefreshCw, Clock, Truck, CheckCircle } from 'lucide-react';
import { getAllOrders, changeOrderStatus, OrderResponse, OrderStatus } from '../api/orders';
import { formatPriceWithSymbol } from '../config/currency';

const statusOptions: OrderStatus[] = ['RECIBIDO', 'PAGO_VERIFICADO', 'EN_CAMINO', 'ENTREGADO'];

const AdminPanel: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // numeroPedido
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, OrderStatus>>({});

  const loadOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);

      // Inicializar el select de estado con el estado actual de cada pedido
      const map: Record<string, OrderStatus> = {};
      data.forEach((o) => {
        map[o.numeroPedido] = o.estado;
      });
      setSelectedStatus(map);
    } catch (err) {
      console.error(err);
      setError('Error al cargar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'RECIBIDO':
        return <Package className="h-4 w-4" />;
      case 'PAGO_VERIFICADO':
        return <Truck className="h-4 w-4" />;
      case 'EN_CAMINO':
        return <Truck className="h-4 w-4" />;
      case 'ENTREGADO':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
        return 'Recibido';
      case 'PAGO_VERIFICADO':
        return 'Pago Verificado';
      case 'EN_CAMINO':
        return 'En Camino';
      case 'ENTREGADO':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const handleChangeStatus = async (numeroPedido: string) => {
    const newStatus = selectedStatus[numeroPedido];
    if (!newStatus) return;

    setUpdating(numeroPedido);
    try {
      await changeOrderStatus(numeroPedido, {
        nuevoEstado: newStatus,
        descripcion: `Estado actualizado desde panel admin a ${newStatus}`,
      });
      await loadOrders();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el estado del pedido.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Cargando pedidos...</h2>
          <p className="text-gray-600">Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-gray-800 font-medium">Panel de Administración</span>
          </div>

          <button
            onClick={loadOrders}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {/* Tabla de pedidos */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
            <p className="text-gray-600 mt-1">
              Administra el estado de los pedidos reales guardados en tu backend.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay pedidos</h3>
              <p className="text-gray-600 mb-4">Aún no se han registrado pedidos en el sistema.</p>
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
                  {orders.map((order) => (
                    <tr key={order.numeroPedido} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.numeroPedido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items.length} producto
                            {order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.cliente.nombre}
                          </div>
                          <div className="text-sm text-gray-500">{order.cliente.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.estado
                          )}`}
                        >
                          {getStatusIcon(order.estado)}
                          <span className="ml-1">{getStatusText(order.estado)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPriceWithSymbol(order.total.toFixed(2))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.fecha).toLocaleString('es-PE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          {/* Ver tracking SOLO si el estado NO es RECIBIDO */}
                          {order.estado === 'RECIBIDO' ? (
                            <button
                              className="flex items-center space-x-1 text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              <Eye className="h-4 w-4" />
                              <span>Pendiente de pago</span>
                            </button>
                          ) : (
                            <Link
                              to={`/tracking/${order.numeroPedido}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Ver</span>
                            </Link>
                          )}

                          {/* Cambiar estado */}
                          <div className="flex items-center space-x-2">
                            <select
                              value={selectedStatus[order.numeroPedido] || order.estado}
                              onChange={(e) =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [order.numeroPedido]: e.target.value as OrderStatus,
                                }))
                              }
                              className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                            >
                              {statusOptions.map((st) => (
                                <option key={st} value={st}>
                                  {getStatusText(st)}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleChangeStatus(order.numeroPedido)}
                              disabled={updating === order.numeroPedido}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-white ${
                                updating === order.numeroPedido
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-600 hover:bg-green-700'
                              }`}
                            >
                              {updating === order.numeroPedido ? 'Guardando...' : 'Actualizar'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Nota */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Panel de Administración - ElectroCYB
          </h3>
          <p className="text-sm text-blue-700">
            Desde aquí puedes revisar todos los pedidos que llegan desde el Checkout, ver sus datos
            y actualizar el estado (RECIBIDO, ASIGNADO, EN_CAMINO, ENTREGADO). El tracking de cada
            pedido solo se habilita cuando el estado deja de ser{' '}
            <span className="font-semibold">RECIBIDO</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
