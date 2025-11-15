import { create } from 'zustand';
import type { Usuario } from '../types';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  updateUsuario: (usuario: Usuario) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: (token: string, usuario: Usuario) => {
    localStorage.setItem('token', token);
    set({ token, usuario, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, usuario: null, isAuthenticated: false });
  },
  
  updateUsuario: (usuario: Usuario) => {
    set({ usuario });
  },
}));