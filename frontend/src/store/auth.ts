import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api';
import type { User } from '../types';

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      async login(email, password) {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token });
        } finally {
          set({ loading: false });
        }
      },

      async register(email, password, name) {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/register', { email, password, name });
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token });
        } finally {
          set({ loading: false });
        }
      },

      logout() {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      async refresh() {
        if (!get().token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data });
        } catch {
          get().logout();
        }
      },
    }),
    { name: 'auth' },
  ),
);
