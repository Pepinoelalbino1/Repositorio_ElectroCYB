export interface KPIData {
  totalSales: number;
  totalTransactions: number;
  averageTicket: number;
  salesChange: number;
  transactionsChange: number;
  ticketChange: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  color: string;
}

export interface ProfitMarginData {
  month: string;
  margin: number;
}

export interface ProductProfitability {
  name: string;
  unitsSold: number;
  totalRevenue: number;
  margin: number;
  profitability: 'Alta' | 'Media' | 'Baja';
}

export interface CostsVsRevenue {
  month: string;
  revenue: number;
  costs: number;
}
