import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBgColor: string;
}

export function KPICard({ title, value, change, icon, iconBgColor }: KPICardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center gap-1">
            {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
            {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {isPositive ? '+' : ''}{change}% vs. mes anterior
            </span>
          </div>
        </div>
        <div className={`${iconBgColor} rounded-full p-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
