# Electro C & B - Tienda de Iluminación LED

## Descripción
Sitio web moderno para Electro C & B, especialistas en iluminación LED. Incluye catálogo de productos, página de contacto con formulario funcional y diseño responsive.

## Características Principales

### **Páginas del Sitio**
- **Inicio**: Hero section, productos destacados, información de contacto
- **Catálogo**: Grid/list view, filtros por categoría, productos con imágenes
- **Detalle de Producto**: Características técnicas, precio, botón WhatsApp
- **Contacto**: Formulario de contacto, información de la empresa

### **Moneda**
- **Soles Peruanos (S/)** configurados en todo el sitio
- Configuración centralizada en `src/config/currency.ts`
- Fácil cambio a otras monedas en el futuro

### **Funcionalidades**
- Formulario de contacto con validación
- Integración con WhatsApp para consultas
- Diseño responsive (mobile-first)
- Navegación intuitiva con React Router

## Instalación y Dependencias

### **Requisitos Previos**
- **Node.js** versión 18.0.0 o superior
- **npm** (incluido con Node.js) o **yarn**

### **Dependencias Principales Instaladas**
```bash
# Dependencias de producción
npm install react react-dom react-router-dom
npm install lucide-react emailjs-com

# Dependencias de desarrollo
npm install -D typescript @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint @eslint/js
```
### **Verificar Instalación Correcta**
```bash
# 1. Verificar que el servidor inicia
npm run dev

# 2. Abrir navegador en http://localhost:5173
# 3. Deberías ver la página de inicio de Electro C & B
# 4. Navegar por las diferentes páginas sin errores

# 5. Verificar que Tailwind CSS funciona
# Los estilos deben verse correctamente aplicados

# 6. Verificar que las imágenes se cargan
# Los productos deben mostrar sus imágenes
```

## Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Header.tsx       # Navegación principal
│   ├── Footer.tsx       # Pie de página
│   └── WhatsAppButton.tsx
├── pages/               # Páginas principales
│   ├── Home.tsx         # Página de inicio
│   ├── Catalogo.tsx     # Catálogo de productos
│   ├── ProductoDetalle.tsx # Detalle de producto
│   └── Contacto.tsx     # Página de contacto
├── config/              # Configuraciones
│   ├── currency.ts      # Configuración de moneda
│   └── emailjs.ts       # Configuración de EmailJS
├── data/                # Datos estáticos
│   └── productos.json   # Catálogo de productos
└── ProductosImagen/     # Imágenes de productos
```

## Configuración del Entorno

### **Variables de Entorno (Opcional)**
Crear archivo `.env.local` en la raíz del proyecto:
```bash
# EmailJS (para formulario de contacto)
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_USER_ID=tu_user_id

# Configuración del sitio
VITE_SITE_NAME=Electro C & B
VITE_SITE_URL=http://localhost:5173
```

## Configuración

### **EmailJS (Formulario de Contacto)**
Para que el formulario envíe emails:

1. Crear cuenta en [EmailJS](https://www.emailjs.com/)
2. Configurar Email Service (Gmail, Outlook, etc.)
3. Crear Email Template con variables: `{{nombre}}`, `{{email}}`, `{{asunto}}`, `{{mensaje}}`
4. Obtener credenciales y actualizar `src/config/emailjs.ts`

```typescript
export const emailjsConfig = {
  serviceId: 'tu_service_id',
  templateId: 'tu_template_id', 
  userId: 'tu_user_id',
};
```

### **Cambiar Moneda**
Editar `src/config/currency.ts`:

```typescript
// Ejemplo: Cambiar a Euros
export const currencyConfig = {
  symbol: '€',
  name: 'Euros',
  code: 'EUR',
  locale: 'es-ES',
};
```

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router DOM
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Email**: EmailJS
- **Build**: Vite

## Responsive Design

- **Mobile**: Navegación hamburger, grid 1 columna
- **Tablet**: Grid 2 columnas, navegación expandida
- **Desktop**: Grid 3 columnas, navegación completa

## Enlaces de Navegación

- **Inicio**: `/`
- **Catálogo**: `/catalogo`
- **Detalle Producto**: `/catalogo/:id`
- **Contacto**: `/contacto`

## Información de Contacto

- **WhatsApp**: +51 940 310 317
- **Email**: Jesusportal3535@gmail.com
- **Ubicación**: Jr.Paruro 1401 Stand 129, Lima, Perú
- **Horarios**: Lunes a Sábado: 9:00 AM - 7:00 PM

## Próximos Pasos Sugeridos

1. **Configurar EmailJS** para formulario funcional
2. **Agregar más productos** al catálogo
3. **Implementar búsqueda** de productos
4. **Agregar carrito de compras**
5. **Integrar pasarela de pagos**

##  Solución de Problemas

### **Problemas de Instalación**
```bash
# Error: "command not found: npm"
# Solución: Instalar Node.js desde https://nodejs.org/

# Error: "permission denied"
# Solución: Usar sudo (Linux/Mac) o ejecutar como administrador (Windows)
sudo npm install

# Error: "port already in use"
# Solución: Cambiar puerto o cerrar procesos
npm run dev -- --port 3000

# Error: "module not found"
# Solución: Limpiar cache e instalar de nuevo
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Formulario no envía emails**
- Verificar credenciales de EmailJS
- Revisar template y variables
- Consultar consola del navegador

### **Problemas de estilo**
- Verificar instalación de Tailwind CSS
- Revisar clases CSS
- Ejecutar: `npx tailwindcss init -p`

### **Errores de TypeScript**
- Verificar versión de TypeScript: `npx tsc --version`
- Limpiar cache: `npx tsc --build --clean`
- Reinstalar tipos: `npm install @types/react @types/react-dom`

### **Problemas de Vite**
- Limpiar cache: `npx vite --force`
- Verificar configuración en `vite.config.ts`
- Reinstalar Vite: `npm install -D vite@latest`



---

**Desarrollado con ❤️ para Electro C & B Osea mi Tienda XD**
