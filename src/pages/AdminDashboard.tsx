import { DollarSign, ShoppingCart, Receipt } from 'lucide-react';
import { KPICard } from '../components/adminDashboard/KPICard';
import { CategoryRevenueChart } from '../components/adminDashboard/CategoryRevenueChart';
import { ProfitMarginChart } from '../components/adminDashboard/ProfitMarginChart';
import { ProductProfitabilityTable } from '../components/adminDashboard/ProductProfitabilityTable';
import { CostsVsRevenueChart } from '../components/adminDashboard/CostsVsRevenueChart';

// Datos mock por ahora (luego los podemos sacar del backend)
import {
  kpiData,
  categoryRevenue,
  profitMarginData,
  productProfitability,
  costsVsRevenue,
} from '../data/dashboardMockData';

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Encabezado del dashboard */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard de Ventas y Finanzas
            </h1>
            <p className="text-gray-500">
              Bienvenido, aquí tienes un resumen del rendimiento de tu negocio.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm">
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
              <option>Este mes</option>
            </select>
            {/* Aquí podrías poner un botón para exportar/descargar reporte */}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="TOTAL DE VENTAS"
          value={`S/ ${kpiData.totalSales.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
          })}`}
          change={kpiData.salesChange}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <KPICard
          title="Nº DE TRANSACCIONES"
          value={kpiData.totalTransactions.toLocaleString()}
          change={kpiData.transactionsChange}
          icon={<ShoppingCart className="w-6 h-6 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <KPICard
          title="TICKET PROMEDIO"
          value={`S/ ${kpiData.averageTicket.toFixed(2)}`}
          change={kpiData.ticketChange}
          icon={<Receipt className="w-6 h-6 text-fuchsia-600" />}
          iconBgColor="bg-fuchsia-50"
        />
      </div>

      {/* Gráficos superiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategoryRevenueChart data={categoryRevenue} />
        <ProfitMarginChart data={profitMarginData} />
      </div>

      {/* Tabla de rentabilidad */}
      <div className="mb-8">
        <ProductProfitabilityTable data={productProfitability} />
      </div>

      {/* Gráfico de costos vs ingresos */}
      <div className="mb-8">
        <CostsVsRevenueChart data={costsVsRevenue} />
      </div>
    </div>
  );
};

export default AdminDashboard;
