import axiosInstance from './axios';

export interface Producto {
  id: number;
  nombre: string;
  precio: string;
  imagen: string;
  descripcion: string;
  categoria: string;
  stock: number;
  // Mapa de características técnicas (viene de la tabla producto_caracteristicas)
  caracteristicas?: Record<string, string>;
}

export interface SaveProductoPayload {
  nombre: string;
  precio: string;
  imagen: string; // URL devuelta por /api/uploads/productos
  descripcion: string;
  categoria: string;
  stock?: string;
  caracteristicas?: Record<string, string>; // 👈 NUEVO
}

// Obtener todos los productos
export const getProductos = async (): Promise<Producto[]> => {
  const res = await axiosInstance.get<Producto[]>('/productos');
  return res.data;
};

// Obtener detalle por ID
export const getProductoById = async (id: number): Promise<Producto> => {
  const res = await axiosInstance.get<Producto>(`/productos/${id}`);
  return res.data;
};

// (Opcional) productos por categoría si tienes ese endpoint
export const getProductosByCategoria = async (categoria: string): Promise<Producto[]> => {
  const res = await axiosInstance.get<Producto[]>(
    `/productos/categoria/${encodeURIComponent(categoria)}`
  );
  return res.data;
};

// payload básico para crear/editar
export interface SaveProductoPayload {
  nombre: string;
  precio: string;
  imagen: string; // URL devuelta por /api/uploads/productos
  descripcion: string;
  categoria: string;
}

// Crear producto
export const createProducto = async (payload: SaveProductoPayload): Promise<Producto> => {
  const res = await axiosInstance.post<Producto>('/productos', payload);
  return res.data;
};

// Actualizar producto
export const updateProducto = async (
  id: number,
  payload: SaveProductoPayload
): Promise<Producto> => {
  const res = await axiosInstance.put<Producto>(`/productos/${id}`, payload);
  return res.data;
};

// Eliminar producto
export const deleteProducto = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/productos/${id}`);
};

// Subir imagen y devolver URL relativa, tipo "/uploads/productos/xxx.jpg"
export const uploadProductoImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<{ url: string }>('/uploads/productos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.url; // p.ej. "/uploads/productos/led1.jpg"
};
