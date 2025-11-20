import type { CategoryRevenue } from '../types/dashboard';

interface CategoryRevenueChartProps {
  data: CategoryRevenue[];
}

export function CategoryRevenueChart({ data }: CategoryRevenueChartProps) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Ingresos por Categoría</h3>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = (item.revenue / total) * 100;

          return (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.category}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center gap-6">
        {data.map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
