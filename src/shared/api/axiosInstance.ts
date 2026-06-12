import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import {
  clearTokens,
  emitLogout,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../auth/tokens'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
})

// ── Bearer-токен на каждый запрос (если есть) ──
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── 401 → попытка refresh → повтор запроса; невалидный refresh → logout ──
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null
  try {
    const { data } = await axios.post<{ access: string; refresh?: string }>(
      `${import.meta.env.VITE_SERVER_URL}/auth/refresh/`,
      { refresh },
    )
    setTokens(data.access, data.refresh)
    return data.access
  } catch {
    clearTokens()
    emitLogout()
    return null
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const isAuthUrl = original?.url?.includes('/auth/login') || original?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && original && !original._retry && !isAuthUrl && getRefreshToken()) {
      original._retry = true
      refreshPromise = refreshPromise ?? refreshAccessToken()
      const newAccess = await refreshPromise
      refreshPromise = null
      if (newAccess) {
        original.headers.Authorization = `Bearer ${newAccess}`
        return axiosInstance(original)
      }
    }
    return Promise.reject(error)
  },
)
