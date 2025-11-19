import axiosInstance from './axios';

export type OrderStatus = 'RECIBIDO' | 'PAGO_VERIFICADO' | 'EN_CAMINO' | 'ENTREGADO';

export interface OrderItemPayload {
  productoId: number;
  nombre: string;
  precio: string; // "35.00"
  imagen: string;
  cantidad: number;
}

export interface ClientePayload {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  referencia: string;
}

export interface CreateOrderPayload {
  cliente: ClientePayload;
  items: OrderItemPayload[];
  metodoPago: string;
  notas?: string;
}

export interface HistorialEstado {
  estado: OrderStatus;
  fecha: string;
  descripcion: string;
}

export interface OrderItem {
  productoId: number;
  nombre: string;
  precio: string;
  imagen: string;
  cantidad: number;
}

export interface Cliente {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  referencia: string;
}

export interface OrderResponse {
  id: number;
  numeroPedido: string;
  fecha: string;
  estado: OrderStatus;
  subtotal: number;
  costoEnvio: number;
  total: number;
  cliente: Cliente;
  items: OrderItem[];
  historialEstados: HistorialEstado[];
}

// 🔹 Crear pedido
export const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  const res = await axiosInstance.post<OrderResponse>('/pedidos', payload);
  return res.data;
};

// 🔹 Obtener por código (tracking)
export const getOrderByNumero = async (numeroPedido: string): Promise<OrderResponse> => {
  const res = await axiosInstance.get<OrderResponse>(`/pedidos/${numeroPedido}`);
  return res.data;
};

// 🔹 NUEVO: listar todos los pedidos (admin)
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const res = await axiosInstance.get<OrderResponse[]>('/pedidos');
  return res.data;
};

// 🔹 NUEVO: cambiar estado de un pedido
export interface ChangeStatusPayload {
  nuevoEstado: OrderStatus;
  descripcion?: string;
}

export const changeOrderStatus = async (
  numeroPedido: string,
  payload: ChangeStatusPayload
): Promise<OrderResponse> => {
  const res = await axiosInstance.patch<OrderResponse>(`/pedidos/${numeroPedido}/estado`, payload);
  return res.data;
};

export const getMyOrders = async (): Promise<OrderResponse[]> => {
  const res = await axiosInstance.get<OrderResponse[]>('/pedidos/mios');
  return res.data;
};
