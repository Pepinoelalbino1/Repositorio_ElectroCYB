import React, { useState } from 'react';
import { Package, Download, CheckCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { sampleOrders } from '../data/sampleOrders';

const LoadSampleData: React.FC = () => {
  const { dispatch } = useOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSampleOrders = () => {
    setIsLoading(true);

    // Simular carga de datos
    setTimeout(() => {
      dispatch({ type: 'LOAD_ORDERS', payload: sampleOrders });
      setIsLoading(false);
      setIsLoaded(true);

      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setIsLoaded(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Datos de Prueba</h3>
            <p className="text-sm text-gray-600">
              Carga pedidos de ejemplo para probar el sistema de tracking
            </p>
          </div>
        </div>

        <button
          onClick={loadSampleOrders}
          disabled={isLoading || isLoaded}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isLoading || isLoaded
              ? 'bg-green-100 text-green-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span>Cargando...</span>
            </>
          ) : isLoaded ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>¡Cargado!</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Cargar Datos</span>
            </>
          )}
        </button>
      </div>

      {isLoaded && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ Se han cargado {sampleOrders.length} pedidos de ejemplo de ElectroCYB. Puedes probar
            el tracking con los siguientes IDs:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sampleOrders.map((order) => (
              <span
                key={order.id}
                className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
              >
                {order.id}
              </span>
            ))}
          </div>
          <div className="mt-3 text-xs text-green-600">
            <strong>Productos incluidos:</strong> Lámparas LED, Tiras LED RGB, Focos LED, Fuentes de
            poder, Kit Solar, Detector de billetes, Extensiones, Mangueras LED, etc.
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadSampleData;
