import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingCart, Receipt, Loader2, AlertCircle } from 'lucide-react';
import { KPICard } from '../components/adminDashboard/KPICard';
import { CategoryRevenueChart } from '../components/adminDashboard/CategoryRevenueChart';
import { ProfitMarginChart } from '../components/adminDashboard/ProfitMarginChart';
import { ProductProfitabilityTable } from '../components/adminDashboard/ProductProfitabilityTable';
import { CostsVsRevenueChart } from '../components/adminDashboard/CostsVsRevenueChart';
import { getDashboardStats, type DateRange } from '../api/dashboard';
import type {
  KPIData,
  CategoryRevenue,
  ProfitMarginData,
  ProductProfitability,
  CostsVsRevenue,
} from '../types/dashboard';

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('last30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [profitMarginData, setProfitMarginData] = useState<ProfitMarginData[]>([]);
  const [productProfitability, setProductProfitability] = useState<ProductProfitability[]>([]);
  const [costsVsRevenue, setCostsVsRevenue] = useState<CostsVsRevenue[]>([]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getDashboardStats(dateRange);
      setKpiData(stats.kpis);
      setCategoryRevenue(stats.categoryRevenue);
      setProfitMarginData(stats.profitMarginData);
      setProductProfitability(stats.productProfitability);
      setCostsVsRevenue(stats.costsVsRevenue);
    } catch (err: any) {
      console.error('Error cargando datos del dashboard:', err);
      setError(
        err?.response?.data?.message || 'Error al cargar los datos del dashboard. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value as DateRange);
  };

  const getDateRangeLabel = (range: DateRange): string => {
    switch (range) {
      case 'last7days':
        return 'Últimos 7 días';
      case 'last30days':
        return 'Últimos 30 días';
      case 'thisMonth':
        return 'Este mes';
      case 'lastMonth':
        return 'Mes anterior';
      default:
        return 'Últimos 30 días';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar datos</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!kpiData) {
    return null;
  }

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
            <select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="last7days">Últimos 7 días</option>
              <option value="last30days">Últimos 30 días</option>
              <option value="thisMonth">Este mes</option>
              <option value="lastMonth">Mes anterior</option>
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
        {categoryRevenue.length > 0 && <CategoryRevenueChart data={categoryRevenue} />}
        {profitMarginData.length > 0 && <ProfitMarginChart data={profitMarginData} />}
      </div>

      {/* Tabla de rentabilidad */}
      {productProfitability.length > 0 && (
        <div className="mb-8">
          <ProductProfitabilityTable data={productProfitability} />
        </div>
      )}

      {/* Gráfico de costos vs ingresos */}
      {costsVsRevenue.length > 0 && (
        <div className="mb-8">
          <CostsVsRevenueChart data={costsVsRevenue} />
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {kpiData.totalTransactions === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            No hay datos disponibles para el período seleccionado ({getDateRangeLabel(dateRange)}).
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
