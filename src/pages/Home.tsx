import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  Truck, 
  Clock, 
  Shield,
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';
import productos from '../data/productos.json';
import { formatPriceWithSymbol } from '../config/currency';

const Home: React.FC = () => {
  const productosDestacados = productos.slice(0, 3);

  const contactarWhatsApp = (producto?: any) => {
    let mensaje = "Hola! Me gustaría obtener más información sobre sus productos.";
    if (producto) {
              mensaje = `Hola! Estoy interesado/a en el producto: ${producto.nombre} - Precio: ${formatPriceWithSymbol(producto.precio)}. ¿Podrían darme más información?`;
    }
    const numeroWhatsApp = "51940310317"; 
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ilumina tu Mundo con 
              <span className="text-blue-400"> Electro C & B</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Especialistas en iluminación LED moderna. Transformamos tus espacios con tecnología de vanguardia y diseños únicos.
            </p>
            <Link 
              to="/catalogo"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Catálogo Completo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                ¿Por qué elegir Electro C & B?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos una empresa especializada en soluciones de iluminación LED de alta calidad. 
                Con más de 10 años de experiencia, ofrecemos productos modernos que combinan 
                eficiencia energética, durabilidad y diseño excepcional.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Productos de calidad premium</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Delivery a toda la ciudad</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Atención personalizada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Garantía en todos los productos</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Iluminación moderna Electro C & B"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre algunos de nuestros productos más populares de iluminación LED.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {productosDestacados.map((producto) => (
              <div key={producto.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatPriceWithSymbol(producto.precio)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                  <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                  <div className="space-y-2">
                    <Link 
                      to={`/catalogo/${producto.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Ver Detalles</span>
                    </Link>
                    <button 
                      onClick={() => contactarWhatsApp(producto)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Consultar por WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/catalogo"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Ver Catálogo Completo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-600">
              Estamos aquí para ayudarte con todas tus necesidades de iluminación.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Teléfono</h3>
                  <p className="text-gray-600">+51 940 310 317</p>
                  <p className="text-sm text-gray-500">Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Email</h3>
                  <p className="text-gray-600">Jesusportal3535@gmail.com</p>
                  <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Ubicación</h3>
                  <p className="text-gray-600">Jr.Paruro 1401 Stand 129</p>
                  <p className="text-gray-600">Lima, Perú</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">¿Listo para comprar?</h3>
                <p className="mb-6">
                  Contáctanos por WhatsApp para consultas, cotizaciones y realizar tus pedidos de forma rápida y segura.
                </p>
                <button 
                  onClick={() => contactarWhatsApp()}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105"
                >
                  Chatear por WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <Truck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-blue-800 mb-2">Información de Envíos</h3>
              <p className="text-blue-700">
                Realizamos entregas a todo el Perú. Los costos de delivery y envíos son adicionales 
                y varían según la ubicación. Consulta por WhatsApp para más información.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;