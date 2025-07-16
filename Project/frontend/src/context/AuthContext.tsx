import React, { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authAPI } from '../api/authAPI';
import chalk from 'chalk';
import axios from 'axios';
import { AuthContext } from './AuthContextObject';  // ✅ imported from separate file

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState & { error: string | null }, action: AuthAction) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState & { error: string | null } = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('dinedash_token');
    const userData = localStorage.getItem('dinedash_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_USER', payload: { user, token } });
      } catch (error) {
        console.log(chalk.red("Error occurred ", error));
        localStorage.removeItem('dinedash_token');
        localStorage.removeItem('dinedash_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login(credentials);

      localStorage.setItem('dinedash_token', response.token);
      localStorage.setItem('dinedash_user', JSON.stringify(response.user));

      dispatch({ type: 'SET_USER', payload: response });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred' });
      }
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(credentials);

      localStorage.setItem('dinedash_token', response.token);
      localStorage.setItem('dinedash_user', JSON.stringify(response.user));

      dispatch({ type: 'SET_USER', payload: response });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred' });
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('dinedash_token');
    localStorage.removeItem('dinedash_user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
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
