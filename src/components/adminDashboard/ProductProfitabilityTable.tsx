import type { ProductProfitability } from '../types/dashboard';

interface ProductProfitabilityTableProps {
  data: ProductProfitability[];
}

export function ProductProfitabilityTable({ data }: ProductProfitabilityTableProps) {
  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'Alta':
        return 'text-green-600';
      case 'Media':
        return 'text-yellow-600';
      case 'Baja':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Rentabilidad por Producto</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Unidades Vendidas
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ingresos Totales
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Margen
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rentabilidad
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((product) => (
              <tr key={product.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.unitsSold.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  S/ {product.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.margin}%
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-semibold ${getProfitabilityColor(
                      product.profitability
                    )}`}
                  >
                    {product.profitability}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
