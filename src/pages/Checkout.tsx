import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Package, Store, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPriceWithSymbol } from '../config/currency';
import YapeModal from '../components/YapeModal';

const Checkout: React.FC = () => {
  const { state, getTotalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'transferencia' | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'tienda' | null>(null);
  const [showYapeModal, setShowYapeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    distrito: '',
    referencia: '',
    comentarios: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

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

    // Validar campos de entrega solo si se selecciona entrega a domicilio
    if (deliveryMethod === 'domicilio') {
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es requerida';
      }

      if (!formData.distrito.trim()) {
        newErrors.distrito = 'El distrito es requerido';
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

  const handlePaymentMethodSelect = (method: 'yape' | 'transferencia') => {
    setPaymentMethod(method);
    if (errors.paymentMethod) {
      setErrors(prev => ({
        ...prev,
        paymentMethod: ''
      }));
    }
  };

  const handleDeliveryMethodSelect = (method: 'domicilio' | 'tienda') => {
    setDeliveryMethod(method);
    if (errors.deliveryMethod) {
      setErrors(prev => ({
        ...prev,
        deliveryMethod: ''
      }));
    }
  };

  const handleYapePayment = () => {
    setShowYapeModal(true);
  };

  const handleCompleteOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento de orden
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  const handleTransferenciaPayment = () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento de orden
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 2000);
  };

  if (state.items.length === 0 && !orderComplete) {
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

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Orden Completada!</h2>
            <p className="text-gray-600 mb-6">
              Tu pedido ha sido procesado exitosamente. 
              {deliveryMethod === 'tienda' 
                ? ' Te contactaremos cuando esté listo para recojo en tienda.'
                : ' Te contactaremos pronto para coordinar la entrega a domicilio.'
              }
            </p>
            <div className="space-y-3">
              <Link 
                to="/catalogo"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors block"
              >
                Seguir Comprando
              </Link>
              <Link 
                to="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors block"
              >
                Volver al Inicio
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
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
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

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPriceWithSymbol(getTotalPrice().toString())}
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
                      <h4 className="font-bold text-gray-800">Entrega a Domicilio</h4>
                      <p className="text-sm text-gray-600">Costo adicional según ubicación</p>
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

                <button
                  onClick={() => handlePaymentMethodSelect('transferencia')}
                  className={`w-full p-4 border-2 rounded-lg payment-button ${
                    paymentMethod === 'transferencia'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-800">Transferencia Bancaria</h4>
                      <p className="text-sm text-gray-600">BCP, Interbank, BBVA</p>
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
                    />
                  </div>
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
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
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
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
                    />
                  </div>
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                  )}
                </div>

                {/* Campos de entrega - solo se muestran si se selecciona entrega a domicilio */}
                {deliveryMethod === 'domicilio' && (
                  <>
                    <div>
                      <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="distrito" className="block text-sm font-medium text-gray-700 mb-2">
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

                {/* Información adicional para recojo en tienda */}
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
                          <strong>Dirección:</strong> Lima, Perú<br />
                          <strong>Horarios:</strong> Lunes a Sábado 9:00 AM - 7:00 PM<br />
                          <strong>Contacto:</strong> +51 940 310 317
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Campo de referencia - solo para entrega a domicilio */}
                {deliveryMethod === 'domicilio' && (
                  <div>
                    <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Action Buttons */}
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

              {paymentMethod === 'transferencia' && (
                <button
                  onClick={handleTransferenciaPayment}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-lg font-bold transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
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
          total={getTotalPrice()}
          onPaymentComplete={handleCompleteOrder}
        />
      )}
    </div>
  );
};

export default Checkout;
