const ACCESS_KEY = 'alrig_access'
const REFRESH_KEY = 'alrig_refresh'

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)

export const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem(ACCESS_KEY, access)
  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh)
  }
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

/** Событие принудительного выхода (невалидный refresh). */
export const AUTH_LOGOUT_EVENT = 'alrig:auth-logout'

export const emitLogout = () => {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
}
