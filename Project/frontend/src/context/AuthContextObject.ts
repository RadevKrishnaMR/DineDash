import { createContext } from 'react';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ user: User; token: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ user: User; token: string }>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
