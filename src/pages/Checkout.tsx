import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Store,
  Truck,
  Lock,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPriceWithSymbol } from '../config/currency';
import YapeModal from '../components/YapeModal';
import { createOrder as createOrderApi } from '../api/orders';

const Checkout: React.FC = () => {
  const {
    state,
    getTotalPrice,
    clearCart,
    updateQuantity,
    removeItem,
  } = useCart();
  const { state: authState } = useAuth();

  // ✅ Solo YAPE como método de pago
  const [paymentMethod, setPaymentMethod] = useState<'yape' | null>('yape');
  const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'tienda' | 'envio' | null>(
    null
  );
  const [showYapeModal, setShowYapeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: authState.user?.nombre || '',
    email: authState.user?.email || '',
    telefono: authState.user?.telefono || '',
    direccion: '',
    distrito: '',
    departamento: '',
    referencia: '',
    comentarios: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 🔹 Montos
  const cartSubtotal = getTotalPrice();
  const [shippingCost, setShippingCost] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    // Domicilio: dirección + distrito
    if (deliveryMethod === 'domicilio') {
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }
      if (!formData.distrito.trim()) {
        newErrors.distrito = 'El distrito es requerido';
      }
    }

    // Envío a otros departamentos: dirección + departamento
    if (deliveryMethod === 'envio') {
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }
      if (!formData.departamento.trim()) {
        newErrors.departamento = 'El departamento es requerido';
      }
    }

    if (!deliveryMethod) {
      newErrors.deliveryMethod = 'Debe seleccionar un método de entrega';
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Debe seleccionar un método de pago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodSelect = (method: 'yape') => {
    setPaymentMethod(method);
    if (errors.paymentMethod) {
      setErrors((prev) => ({
        ...prev,
        paymentMethod: '',
      }));
    }
  };

  const handleDeliveryMethodSelect = (method: 'domicilio' | 'tienda' | 'envio') => {
    setDeliveryMethod(method);
    if (errors.deliveryMethod) {
      setErrors((prev) => ({
        ...prev,
        deliveryMethod: '',
      }));
    }
  };

  const handleYapePayment = () => {
    setOrderError(null);
    setShowYapeModal(true);
  };

  // 🔹 Cálculo de envío (Lima por distrito, otros departamentos por departamento)
  const calculateShipping = (
    distrito: string,
    departamento: string,
    method: 'domicilio' | 'tienda' | 'envio' | null
  ): number => {
    // Recojo en tienda: siempre 0
    if (method === 'tienda' || !method) return 0;

    const dist = (distrito || '').toLowerCase().trim();
    const dep = (departamento || '').toLowerCase().trim();

    // 🟢 DOMICILIO: Lima Metropolitana (por distrito)
    if (method === 'domicilio') {
      // ZONA A - Lima Centro (S/ 8)
      if (
        dist.includes('cercado de lima') ||
        dist === 'lima' ||
        dist.includes('breña') ||
        dist.includes('pueblo libre') ||
        dist.includes('jesús maría') ||
        dist.includes('jesus maria') ||
        dist.includes('lince') ||
        dist.includes('la victoria') ||
        dist.includes('san miguel') ||
        dist.includes('magdalena del mar') ||
        dist.includes('magdalena')
      ) {
        return 8;
      }

      // ZONA B - Lima moderna (S/ 10)
      if (
        dist.includes('miraflores') ||
        dist.includes('san isidro') ||
        dist.includes('surquillo') ||
        dist.includes('barranco') ||
        dist.includes('san borja')
      ) {
        return 10;
      }

      // ZONA C - Lima sur / este cercano (S/ 12)
      if (
        dist.includes('santiago de surco') ||
        dist.includes('surco') ||
        dist.includes('chorrillos') ||
        dist.includes('la molina') ||
        dist.includes('san luis') ||
        dist.includes('rímac') ||
        dist.includes('rimac')
      ) {
        return 12;
      }

      // ZONA D - Lima norte / este lejano (S/ 14)
      if (
        dist.includes('san juan de lurigancho') ||
        dist.includes('san juan de miraflores') ||
        dist.includes('villa el salvador') ||
        dist.includes('villa maría del triunfo') ||
        dist.includes('villa maria del triunfo') ||
        dist.includes('comas') ||
        dist.includes('independencia') ||
        dist.includes('los olivos') ||
        dist.includes('san martín de porres') ||
        dist.includes('san martin de porres') ||
        dist.includes('ate') ||
        dist.includes('el agustino') ||
        dist.includes('santa anita') ||
        dist.includes('carabayllo')
      ) {
        return 14;
      }

      // Callao, si alguien lo pone en distrito
      if (
        dist.includes('callao') ||
        dist.includes('bellavista') ||
        dist.includes('la perla') ||
        dist.includes('la punta') ||
        dist.includes('carmen de la legua')
      ) {
        return 15;
      }

      // Default Lima
      return 12;
    }

    // 🔵 ENVÍO A OTROS DEPARTAMENTOS (por departamento)
    if (method === 'envio') {
      if (!dep) return 20; // estimado si no ponen

      // DEPARTAMENTOS COSTA (S/ 20)
      if (
        dep.includes('tumbes') ||
        dep.includes('piura') ||
        dep.includes('lambayeque') ||
        dep.includes('la libertad') ||
        dep.includes('ancash') ||
        dep.includes('ica') ||
        dep.includes('moquegua') ||
        dep.includes('tacna') ||
        dep.includes('arequipa')
      ) {
        return 20;
      }

      // DEPARTAMENTOS SIERRA / SELVA (S/ 24)
      if (
        dep.includes('cajamarca') ||
        dep.includes('amazonas') ||
        dep.includes('san martín') ||
        dep.includes('san martin') ||
        dep.includes('loreto') ||
        dep.includes('huánuco') ||
        dep.includes('huanuco') ||
        dep.includes('pasco') ||
        dep.includes('junín') ||
        dep.includes('junin') ||
        dep.includes('huancavelica') ||
        dep.includes('ayacucho') ||
        dep.includes('cusco') ||
        dep.includes('puno') ||
        dep.includes('apurímac') ||
        dep.includes('apurimac') ||
        dep.includes('madre de dios') ||
        dep.includes('ucayali')
      ) {
        return 24;
      }

      // Default nacional
      return 22;
    }

    return 12;
  };

  // 🔹 Recalcular envío cuando cambie método, distrito o departamento
  useEffect(() => {
    const cost = calculateShipping(formData.distrito, formData.departamento, deliveryMethod);
    setShippingCost(cost);
  }, [formData.distrito, formData.departamento, deliveryMethod]);

  const totalWithShipping = cartSubtotal + shippingCost;

  // 🔹 Manejo de cantidades y eliminación de productos
  const handleIncreaseQuantity = (item: (typeof state.items)[number]) => {
    updateQuantity(item.id, item.cantidad + 1);
  };

  const handleDecreaseQuantity = (item: (typeof state.items)[number]) => {
    if (item.cantidad <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.cantidad - 1);
    }
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  // Construir payload para el backend (alineado con PedidoService)
  const buildOrderPayload = () => {
    const itemsPayload = state.items.map((item) => {
      const numericPrice = parseFloat(item.precio.replace(/[^\d.]/g, '')) || 0;

      return {
        productoId: item.id,
        nombre: item.nombre,
        precio: numericPrice.toFixed(2),
        imagen: item.imagen,
        cantidad: item.cantidad,
      };
    });

    let direccionEnvio = '';

    if (deliveryMethod === 'domicilio') {
      direccionEnvio = `${formData.direccion}${
        formData.distrito ? ', ' + formData.distrito : ''
      }${formData.departamento ? ', ' + formData.departamento : ', Lima'}`;
    } else if (deliveryMethod === 'envio') {
      direccionEnvio = `${formData.direccion}${
        formData.departamento ? ', ' + formData.departamento : ''
      }`;
    } else {
      // tienda
      direccionEnvio = 'Recojo en tienda - Lima';
    }

    return {
      cliente: {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: direccionEnvio,
        referencia: formData.referencia,
      },
      items: itemsPayload,
      total: totalWithShipping,
      metodoPago: paymentMethod!, // solo 'yape'
    };
  };

  // Completar pedido (YapeModal confirma)
  const handleCompleteOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setOrderError(null);

    try {
      const payload = buildOrderPayload();
      const order = await createOrderApi(payload);

      clearCart();
      setShowYapeModal(false);
      setLastOrderNumber(order.numeroPedido);
    } catch (error) {
      console.error('Error al crear pedido con YAPE:', error);
      setOrderError('Hubo un problema al procesar tu pedido. Inténtalo nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0 && !lastOrderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega algunos productos para proceder al pago</p>
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

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Requerido</h2>
            <p className="text-gray-600 mb-6">
              Necesitas iniciar sesión para continuar con tu compra. Tu carrito se mantendrá
              guardado.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
              >
                Crear Cuenta
              </Link>
              <Link
                to="/catalogo"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors block"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-gray-800 font-medium">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4">
                {state.items.map((item) => {
                  const imagenSrc = item.imagen.startsWith('http')
                    ? item.imagen
                    : `http://localhost:8080${item.imagen}`;

                  const unit = parseFloat(item.precio.replace(/[^\d.]/g, '')) || 0;
                  const totalItem = unit * item.cantidad;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={imagenSrc}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.nombre}</h4>

                        {/* Controles de cantidad + botón eliminar */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(item)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[24px] text-center text-sm font-medium">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncreaseQuantity(item)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-3 flex items-center text-xs text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Quitar
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {formatPriceWithSymbol(unit.toFixed(2))}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: {formatPriceWithSymbol(totalItem.toFixed(2))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desglose: subtotal + envío + total estimado */}
              <div className="border-t border-gray-200 pt-4 mt-6 space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="text-gray-900 font-medium">
                    {formatPriceWithSymbol(cartSubtotal.toFixed(2))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Envío (estimado):</span>
                  <span className="text-gray-900 font-medium">
                    {formatPriceWithSymbol(shippingCost.toFixed(2))}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-gray-800">Total estimado:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPriceWithSymbol(totalWithShipping.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Método de Entrega</h3>

              <div className="space-y-4">
                <button
                  onClick={() => handleDeliveryMethodSelect('tienda')}
                  className={`w-full p-4 border-2 rounded-lg payment-button ${
                    deliveryMethod === 'tienda'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">Recojo en Tienda</h4>
                      <p className="text-sm text-gray-600">Sin costo adicional - Lima, Perú</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDeliveryMethodSelect('domicilio')}
                  className={`w-full p-4 border-2 rounded-lg payment-button ${
                    deliveryMethod === 'domicilio'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">
                        Entrega a Domicilio (Lima Metropolitana)
                      </h4>
                      <p className="text-sm text-gray-600">Costo según distrito</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDeliveryMethodSelect('envio')}
                  className={`w-full p-4 border-2 rounded-lg payment-button ${
                    deliveryMethod === 'envio'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">Envío a otros departamentos</h4>
                      <p className="text-sm text-gray-600">Costo según departamento del Perú</p>
                    </div>
                  </div>
                </button>
              </div>

              {errors.deliveryMethod && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.deliveryMethod}
                </p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Método de Pago</h3>

              <div className="space-y-4">
                <button
                  onClick={() => handlePaymentMethodSelect('yape')}
                  className={`w-full p-4 border-2 rounded-lg payment-button ${
                    paymentMethod === 'yape'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">YAPE</h4>
                      <p className="text-sm text-gray-600">Pago rápido y seguro</p>
                    </div>
                  </div>
                </button>
              </div>

              {errors.paymentMethod && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.paymentMethod}
                </p>
              )}

              {orderError && (
                <p className="mt-3 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {orderError}
                </p>
              )}

              {lastOrderNumber && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  <p className="font-semibold mb-1">¡Tu pedido ha sido registrado!</p>
                  <p>
                    Código de pedido: <span className="font-mono font-bold">{lastOrderNumber}</span>
                  </p>
                  <p className="mt-1">
                    Tu pago será revisado por un administrador. Cuando el pedido sea confirmado,
                    podrás ver el seguimiento completo en la página de tracking.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {deliveryMethod === 'tienda' ? 'Información de Contacto' : 'Información de Entrega'}
              </h3>

              <form className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.nombre ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Tu nombre completo"
                      readOnly
                    />
                  </div>
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                      readOnly
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.telefono ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+51 999 999 999"
                      readOnly
                    />
                  </div>
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                  )}
                </div>

                {/* Campos de entrega - DOMICILIO (Lima) */}
                {deliveryMethod === 'domicilio' && (
                  <>
                    <div>
                      <label
                        htmlFor="direccion"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Dirección *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.direccion ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Calle, número, urbanización"
                        />
                      </div>
                      {errors.direccion && (
                        <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="distrito"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Distrito *
                      </label>
                      <input
                        type="text"
                        id="distrito"
                        name="distrito"
                        value={formData.distrito}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.distrito ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Miraflores, San Isidro, etc."
                      />
                      {errors.distrito && (
                        <p className="mt-1 text-sm text-red-600">{errors.distrito}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Campos de entrega - ENVÍO A OTROS DEPARTAMENTOS */}
                {deliveryMethod === 'envio' && (
                  <>
                    <div>
                      <label
                        htmlFor="direccion"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Dirección *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.direccion ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Calle, número, referencia local"
                        />
                      </div>
                      {errors.direccion && (
                        <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="departamento"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Departamento *
                      </label>
                      <input
                        type="text"
                        id="departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.departamento ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Piura, Cusco, Arequipa, etc."
                      />
                      {errors.departamento && (
                        <p className="mt-1 text-sm text-red-600">{errors.departamento}</p>
                      )}
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-800">
                      Envíos a nivel nacional. Los tiempos y costos pueden variar según el
                      departamento.
                    </div>
                  </>
                )}

                {/* Info recojo tienda */}
                {deliveryMethod === 'tienda' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Store className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800 mb-1">Recojo en Tienda</h4>
                        <p className="text-sm text-green-700 mb-2">
                          Puedes recoger tu pedido en nuestra tienda ubicada en Lima, Perú.
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Dirección:</strong> Lima, Perú
                          <br />
                          <strong>Horarios:</strong> Lunes a Sábado 9:00 AM - 7:00 PM
                          <br />
                          <strong>Contacto:</strong> +51 940 310 317
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Referencia domicilio/envío */}
                {(deliveryMethod === 'domicilio' || deliveryMethod === 'envio') && (
                  <div>
                    <label
                      htmlFor="referencia"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Referencia (opcional)
                    </label>
                    <input
                      type="text"
                      id="referencia"
                      name="referencia"
                      value={formData.referencia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Cerca del parque, frente al mercado..."
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="comentarios"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Comentarios adicionales (opcional)
                  </label>
                  <textarea
                    id="comentarios"
                    name="comentarios"
                    rows={3}
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </div>
              </form>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              {paymentMethod === 'yape' && (
                <button
                  onClick={handleYapePayment}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-lg font-bold transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isProcessing ? 'Procesando...' : 'Pagar con YAPE'}
                </button>
              )}

              <Link
                to="/catalogo"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center block"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* YAPE Modal */}
      {showYapeModal && (
        <YapeModal
          isOpen={showYapeModal}
          onClose={() => setShowYapeModal(false)}
          total={totalWithShipping}
          onPaymentComplete={handleCompleteOrder}
        />
      )}
    </div>
  );
};

export default Checkout;