import { axiosInstance } from './axiosInstance'
import {
  ApiCategory,
  ApiOrder,
  ApiProduct,
  ApiProductDetail,
  ApiProductImage,
  ApiSubcategory,
  Paginated,
} from './types'

// ─── Админ-CRUD. Все запросы идут с Bearer-токеном через axiosInstance ───

export interface CategoryPayload {
  name: string
  slug?: string
  order?: number
  is_active?: boolean
  image?: File | null
}

export interface SubcategoryPayload extends CategoryPayload {
  category: number
}

export interface SpecRow {
  label: string
  value: string
}

export interface ProductPayload {
  name: string
  slug?: string
  subtitle?: string
  description?: string
  subcategory: number
  price: string
  old_price?: string | null
  currency?: string
  in_stock?: boolean
  is_active?: boolean
  is_featured?: boolean
  order?: number
  specs?: SpecRow[]
  uploaded_images?: File[]
}

const toFormData = (payload: Record<string, unknown>): FormData => {
  const fd = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (key === 'uploaded_images' && Array.isArray(value)) {
      value.forEach((file) => fd.append('uploaded_images', file as File))
      return
    }
    if (key === 'specs') {
      fd.append('specs', JSON.stringify(value))
      return
    }
    if (value instanceof File) {
      fd.append(key, value)
      return
    }
    fd.append(key, String(value))
  })
  return fd
}

// ── Категории ──

export const adminCreateCategory = async (payload: CategoryPayload): Promise<ApiCategory> => {
  const { data } = await axiosInstance.post<ApiCategory>('/categories/', toFormData({ ...payload }))
  return data
}

export const adminUpdateCategory = async (slug: string, payload: Partial<CategoryPayload>): Promise<ApiCategory> => {
  const { data } = await axiosInstance.patch<ApiCategory>(`/categories/${slug}/`, toFormData({ ...payload }))
  return data
}

export const adminDeleteCategory = async (slug: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${slug}/`)
}

// ── Подкатегории ──

export const adminCreateSubcategory = async (payload: SubcategoryPayload): Promise<ApiSubcategory> => {
  const { data } = await axiosInstance.post<ApiSubcategory>('/subcategories/', toFormData({ ...payload }))
  return data
}

export const adminUpdateSubcategory = async (slug: string, payload: Partial<SubcategoryPayload>): Promise<ApiSubcategory> => {
  const { data } = await axiosInstance.patch<ApiSubcategory>(`/subcategories/${slug}/`, toFormData({ ...payload }))
  return data
}

export const adminDeleteSubcategory = async (slug: string): Promise<void> => {
  await axiosInstance.delete(`/subcategories/${slug}/`)
}

// ── Товары ──

export const adminCreateProduct = async (payload: ProductPayload): Promise<ApiProductDetail> => {
  const { data } = await axiosInstance.post<ApiProductDetail>('/products/', toFormData({ ...payload }))
  return data
}

export const adminUpdateProduct = async (slug: string, payload: Partial<ProductPayload>): Promise<ApiProductDetail> => {
  const { data } = await axiosInstance.patch<ApiProductDetail>(`/products/${slug}/`, toFormData({ ...payload }))
  return data
}

export const adminDeleteProduct = async (slug: string): Promise<void> => {
  await axiosInstance.delete(`/products/${slug}/`)
}

// ── Галерея товара ──

export const adminUploadProductImage = async (
  slug: string,
  file: File,
  options?: { alt?: string; is_main?: boolean },
): Promise<ApiProductImage> => {
  const fd = new FormData()
  fd.append('image', file)
  if (options?.alt) fd.append('alt', options.alt)
  if (options?.is_main) fd.append('is_main', 'true')
  const { data } = await axiosInstance.post<ApiProductImage>(`/products/${slug}/upload_image/`, fd)
  return data
}

export const adminUpdateProductImage = async (
  id: number,
  payload: { is_main?: boolean; order?: number; alt?: string },
): Promise<ApiProductImage> => {
  const { data } = await axiosInstance.patch<ApiProductImage>(`/product-images/${id}/`, payload)
  return data
}

export const adminDeleteProductImage = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/product-images/${id}/`)
}

// ── Заявки ──

export interface OrdersParams {
  page?: number
  page_size?: number
  status?: ApiOrder['status']
  search?: string
}

export const adminGetOrders = async (params?: OrdersParams): Promise<Paginated<ApiOrder>> => {
  const { data } = await axiosInstance.get<Paginated<ApiOrder>>('/orders/', { params })
  return data
}

export const adminUpdateOrder = async (id: number, payload: { status: ApiOrder['status'] }): Promise<ApiOrder> => {
  const { data } = await axiosInstance.patch<ApiOrder>(`/orders/${id}/`, payload)
  return data
}

export const adminDeleteOrder = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/orders/${id}/`)
}

// реэкспорт для удобства админских экранов
export type { ApiCategory, ApiOrder, ApiProduct, ApiProductDetail, ApiProductImage, ApiSubcategory, Paginated }
