import { axiosInstance } from './axiosInstance'
import {
  ApiCategory,
  ApiOrder,
  ApiProduct,
  ApiProductDetail,
  ApiSubcategory,
  Paginated,
  ProductsParams,
} from './types'

// ─── Публичный каталог ───

export const getCategories = async (): Promise<ApiCategory[]> => {
  const { data } = await axiosInstance.get<ApiCategory[]>('/categories/')
  return data
}

export const getCategory = async (slug: string): Promise<ApiCategory> => {
  const { data } = await axiosInstance.get<ApiCategory>(`/categories/${slug}/`)
  return data
}

export const getSubcategories = async (category?: string): Promise<ApiSubcategory[]> => {
  const { data } = await axiosInstance.get<ApiSubcategory[]>('/subcategories/', {
    params: category ? { category } : undefined,
  })
  return data
}

export const getSubcategory = async (slug: string): Promise<ApiSubcategory> => {
  const { data } = await axiosInstance.get<ApiSubcategory>(`/subcategories/${slug}/`)
  return data
}

export const getProducts = async (params?: ProductsParams): Promise<Paginated<ApiProduct>> => {
  const { data } = await axiosInstance.get<Paginated<ApiProduct>>('/products/', { params })
  return data
}

export const getProduct = async (slug: string): Promise<ApiProductDetail> => {
  const { data } = await axiosInstance.get<ApiProductDetail>(`/products/${slug}/`)
  return data
}

// ─── Заявки ───

export interface CreateOrderPayload {
  name: string
  phone: string
  product?: number | null
  comment?: string
}

export const createOrder = async (payload: CreateOrderPayload): Promise<ApiOrder> => {
  const { data } = await axiosInstance.post<ApiOrder>('/orders/', payload)
  return data
}
