import axios from 'axios'

/** Достаёт человекочитаемое сообщение из ошибки DRF. */
export const apiErrorMessage = (error: unknown, fallback = 'Что-то пошло не так'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined
    if (data) {
      if (typeof data.detail === 'string') return data.detail
      // ошибки полей: {name: ["..."], price: ["..."]}
      const first = Object.entries(data)[0]
      if (first) {
        const [field, value] = first
        const msg = Array.isArray(value) ? String(value[0]) : String(value)
        return field === 'non_field_errors' ? msg : `${field}: ${msg}`
      }
    }
    if (error.response?.status === 401) return 'Требуется авторизация'
    if (error.response?.status === 403) return 'Недостаточно прав'
  }
  return fallback
}
