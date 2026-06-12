import { create } from 'zustand'
import { axiosInstance } from '../api/axiosInstance'
import { ApiUser } from '../api/types'
import {
  AUTH_LOGOUT_EVENT,
  clearTokens,
  getAccessToken,
  setTokens,
} from './tokens'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous'

interface AuthState {
  user: ApiUser | null
  status: AuthStatus
  login(username: string, password: string): Promise<void>
  logout(): void
  restore(): Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',

  async login(username, password) {
    const { data } = await axiosInstance.post<{ access: string; refresh: string }>(
      '/auth/login/',
      { username, password },
    )
    setTokens(data.access, data.refresh)
    const me = await axiosInstance.get<ApiUser>('/auth/me/')
    set({ user: me.data, status: 'authenticated' })
  },

  logout() {
    clearTokens()
    set({ user: null, status: 'anonymous' })
  },

  // Восстановление сессии из localStorage при старте приложения.
  async restore() {
    if (get().status !== 'idle') return
    if (!getAccessToken()) {
      set({ status: 'anonymous' })
      return
    }
    set({ status: 'loading' })
    try {
      const me = await axiosInstance.get<ApiUser>('/auth/me/')
      set({ user: me.data, status: 'authenticated' })
    } catch {
      clearTokens()
      set({ user: null, status: 'anonymous' })
    }
  },
}))

// Принудительный выход при невалидном refresh-токене (из axios-интерсептора)
if (typeof window !== 'undefined') {
  window.addEventListener(AUTH_LOGOUT_EVENT, () => {
    useAuthStore.setState({ user: null, status: 'anonymous' })
  })
}
