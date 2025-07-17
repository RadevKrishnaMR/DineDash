import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authAPI } from '../api/authAPI';
import axios from 'axios';
import { AuthContext } from './AuthContextObject';
import { jwtDecode } from 'jwt-decode';

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
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);

  const logout = useCallback(() => {
  localStorage.removeItem('dinedash_token');
  localStorage.removeItem('dinedash_user');
  dispatch({ type: 'LOGOUT' });
}, []);

const refreshToken = useCallback(async () => {
  if (isRefreshing.current) return;
  isRefreshing.current = true;

  try {
    const res = await fetch('http://localhost:6321/api/refresh-token', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('dinedash_token', data.token);
      const currentUser = localStorage.getItem('dinedash_user');
      if (currentUser) {
        dispatch({
          type: 'SET_USER',
          payload: { user: JSON.parse(currentUser), token: data.token },
        });
      }
    } else {
      throw new Error('Refresh failed');
    }
  } catch (err) {
    console.error('Token refresh failed:', err);
    logout();
  } finally {
    isRefreshing.current = false;
  }
}, [logout]);

useEffect(() => {
  const token = localStorage.getItem('dinedash_token');
  const userData = localStorage.getItem('dinedash_user');

  if (!token || !userData || userData === 'undefined') {
    // Don't log out here; user might be registering or logging in
    return;
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);
    if (!decoded.exp) throw new Error('Token missing exp claim');

    const expiryTime = decoded.exp * 1000;
    const now = Date.now();

    if (expiryTime < now) {
      console.warn('Token expired. Refreshing now...');
      refreshToken();
    } else {
      dispatch({
        type: 'SET_USER',
        payload: { user: JSON.parse(userData), token },
      });

      const timeUntilRefresh = expiryTime - now - 60_000;
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        refreshToken();
      }, Math.max(timeUntilRefresh, 0));
    }
  } catch (err) {
    console.error('JWT decode or user parse failed:', err);
    logout(); // optional fallback
  }

  return () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
  };
}, [refreshToken, logout]);


  const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await authAPI.login(credentials);

    const { token, user } = response.data;

    localStorage.setItem('dinedash_token', token);
    localStorage.setItem('dinedash_user', JSON.stringify(user));

    dispatch({
      type: 'SET_USER',
      payload: { user, token },
    });

    // ✅ This is the fix: Return what you need in Login.tsx
    return { user, token };

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Login failed',
      });
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: 'An unexpected error occurred',
      });
    }
    throw error;
  }
};


  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(credentials);
      console.log(response)

      localStorage.setItem('dinedash_token', response.data.token);
      localStorage.setItem('dinedash_user', JSON.stringify(response.data.user));
      const { user, token } = response.data;
      dispatch({
        type: 'SET_USER',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });


    return {user , token }
    }catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch({
          type: 'SET_ERROR',
          payload: error.response?.data?.message || 'Registration failed',
        });
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: 'An unexpected error occurred',
        });
      }
      throw error;
    }
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
