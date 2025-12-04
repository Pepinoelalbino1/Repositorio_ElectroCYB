import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axiosInstance from '../api/axios';

// Tipos
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);
//dd
// Mapeo de user del backend -> frontend
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: String(backendUser.id ?? backendUser.idInterno ?? ''),
    nombre: backendUser.fullName ?? backendUser.nombre ?? '',
    email: backendUser.email ?? '',
    telefono: backendUser.phone ?? backendUser.telefono ?? '',
    role: backendUser.role ?? 'CUSTOMER',
  };
};

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Al cargar la app, intentar recuperar sesión usando el token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const fetchMe = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await axiosInstance.get('/auth/me');
        const mappedUser = mapBackendUserToFrontend(res.data);

        localStorage.setItem('user', JSON.stringify(mappedUser));
        dispatch({ type: 'LOGIN_SUCCESS', payload: mappedUser });
      } catch (error) {
        console.error('Error recuperando sesión:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      const mappedUser = mapBackendUserToFrontend(user);

      // Guardar token y usuario
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));

      dispatch({ type: 'LOGIN_SUCCESS', payload: mappedUser });
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Credenciales incorrectas';
      dispatch({ type: 'LOGIN_FAILURE', payload: msg });
      throw error;
    }
  };

  // 👇 REGISTRO: ya NO loguea ni guarda token. Solo llama al backend.
  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      await axiosInstance.post('/auth/register', userData);
      // Éxito: no guardamos token ni usuario,
      // el componente Register se encarga de mostrar el mensaje de "revisa tu correo".
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Error al registrar usuario';
      dispatch({ type: 'LOGIN_FAILURE', payload: msg });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};