import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Star, Shield, Truck, Clock } from 'lucide-react';
import productos from '../data/productos.json';
import { formatPriceWithSymbol } from '../config/currency';

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const producto = productos.find(p => p.id === parseInt(id || '0'));

  if (!producto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
          <Link 
            to="/catalogo"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const contactarWhatsApp = () => {
    const mensaje = `Hola! Estoy interesado/a en el producto: ${producto.nombre} - Precio: ${formatPriceWithSymbol(producto.precio)}. ¿Podrían darme más información y disponibilidad?`;
    const numeroWhatsApp = "51940310317";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link 
            to="/catalogo"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al Catálogo
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{producto.categoria}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{producto.nombre}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                              {formatPriceWithSymbol(producto.precio)}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {producto.categoria}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
            <p className="text-lg text-gray-600 mb-6">{producto.descripcion}</p>

            {/* Price and Actions */}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-blue-600">{formatPriceWithSymbol(producto.precio)}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <button 
                onClick={contactarWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 mb-4"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Consultar Disponibilidad por WhatsApp</span>
              </button>

              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center">
                  <Shield className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-gray-600">Garantía</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-gray-600">Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-gray-600">Instalación</span>
                </div>
              </div>
            </div>

            {/* Características Técnicas */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Características Técnicas</h3>
              <div className="space-y-3">
                {Object.entries(producto.caracteristicas).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600 capitalize font-medium">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-gray-800 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Garantía Incluida</h4>
            <p className="text-gray-600">
              Todos nuestros productos incluyen garantía del fabricante. 
              Consulta los términos específicos para este producto.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Delivery Disponible</h4>
            <p className="text-gray-600">
              Realizamos entregas a domicilio. Los costos varían según la ubicación. 
              Consulta por WhatsApp para más información.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Instalación</h4>
            <p className="text-gray-600">
              Ofrecemos servicio de instalación profesional. 
              Pregunta por nuestros técnicos especializados.
            </p>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Productos Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productos
              .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
              .slice(0, 3)
              .map((productoRelacionado) => (
                <div key={productoRelacionado.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={productoRelacionado.imagen} 
                      alt={productoRelacionado.nombre}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {formatPriceWithSymbol(productoRelacionado.precio)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{productoRelacionado.nombre}</h4>
                    <p className="text-gray-600 mb-4 text-sm">{productoRelacionado.descripcion}</p>
                    <Link 
                      to={`/catalogo/${productoRelacionado.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;