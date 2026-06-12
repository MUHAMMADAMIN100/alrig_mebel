export const formatPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(num)
}
