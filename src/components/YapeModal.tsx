import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, Copy, Clock } from 'lucide-react';
import { formatPriceWithSymbol } from '../config/currency';

interface YapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: () => void; // el padre crea el pedido y guarda en backend
}

type Step = 'qr' | 'confirm';

// Puedes usar la misma base del backend que usas en axiosInstance,
// o dejar fijo localhost si estás en desarrollo.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

// 👉 Ruta completa a tu imagen del QR de Yape
const YAPE_QR_URL = `${API_BASE_URL}/uploads/productos/qryape.jpg`;

const YapeModal: React.FC<YapeModalProps> = ({ isOpen, onClose, total, onPaymentComplete }) => {
  const [step, setStep] = useState<Step>('qr');
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); // 👈 NUEVO

  // Datos de YAPE (reales, excepto el QR que viene del backend como imagen)
  const yapeData = {
    numero: '991194854',
    nombre: 'Electro C & B',
    qrCode: YAPE_QR_URL,
    codigo: 'YAPE-2024-001',
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(yapeData.numero);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleConfirmPayment = () => {
    // El usuario declara que ya pagó
    setStep('confirm');
    // El padre (Checkout) crea el pedido en el backend con estado RECIBIDO
    onPaymentComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Pago con YAPE</h2>
              <p className="text-sm text-gray-600">Escanea el código QR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'qr' && (
            <>
              {/* Amount */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Monto a pagar</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatPriceWithSymbol(total.toString())}
                </p>
              </div>

              {/* QR Code con ZOOM */}
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg qr-container overflow-hidden">
                  <img
                    src={yapeData.qrCode}
                    alt="YAPE QR Code"
                    className="w-48 h-48 mx-auto object-contain"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onClick={() => setIsZoomed((prev) => !prev)} // 👈 En móvil: tap para zoom
                    style={{
                      transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                      transition: 'transform 0.3s ease-in-out',
                      cursor: 'zoom-in',
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Pasa el mouse o toca el QR para verlo más grande.
                </p>
              </div>

              {/* Manual Number */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">O transfiere manualmente a:</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{yapeData.numero}</p>
                    <p className="text-sm text-gray-600">{yapeData.nombre}</p>
                  </div>
                  <button
                    onClick={handleCopyNumber}
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">Instrucciones:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Abre tu app YAPE</li>
                  <li>2. Escanea el código QR o ingresa el número manualmente</li>
                  <li>3. Confirma el monto: {formatPriceWithSymbol(total.toString())}</li>
                  <li>4. Completa la transferencia</li>
                  <li>5. Haz clic en &quot;He realizado el pago&quot;</li>
                </ol>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg payment-button"
              >
                He realizado el pago
              </button>
            </>
          )}

          {step === 'confirm' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">¡Pago registrado!</h3>
                <p className="text-gray-600 mb-4">
                  Hemos registrado tu pago. Un administrador deberá confirmar el depósito antes de
                  iniciar el envío de tu pedido.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Tu pedido está en estado <strong>&quot;RECIBIDO&quot;</strong> y pendiente de
                    confirmación del pago.
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>Código interno de pago: {yapeData.codigo}</p>
                <p>Monto: {formatPriceWithSymbol(total.toString())}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Smartphone className="h-4 w-4" />
            <span>Pago seguro con YAPE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YapeModal;
