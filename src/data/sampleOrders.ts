import { Order } from '../context/OrderContext';

// Datos de prueba para el sistema de tracking - ElectroCYB (Tienda de Electrónica)
export const sampleOrders: Order[] = [
  {
    id: 'order_sample_1',
    numeroPedido: 'EC-123456',
    fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    estado: 'entregado',
    items: [
      {
        id: 1,
        nombre: 'Lámpara LED Moderna Circular',
        precio: '35.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0091.jpg',
        cantidad: 2,
      },
      {
        id: 7,
        nombre: 'Tira LED RGB Inteligente',
        precio: '75.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0032.jpg',
        cantidad: 1,
      },
      {
        id: 6,
        nombre: 'Foco LED 5W Calido',
        precio: '5.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0030.jpg',
        cantidad: 4,
      },
    ],
    total: 165.0,
    cliente: {
      nombre: 'Juan Pérez García',
      email: 'juan.perez@email.com',
      telefono: '+51 987 654 321',
      direccion: 'Av. Arequipa 1234, Apt 5B',
      distrito: 'Miraflores',
      referencia: 'Frente al parque Kennedy',
    },
    metodoEntrega: 'domicilio',
    metodoPago: 'yape',
    comentarios: 'Entregar después de las 6 PM, llamar antes de llegar',
    historialEstados: [
      {
        estado: 'recibido',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        descripcion: 'Pedido recibido y confirmado',
      },
      {
        estado: 'asignado',
        fecha: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 minutos atrás
        descripcion: 'Pedido asignado a movilidad',
      },
      {
        estado: 'en_camino',
        fecha: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 60 minutos atrás
        descripcion: 'Pedido en camino a destino',
      },
      {
        estado: 'entregado',
        fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
        descripcion: 'Pedido entregado exitosamente',
      },
    ],
  },
  {
    id: 'order_sample_2',
    numeroPedido: 'EC-789012',
    fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
    estado: 'en_camino',
    items: [
      {
        id: 2,
        nombre: 'Fuente de poder 12V 10A',
        precio: '45.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0089.jpg',
        cantidad: 1,
      },
      {
        id: 11,
        nombre: 'Manguera LED RGB',
        precio: '10.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0016.jpg',
        cantidad: 5,
      },
      {
        id: 15,
        nombre: 'Estaño para Soldar',
        precio: '80.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0041.jpg',
        cantidad: 1,
      },
    ],
    total: 175.0,
    cliente: {
      nombre: 'María Rodríguez López',
      email: 'maria.rodriguez@email.com',
      telefono: '+51 912 345 678',
      direccion: 'Jr. Los Olivos 456',
      distrito: 'San Isidro',
      referencia: 'Edificio Torre Azul',
    },
    metodoEntrega: 'domicilio',
    metodoPago: 'transferencia',
    comentarios: 'Proyecto de iluminación para oficina, coordinar entrega',
    historialEstados: [
      {
        estado: 'recibido',
        fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        descripcion: 'Pedido recibido y confirmado',
      },
      {
        estado: 'asignado',
        fecha: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutos atrás
        descripcion: 'Pedido asignado a movilidad',
      },
      {
        estado: 'en_camino',
        fecha: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutos atrás
        descripcion: 'Pedido en camino a destino',
      },
    ],
  },
  {
    id: 'order_sample_3',
    numeroPedido: 'EC-345678',
    fecha: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutos atrás
    estado: 'asignado',
    items: [
      {
        id: 9,
        nombre: 'Kit Solar con Radio y Linterna',
        precio: '90.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0033.jpg',
        cantidad: 1,
      },
      {
        id: 20,
        nombre: 'Foco LED Recargable con Panel Solar',
        precio: '30.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0065.jpg',
        cantidad: 3,
      },
      {
        id: 25,
        nombre: 'Foco LED RGB',
        precio: '10.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0070.jpg',
        cantidad: 2,
      },
    ],
    total: 200.0,
    cliente: {
      nombre: 'Carlos Mendoza Silva',
      email: 'carlos.mendoza@email.com',
      telefono: '+51 945 678 901',
      direccion: 'Av. Javier Prado Este 789',
      distrito: 'La Molina',
      referencia: 'Urbanización Los Portales',
    },
    metodoEntrega: 'domicilio',
    metodoPago: 'yape',
    comentarios: 'Instalación solar para casa de campo',
    historialEstados: [
      {
        estado: 'recibido',
        fecha: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        descripcion: 'Pedido recibido y confirmado',
      },
      {
        estado: 'asignado',
        fecha: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
        descripcion: 'Pedido asignado a movilidad',
      },
    ],
  },
  {
    id: 'order_sample_4',
    numeroPedido: 'EC-901234',
    fecha: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
    estado: 'recibido',
    items: [
      {
        id: 4,
        nombre: 'Detector de Billetes Falsos',
        precio: '50.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0024.jpg',
        cantidad: 1,
      },
      {
        id: 8,
        nombre: 'Lámpara LED Moderna con Sensor de Movimiento',
        precio: '22.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0058.jpg',
        cantidad: 2,
      },
      {
        id: 18,
        nombre: 'Extension de 16 puertos',
        precio: '50.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0060.jpg',
        cantidad: 1,
      },
    ],
    total: 194.0,
    cliente: {
      nombre: 'Ana Torres Vargas',
      email: 'ana.torres@email.com',
      telefono: '+51 978 123 456',
      direccion: 'Calle Las Flores 321',
      distrito: 'Barranco',
      referencia: 'Cerca del malecón',
    },
    metodoEntrega: 'tienda',
    metodoPago: 'transferencia',
    comentarios: 'Equipamiento para negocio, recoger en horario de oficina',
    historialEstados: [
      {
        estado: 'recibido',
        fecha: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        descripcion: 'Pedido recibido y confirmado',
      },
    ],
  },
  {
    id: 'order_sample_5',
    numeroPedido: 'EC-567890',
    fecha: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutos atrás
    estado: 'entregado',
    items: [
      {
        id: 10,
        nombre: 'Cinta LED NEON',
        precio: '20.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0021.jpg',
        cantidad: 3,
      },
      {
        id: 12,
        nombre: 'Manguera LED',
        precio: '7.00',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0017.jpg',
        cantidad: 10,
      },
      {
        id: 16,
        nombre: 'Modulos LED',
        precio: '2.50',
        imagen: '/src/ProductosImagen/IMG-20250806-WA0042.jpg',
        cantidad: 20,
      },
    ],
    total: 150.0,
    cliente: {
      nombre: 'Roberto Sánchez Díaz',
      email: 'roberto.sanchez@email.com',
      telefono: '+51 934 567 890',
      direccion: 'Av. Universitaria 987',
      distrito: 'Comas',
      referencia: 'Cerca del mercado',
    },
    metodoEntrega: 'domicilio',
    metodoPago: 'yape',
    comentarios: 'Material para letrero comercial',
    historialEstados: [
      {
        estado: 'recibido',
        fecha: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        descripcion: 'Pedido recibido y confirmado',
      },
      {
        estado: 'asignado',
        fecha: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        descripcion: 'Pedido asignado a movilidad',
      },
      {
        estado: 'en_camino',
        fecha: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        descripcion: 'Pedido en camino a destino',
      },
      {
        estado: 'entregado',
        fecha: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        descripcion: 'Pedido entregado exitosamente',
      },
    ],
  },
];

// Función para obtener un pedido de prueba por ID
export const getSampleOrderById = (orderId: string): Order | undefined => {
  return sampleOrders.find((order) => order.id === orderId);
};

// Función para obtener todos los pedidos de prueba
export const getAllSampleOrders = (): Order[] => {
  return sampleOrders;
};
