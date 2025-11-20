import type { CostsVsRevenue } from '../types/dashboard';

interface CostsVsRevenueChartProps {
  data: CostsVsRevenue[];
}

export function CostsVsRevenueChart({ data }: CostsVsRevenueChartProps) {
  const maxValue = Math.max(...data.flatMap((d) => [d.revenue, d.costs]));
  const step = Math.ceil(maxValue / 6 / 5000) * 5000;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Relación Costos Operativos vs. Ingresos
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-emerald-500 rounded" />
            <span className="text-xs text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-rose-500 rounded" />
            <span className="text-xs text-gray-600">Costos Operativos</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-500">
          {[6, 5, 4, 3, 2, 1, 0].map((i) => (
            <div key={i} className="flex items-center">
              <span className="w-12">S/ {(i * step / 1000).toFixed(0)}k</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 pl-14 pr-4 flex items-end gap-2">
          {data.map((item, index) => {
            const revenueHeight = (item.revenue / (step * 6)) * 100;
            const costsHeight = (item.costs / (step * 6)) * 100;

            return (
              <div key={item.month} className="flex-1 flex gap-1 items-end h-full">
                <div
                  className="flex-1 bg-emerald-500 rounded-t transition-all duration-500 hover:bg-emerald-600"
                  style={{ height: `${revenueHeight}%` }}
                  title={`Ingresos: S/ ${item.revenue.toLocaleString()}`}
                />
                <div
                  className="flex-1 bg-rose-500 rounded-t transition-all duration-500 hover:bg-rose-600"
                  style={{ height: `${costsHeight}%` }}
                  title={`Costos: S/ ${item.costs.toLocaleString()}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-4 pl-14 pr-4 text-xs text-gray-600">
        {data.map((item) => (
          <span key={item.month} className="flex-1 text-center">{item.month}</span>
        ))}
      </div>
    </div>
  );
}
