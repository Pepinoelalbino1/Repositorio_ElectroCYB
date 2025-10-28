import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Tipos
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
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
  register: (userData: { nombre: string; email: string; telefono: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay un usuario guardado al cargar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar credenciales (en una app real, esto sería una llamada a la API)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        const userData = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono,
        };

        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Credenciales incorrectas' });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Error al iniciar sesión' });
    }
  };

  const register = async (userData: { nombre: string; email: string; telefono: string; password: string }) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si el email ya existe
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === userData.email);

      if (existingUser) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'El email ya está registrado' });
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      // Guardar usuario en localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Iniciar sesión automáticamente
      const user = {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        telefono: newUser.telefono,
      };

      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Error al registrar usuario' });
    }
  };

  const logout = () => {
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
