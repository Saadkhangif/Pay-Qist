import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('jwt_token'),
  isAuthenticated: !!localStorage.getItem('jwt_token'),
  login: (user, token) => {
    localStorage.setItem('jwt_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));