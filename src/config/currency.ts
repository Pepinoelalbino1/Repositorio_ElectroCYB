// Configuración de moneda
export const currencyConfig = {
  symbol: 'S/', // Símbolo de la moneda (Soles peruanos)
  name: 'Soles', // Nombre de la moneda
  code: 'PEN', // Código ISO de la moneda
  locale: 'es-PE', // Locale para formateo
};

// Función para formatear precios
export const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat(currencyConfig.locale, {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

// Función para obtener solo el símbolo con el precio
export const formatPriceWithSymbol = (price: string | number): string => {
  return `${currencyConfig.symbol}${price}`;
};
