import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para el sistema de tracking
export type OrderStatus = 'recibido' | 'asignado' | 'en_camino' | 'entregado';

export interface OrderItem {
  id: number;
  nombre: string;
  precio: string;
  imagen: string;
  cantidad: number;
}

export interface Order {
  id: string;
  numeroPedido: string;
  fecha: string;
  estado: OrderStatus;
  items: OrderItem[];
  total: number;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion?: string;
    distrito?: string;
    referencia?: string;
  };
  metodoEntrega: 'domicilio' | 'tienda';
  metodoPago: 'yape' | 'transferencia';
  comentarios?: string;
  historialEstados: {
    estado: OrderStatus;
    fecha: string;
    descripcion: string;
  }[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}

type OrderAction =
  | {
      type: 'CREATE_ORDER';
      payload: Omit<Order, 'id' | 'numeroPedido' | 'fecha' | 'estado' | 'historialEstados'>;
    }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; newStatus: OrderStatus } }
  | { type: 'SET_CURRENT_ORDER'; payload: string }
  | { type: 'CLEAR_CURRENT_ORDER' }
  | { type: 'LOAD_ORDERS'; payload: Order[] };

// Estado inicial
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
};

// Reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'CREATE_ORDER': {
      const newOrder: Order = {
        ...action.payload,
        id: `order_${Date.now()}`,
        numeroPedido: `EC-${Date.now().toString().slice(-6)}`,
        fecha: new Date().toISOString(),
        estado: 'recibido',
        historialEstados: [
          {
            estado: 'recibido',
            fecha: new Date().toISOString(),
            descripcion: 'Pedido recibido y confirmado',
          },
        ],
      };

      // Guardar el ID del pedido en localStorage para acceso posterior
      localStorage.setItem('lastOrderId', newOrder.id);

      return {
        ...state,
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
      };
    }

    case 'UPDATE_ORDER_STATUS': {
      const updatedOrders = state.orders.map((order) => {
        if (order.id === action.payload.orderId) {
          const newHistorialEntry = {
            estado: action.payload.newStatus,
            fecha: new Date().toISOString(),
            descripcion: getStatusDescription(action.payload.newStatus),
          };

          return {
            ...order,
            estado: action.payload.newStatus,
            historialEstados: [...order.historialEstados, newHistorialEntry],
          };
        }
        return order;
      });

      const updatedCurrentOrder =
        state.currentOrder?.id === action.payload.orderId
          ? updatedOrders.find((order) => order.id === action.payload.orderId) || null
          : state.currentOrder;

      return {
        ...state,
        orders: updatedOrders,
        currentOrder: updatedCurrentOrder,
      };
    }

    case 'SET_CURRENT_ORDER': {
      const order = state.orders.find((order) => order.id === action.payload);
      return {
        ...state,
        currentOrder: order || null,
      };
    }

    case 'CLEAR_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: null,
      };

    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };

    default:
      return state;
  }
};

// Función para obtener descripción del estado
const getStatusDescription = (status: OrderStatus): string => {
  switch (status) {
    case 'recibido':
      return 'Pedido recibido y confirmado';
    case 'asignado':
      return 'Pedido asignado a movilidad';
    case 'en_camino':
      return 'Pedido en camino a destino';
    case 'entregado':
      return 'Pedido entregado exitosamente';
    default:
      return 'Estado desconocido';
  }
};

// Context
const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  createOrder: (
    orderData: Omit<Order, 'id' | 'numeroPedido' | 'fecha' | 'estado' | 'historialEstados'>
  ) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  setCurrentOrder: (orderId: string) => void;
  clearCurrentOrder: () => void;
  getOrderById: (orderId: string) => Order | undefined;
  simulateOrderProgress: (orderId: string) => void;
} | null>(null);

// Provider
export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const createOrder = (
    orderData: Omit<Order, 'id' | 'numeroPedido' | 'fecha' | 'estado' | 'historialEstados'>
  ) => {
    dispatch({ type: 'CREATE_ORDER', payload: orderData });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, newStatus } });
  };

  const setCurrentOrder = (orderId: string) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: orderId });
  };

  const clearCurrentOrder = () => {
    dispatch({ type: 'CLEAR_CURRENT_ORDER' });
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return state.orders.find((order) => order.id === orderId);
  };

  // Función para simular progreso automático del pedido (para testing)
  const simulateOrderProgress = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return;

    const statusSequence: OrderStatus[] = ['recibido', 'asignado', 'en_camino', 'entregado'];
    const currentIndex = statusSequence.indexOf(order.estado);

    if (currentIndex < statusSequence.length - 1) {
      const nextStatus = statusSequence[currentIndex + 1];

      // Simular tiempo de espera antes del siguiente estado
      setTimeout(() => {
        updateOrderStatus(orderId, nextStatus);

        // Continuar con el siguiente estado si no es el último
        if (nextStatus !== 'entregado') {
          simulateOrderProgress(orderId);
        }
      }, getStatusDelay(nextStatus));
    }
  };

  // Función para obtener el delay entre estados (para simulación)
  const getStatusDelay = (status: OrderStatus): number => {
    switch (status) {
      case 'asignado':
        return 30000; // 30 segundos
      case 'en_camino':
        return 60000; // 1 minuto
      case 'entregado':
        return 90000; // 1.5 minutos
      default:
        return 0;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        state,
        dispatch,
        createOrder,
        updateOrderStatus,
        setCurrentOrder,
        clearCurrentOrder,
        getOrderById,
        simulateOrderProgress,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook personalizado
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe ser usado dentro de un OrderProvider');
  }
  return context;
};
