import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface AddToCartButtonProps {
  product: {
    id: number;
    nombre: string;
    precio: string;
    imagen: string;
  };
  variant?: 'default' | 'small' | 'icon';
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  className = '',
}) => {
  const { addItem, state } = useCart();

  const isInCart = state.items.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
    });
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        className={`p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors ${className}`}
        title="Agregar al carrito"
      >
        <Plus className="h-4 w-4" />
      </button>
    );
  }

  if (variant === 'small') {
    return (
      <button
        onClick={handleAddToCart}
        className={`flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm ${className}`}
      >
        <ShoppingCart className="h-4 w-4" />
        <span>{isInCart ? 'Agregado' : 'Agregar'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors ${className}`}
    >
      <ShoppingCart className="h-5 w-5" />
      <span>{isInCart ? 'Agregado al Carrito' : 'Agregar al Carrito'}</span>
    </button>
  );
};

export default AddToCartButton;
