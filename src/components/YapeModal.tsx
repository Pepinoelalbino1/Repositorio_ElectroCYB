import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, Copy, Clock } from 'lucide-react';
import { formatPriceWithSymbol } from '../config/currency';

interface YapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: () => void;
}

const YapeModal: React.FC<YapeModalProps> = ({ isOpen, onClose, total, onPaymentComplete }) => {
  const [step, setStep] = useState<'qr' | 'confirm'>('qr');
  const [copied, setCopied] = useState(false);

  // Datos de YAPE (simulados)
  const yapeData = {
    numero: '940310317',
    nombre: 'Electro C & B',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPllBUEUgUUE8L3RleHQ+PC9zdmc+',
    codigo: 'YAPE-2024-001'
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
    setStep('confirm');
    // Simular confirmación de pago
    setTimeout(() => {
      onPaymentComplete();
      onClose();
    }, 3000);
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

              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg qr-container">
                  <img
                    src={yapeData.qrCode}
                    alt="YAPE QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Escanea este código con tu app YAPE
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
                  <li>5. Haz clic en "Confirmar Pago"</li>
                </ol>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg payment-button"
              >
                Confirmar Pago
              </button>
            </>
          )}

          {step === 'confirm' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">¡Pago Confirmado!</h3>
                <p className="text-gray-600 mb-4">
                  Tu pago ha sido procesado exitosamente. 
                  Te contactaremos pronto para coordinar la entrega.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Procesando tu orden...</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Código de orden: {yapeData.codigo}</p>
                <p>Monto pagado: {formatPriceWithSymbol(total.toString())}</p>
              </div>
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
