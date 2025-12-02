import type { ProfitMarginData } from '../types/dashboard';

interface ProfitMarginChartProps {
  data: ProfitMarginData[];
}

export function ProfitMarginChart({ data }: ProfitMarginChartProps) {
  const maxMargin = Math.max(...data.map((d) => d.margin));
  const minMargin = Math.min(...data.map((d) => d.margin));
  const range = maxMargin - minMargin;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Margen de Ganancia General</h3>

      <div className="relative h-64">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <span className="w-8">{maxMargin + 5}%</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="flex items-center">
            <span className="w-8">{Math.round((maxMargin + minMargin) / 2)}%</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="flex items-center">
            <span className="w-8">{minMargin - 5}%</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
        </div>

        <div className="absolute inset-0 pl-10 flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="profitGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={data
                .map((point, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = 100 - ((point.margin - (minMargin - 5)) / (maxMargin - minMargin + 10)) * 100;
                  return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                })
                .join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={
                data
                  .map((point, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - ((point.margin - (minMargin - 5)) / (maxMargin - minMargin + 10)) * 100;
                    return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                  })
                  .join(' ') + ' L 100% 100% L 0% 100% Z'
              }
              fill="url(#profitGradient)"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between mt-4 pl-10 text-xs text-gray-600">
        {data.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
    </div>
  );
}
