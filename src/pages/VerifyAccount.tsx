import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft, LogIn } from 'lucide-react';
import axiosInstance from '../api/axios';

const VerifyAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verificando tu cuenta...');
  const hasRequestedRef = useRef(false); // 👈 evita doble ejecución en StrictMode

  useEffect(() => {
    if (hasRequestedRef.current) return; // si ya hicimos la llamada, no repetir
    hasRequestedRef.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado en el enlace.');
      return;
    }

    const verify = async () => {
      try {
        await axiosInstance.get('/auth/verify', {
          params: { token },
        });

        setStatus('success');
        setMessage('Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.');
      } catch (error: any) {
        console.error('Error verificando cuenta:', error);

        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'No se pudo verificar tu cuenta. El enlace puede haber expirado o ya haber sido usado.';

        setStatus('error');
        setMessage(backendMessage);
      }
    };

    verify();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <div>
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-spin" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Verificando tu cuenta...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Cuenta verificada ✅</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Error al verificar</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>

        <div className="space-y-3">
          {status === 'success' && (
            <button
              onClick={handleGoToLogin}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Ir a iniciar sesión
            </button>
          )}

          <Link
            to="/catalogo"
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;