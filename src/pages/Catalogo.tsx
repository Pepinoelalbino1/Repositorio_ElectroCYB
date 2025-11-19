import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Filter, Grid, List } from 'lucide-react';
import { formatPriceWithSymbol } from '../config/currency';
import AddToCartButton from '../components/AddToCartButton';
import { getProductos, Producto } from '../api/products';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const Catalogo: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [vistaGrid, setVistaGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getImageUrl = (img: string) =>
    img.startsWith('http') ? img : `http://localhost:8080${img}`;

  // Cargar productos desde el backend
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los productos. Intenta nuevamente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const categorias = ['Todas', ...Array.from(new Set(productos.map((p) => p.categoria)))];

  const productosFiltrados =
    filtroCategoria === 'Todas'
      ? productos
      : productos.filter((p) => p.categoria === filtroCategoria);

  const contactarWhatsApp = (producto: { nombre: string; precio: string }) => {
    const mensaje = `Hola! Estoy interesado/a en el producto: ${
      producto.nombre
    } - Precio: ${formatPriceWithSymbol(producto.precio)}. ¿Podrían darme más información?`;
    const numeroWhatsApp = '51940310317';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700 font-medium mb-2">Cargando productos...</p>
          <p className="text-sm text-gray-500">Por favor espera un momento.</p>
        </div>
      </div>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-xl text-red-600 font-semibold mb-3">Ocurrió un problema</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Catálogo de Productos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra amplia selección de productos de iluminación LED de alta calidad.
          </p>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVistaGrid(true)}
              className={`p-2 rounded-lg transition-colors ${
                vistaGrid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setVistaGrid(false)}
              className={`p-2 rounded-lg transition-colors ${
                !vistaGrid
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {productosFiltrados.length > 0 ? (
          <div
            className={
              vistaGrid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'
            }
          >
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  !vistaGrid ? 'flex' : ''
                }`}
              >
                <div className={`relative ${!vistaGrid ? 'w-1/3' : ''}`}>
                  <img
                    src={getImageUrl(producto.imagen)}
                    alt={producto.nombre}
                    className={`object-cover ${vistaGrid ? 'w-full h-48' : 'w-full h-full'}`}
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatPriceWithSymbol(producto.precio)}
                  </div>
                </div>

                <div className={`p-6 ${!vistaGrid ? 'flex-1' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{producto.categoria}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                  <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                  <div className="space-y-2">
                    {producto.stock <= 0 ? (
                      <div>
                        <div className="bg-red-100  p-3 rounded-lg flex items-center justify-center mb-6">
                          <span className="text-red-600 font-bold text-lg">Agotado</span>
                        </div>
                        <button className="flex items-center justify-center w-full bg-gray-300 text-gray-500 dark:text-gray-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                          <RemoveShoppingCartIcon/>
                          Agotado
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between mb-6">
                          <span className="dark:text-gray-700 font-medium">Stock disponible:</span>
                          <span className="text-lg font-bold text-gray-900">
                            {producto.stock} unidades
                          </span>
                        </div>
                        <AddToCartButton
                          product={producto}
                          variant="small"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duración-300 flex items-center justify-center space-x-2"
                        />
                      </div>
                    )}

                    <Link
                      to={`/catalogo/${producto.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duración-300 flex items-center justify-center space-x-2"
                    >
                      <span>Ver Características</span>
                    </Link>
                    <button
                      onClick={() => contactarWhatsApp(producto)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duración-300 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Consultar por WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos en esta categoría.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">¿Necesitas ayuda para elegir?</h3>
            <p className="text-blue-700 mb-6">
              Nuestro equipo de expertos está listo para asesorarte y ayudarte a encontrar la
              solución de iluminación perfecta para tu espacio.
            </p>
            <button
              onClick={() => {
                const mensaje =
                  'Hola! Me gustaría recibir asesoría para elegir productos de iluminación.';
                const numeroWhatsApp = '51940310317';
                const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
                window.open(url, '_blank');
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duración-300 transform hover:scale-105"
            >
              Solicitar Asesoría por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
