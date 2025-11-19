import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Tipos
export interface CartItem {
  id: number;
  nombre: string;
  precio: string;
  imagen: string;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  };
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'cantidad'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; cantidad: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' };

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
  toast: {
    message: '',
    type: 'success',
    isVisible: false,
  },
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, cantidad: item.cantidad + 1 } : item
          ),
          toast: {
            message: `${action.payload.nombre} agregado al carrito`,
            type: 'success',
            isVisible: true,
          },
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, cantidad: 1 }],
        toast: {
          message: `${action.payload.nombre} agregado al carrito`,
          type: 'success',
          isVisible: true,
        },
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, cantidad: Math.max(0, action.payload.cantidad) }
              : item
          )
          .filter((item) => item.cantidad > 0),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          message: action.payload.message,
          type: action.payload.type,
          isVisible: true,
        },
      };

    case 'HIDE_TOAST':
      return {
        ...state,
        toast: {
          ...state.toast,
          isVisible: false,
        },
      };

    default:
      return state;
  }
};

// Context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
} | null>(null);

// Provider
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        cartItems.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } else {
      localStorage.removeItem('cart');
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'cantidad'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, cantidad: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, cantidad } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const precio = parseFloat(item.precio.replace(/[^\d.]/g, ''));
      return total + precio * item.cantidad;
    }, 0);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  };

  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getTotalItems,
        getTotalPrice,
        showToast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
