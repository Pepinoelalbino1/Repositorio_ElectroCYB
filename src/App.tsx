import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Contacto from './pages/Contacto';
import Checkout from './pages/Checkout';

const AppContent: React.FC = () => {
  const { state, hideToast } = useCart();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<ProductoDetalle />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
        <FloatingButtons />
        <CartDrawer />
        <Toast
          message={state.toast.message}
          type={state.toast.type}
          isVisible={state.toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;