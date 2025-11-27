import { getAllOrders } from './orders';
import { getProductos, type Producto } from './products';
import type { OrderResponse } from './orders';
import type {
  KPIData,
  CategoryRevenue,
  ProfitMarginData,
  ProductProfitability,
  CostsVsRevenue,
} from '../types/dashboard';

export type DateRange = 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth';

interface DashboardStats {
  kpis: KPIData;
  categoryRevenue: CategoryRevenue[];
  profitMarginData: ProfitMarginData[];
  productProfitability: ProductProfitability[];
  costsVsRevenue: CostsVsRevenue[];
}

// Colores para las categorías
const CATEGORY_COLORS: Record<string, string> = {
  'Lámparas': '#3B82F6',
  'Fuentes de Poder': '#10B981',
  'Tiras LED': '#F59E0B',
  'Plafones': '#8B5CF6',
  'Otros': '#EF4444',
};

// Función para obtener el rango de fechas según el filtro
function getDateRange(range: DateRange): { start: Date; end: Date; previousStart: Date; previousEnd: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start: Date;
  let previousStart: Date;
  let previousEnd: Date;

  switch (range) {
    case 'last7days':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);
      previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - 7);
      break;

    case 'last30days':
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);
      previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - 30);
      break;

    case 'thisMonth':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousStart.setHours(0, 0, 0, 0);
      break;

    case 'lastMonth':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      const newEnd = new Date(lastMonthEnd);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);
      previousStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      previousStart.setHours(0, 0, 0, 0);
      return { start, end: newEnd, previousStart, previousEnd };

    default:
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      previousEnd = new Date(start);
      previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);
      previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - 30);
  }

  return { start, end, previousStart, previousEnd };
}

// Filtrar pedidos por fecha
function filterOrdersByDate(orders: OrderResponse[], start: Date, end: Date): OrderResponse[] {
  return orders.filter((order) => {
    const orderDate = new Date(order.fecha);
    return orderDate >= start && orderDate <= end;
  });
}

// Calcular KPIs
function calculateKPIs(
  currentOrders: OrderResponse[],
  previousOrders: OrderResponse[]
): KPIData {
  const currentTotalSales = currentOrders.reduce((sum, order) => sum + order.total, 0);
  const currentTransactions = currentOrders.length;
  const currentAverageTicket = currentTransactions > 0 ? currentTotalSales / currentTransactions : 0;

  const previousTotalSales = previousOrders.reduce((sum, order) => sum + order.total, 0);
  const previousTransactions = previousOrders.length;
  const previousAverageTicket = previousTransactions > 0 ? previousTotalSales / previousTransactions : 0;

  const salesChange =
    previousTotalSales > 0 ? ((currentTotalSales - previousTotalSales) / previousTotalSales) * 100 : 0;
  const transactionsChange =
    previousTransactions > 0 ? ((currentTransactions - previousTransactions) / previousTransactions) * 100 : 0;
  const ticketChange =
    previousAverageTicket > 0 ? ((currentAverageTicket - previousAverageTicket) / previousAverageTicket) * 100 : 0;

  return {
    totalSales: currentTotalSales,
    totalTransactions: currentTransactions,
    averageTicket: currentAverageTicket,
    salesChange: Math.round(salesChange * 10) / 10,
    transactionsChange: Math.round(transactionsChange * 10) / 10,
    ticketChange: Math.round(ticketChange * 10) / 10,
  };
}

// Calcular ingresos por categoría
function calculateCategoryRevenue(
  orders: OrderResponse[],
  productos: Producto[]
): CategoryRevenue[] {
  const categoryMap = new Map<string, number>();
  const productoMap = new Map<number, string>();

  // Crear mapa de productos por ID para obtener categoría
  productos.forEach((prod) => {
    productoMap.set(prod.id, prod.categoria || 'Otros');
  });

  // Sumar ingresos por categoría
  orders.forEach((order) => {
    order.items.forEach((item) => {
      // Si el producto no existe en el catálogo actual, usar la categoría del nombre o 'Otros'
      let categoria = productoMap.get(item.productoId);
      if (!categoria) {
        // Intentar inferir categoría del nombre del producto
        const nombreLower = item.nombre.toLowerCase();
        if (nombreLower.includes('lámpara') || nombreLower.includes('lampara')) {
          categoria = 'Lámparas';
        } else if (nombreLower.includes('fuente') || nombreLower.includes('poder')) {
          categoria = 'Fuentes de Poder';
        } else if (nombreLower.includes('tira') || nombreLower.includes('led')) {
          categoria = 'Tiras LED';
        } else if (nombreLower.includes('plafón') || nombreLower.includes('plafon')) {
          categoria = 'Plafones';
        } else {
          categoria = 'Otros';
        }
      }
      const precio = parseFloat(item.precio) || 0;
      const total = precio * item.cantidad;
      categoryMap.set(categoria, (categoryMap.get(categoria) || 0) + total);
    });
  });

  // Convertir a array y calcular porcentajes
  const totalRevenue = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
  const categoryArray: CategoryRevenue[] = Array.from(categoryMap.entries())    .map(([category, revenue]) => ({
    category,
    revenue: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
    color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Otros'] || '#EF4444',
  }));

  return categoryArray.sort((a, b) => b.revenue - a.revenue);
}

// Calcular margen de ganancia mensual
function calculateProfitMargin(orders: OrderResponse[]): ProfitMarginData[] {
  // Agrupar por mes
  const monthlyData = new Map<string, { revenue: number; cost: number }>();

  orders.forEach((order) => {
    const date = new Date(order.fecha);
    const monthKey = date.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
    const shortMonth = monthKey.split(' ')[0];

    if (!monthlyData.has(shortMonth)) {
      monthlyData.set(shortMonth, { revenue: 0, cost: 0 });
    }

    const data = monthlyData.get(shortMonth)!;
    data.revenue += order.total;

    // Estimar costos: 70% del total (ajusta según tu margen real)
    // Puedes mejorar esto obteniendo costos reales de productos si los tienes
    data.cost += order.total * 0.7;
  });

  // Calcular margen de ganancia por mes
  const profitMargin: ProfitMarginData[] = Array.from(monthlyData.entries())
    .map(([month, data]) => {
      const margin = data.revenue > 0 ? ((data.revenue - data.cost) / data.revenue) * 100 : 0;
      return {
        month,
        margin: Math.round(margin * 10) / 10,
      };
    })
    .sort((a, b) => {
      // Ordenar por fecha
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  return profitMargin.slice(-6); // Últimos 6 meses
}

// Calcular rentabilidad por producto
function calculateProductProfitability(
  orders: OrderResponse[],
  productos: Producto[]
): ProductProfitability[] {
  const productMap = new Map<
    number,
    { name: string; unitsSold: number; totalRevenue: number; categoria: string }
  >();

  // Inicializar productos del catálogo
  productos.forEach((prod) => {
    productMap.set(prod.id, {
      name: prod.nombre,
      unitsSold: 0,
      totalRevenue: 0,
      categoria: prod.categoria || 'Otros',
    });
  });

  // Calcular ventas por producto
  orders.forEach((order) => {
    order.items.forEach((item) => {
      let product = productMap.get(item.productoId);
      // Si el producto no existe en el catálogo actual, crearlo con el nombre del pedido
      if (!product) {
        product = {
          name: item.nombre,
          unitsSold: 0,
          totalRevenue: 0,
          categoria: 'Otros',
        };
        productMap.set(item.productoId, product);
      }
      const precio = parseFloat(item.precio) || 0;
      product.unitsSold += item.cantidad;
      product.totalRevenue += precio * item.cantidad;
    });
  });

  // Convertir a array y calcular margen y rentabilidad
  const profitability: ProductProfitability[] = Array.from(productMap.values())
    .filter((prod) => prod.unitsSold > 0)
    .map((prod) => {
      // Estimar margen: 30% por defecto (ajusta según tus costos reales)
      // Puedes mejorar esto si tienes costos por producto
      const cost = prod.totalRevenue * 0.7;
      const margin = prod.totalRevenue > 0 ? ((prod.totalRevenue - cost) / prod.totalRevenue) * 100 : 0;
      
      let profitabilityLevel: 'Alta' | 'Media' | 'Baja';
      if (margin >= 35) {
        profitabilityLevel = 'Alta';
      } else if (margin >= 20) {
        profitabilityLevel = 'Media';
      } else {
        profitabilityLevel = 'Baja';
      }

      return {
        name: prod.name,
        unitsSold: prod.unitsSold,
        totalRevenue: Math.round(prod.totalRevenue * 100) / 100,
        margin: Math.round(margin * 10) / 10,
        profitability: profitabilityLevel,
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10); // Top 10 productos

  return profitability;
}

// Calcular costos vs ingresos mensuales
function calculateCostsVsRevenue(orders: OrderResponse[]): CostsVsRevenue[] {
  const monthlyData = new Map<string, { revenue: number; costs: number }>();

  orders.forEach((order) => {
    const date = new Date(order.fecha);
    const monthKey = date.toLocaleDateString('es-PE', { month: 'short' });
    const shortMonth = monthKey.split(' ')[0];

    if (!monthlyData.has(shortMonth)) {
      monthlyData.set(shortMonth, { revenue: 0, costs: 0 });
    }

    const data = monthlyData.get(shortMonth)!;
    data.revenue += order.total;
    // Estimar costos: 70% del total (ajusta según tu caso)
    data.costs += order.total * 0.7;
  });

  const costsVsRevenue: CostsVsRevenue[] = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue * 100) / 100,
      costs: Math.round(data.costs * 100) / 100,
    }))
    .sort((a, b) => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  return costsVsRevenue.slice(-6); // Últimos 6 meses
}

// Función principal para obtener estadísticas del dashboard
export async function getDashboardStats(dateRange: DateRange = 'last30days'): Promise<DashboardStats> {
  try {
    // Obtener todos los pedidos y productos
    const [orders, productos] = await Promise.all([getAllOrders(), getProductos()]);

    // Obtener rangos de fechas
    const { start, end, previousStart, previousEnd } = getDateRange(dateRange);

    // Filtrar pedidos
    const currentOrders = filterOrdersByDate(orders, start, end);
    const previousOrders = filterOrdersByDate(orders, previousStart, previousEnd);

    // Calcular todas las métricas
    const kpis = calculateKPIs(currentOrders, previousOrders);
    const categoryRevenue = calculateCategoryRevenue(currentOrders, productos);
    const profitMarginData = calculateProfitMargin(currentOrders);
    const productProfitability = calculateProductProfitability(currentOrders, productos);
    const costsVsRevenue = calculateCostsVsRevenue(currentOrders);

    return {
      kpis,
      categoryRevenue,
      profitMarginData,
      productProfitability,
      costsVsRevenue,
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    throw error;
  }
}
