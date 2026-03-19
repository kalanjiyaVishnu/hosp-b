import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'shared';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (data) => set({ 
        user: data.user, 
        accessToken: data.accessToken, 
        refreshToken: data.refreshToken, 
        isAuthenticated: true 
      }),
      logout: () => set({ 
        user: null, 
        accessToken: null, 
        refreshToken: null, 
        isAuthenticated: false 
      }),
      setAccessToken: (token) => set({ accessToken: token }),
    }),
    { name: 'auth-storage' }
  )
);
