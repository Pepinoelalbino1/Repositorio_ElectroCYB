import type { KPIData, CategoryRevenue, ProfitMarginData, ProductProfitability, CostsVsRevenue } from '../types/dashboard';

export const kpiData: KPIData = {
  totalSales: 45231.89,
  totalTransactions: 1230,
  averageTicket: 36.77,
  salesChange: 12.5,
  transactionsChange: 8.2,
  ticketChange: -1.8,
};

export const categoryRevenue: CategoryRevenue[] = [
  { category: 'Lámparas', revenue: 35, color: '#3B82F6' },
  { category: 'Fuentes de Poder', revenue: 25, color: '#10B981' },
  { category: 'Tiras LED', revenue: 22, color: '#F59E0B' },
  { category: 'Plafones', revenue: 18, color: '#8B5CF6' },
];

export const profitMarginData: ProfitMarginData[] = [
  { month: 'Ene', margin: 28 },
  { month: 'Feb', margin: 32 },
  { month: 'Mar', margin: 30 },
  { month: 'Abr', margin: 25 },
  { month: 'May', margin: 27 },
  { month: 'Jun', margin: 29 },
];

export const productProfitability: ProductProfitability[] = [
  {
    name: 'Lámpara LED Moderna Circular',
    unitsSold: 250,
    totalRevenue: 11250,
    margin: 45,
    profitability: 'Alta',
  },
  {
    name: 'Fuente de poder 12V 10A',
    unitsSold: 180,
    totalRevenue: 9000,
    margin: 30,
    profitability: 'Media',
  },
  {
    name: 'Plafón LED Adosable',
    unitsSold: 310,
    totalRevenue: 6200,
    margin: 22,
    profitability: 'Media',
  },
  {
    name: 'Tira LED 5050 RGB',
    unitsSold: 400,
    totalRevenue: 8000,
    margin: 15,
    profitability: 'Baja',
  },
];

export const costsVsRevenue: CostsVsRevenue[] = [
  { month: 'Ene', revenue: 28000, costs: 18000 },
  { month: 'Feb', revenue: 25000, costs: 16000 },
  { month: 'Mar', revenue: 22000, costs: 15000 },
  { month: 'Abr', revenue: 26000, costs: 17000 },
  { month: 'May', revenue: 30000, costs: 19000 },
  { month: 'Jun', revenue: 27000, costs: 18500 },
];
