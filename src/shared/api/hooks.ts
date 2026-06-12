import { useQuery } from 'react-query'
import {
  getCategories,
  getCategory,
  getProduct,
  getProducts,
  getSubcategories,
  getSubcategory,
} from './catalog'
import { ProductsParams } from './types'

export const useCategories = () =>
  useQuery('categories', getCategories, { staleTime: 60_000 })

export const useCategory = (slug: string | undefined) =>
  useQuery(['category', slug], () => getCategory(slug!), {
    enabled: !!slug,
    staleTime: 60_000,
  })

export const useSubcategories = (category?: string) =>
  useQuery(['subcategories', category ?? 'all'], () => getSubcategories(category), {
    staleTime: 60_000,
  })

export const useSubcategory = (slug: string | undefined) =>
  useQuery(['subcategory', slug], () => getSubcategory(slug!), {
    enabled: !!slug,
    staleTime: 60_000,
  })

export const useProducts = (params?: ProductsParams) =>
  useQuery(['products', params], () => getProducts(params), {
    keepPreviousData: true,
    staleTime: 30_000,
  })

export const useProduct = (slug: string | undefined) =>
  useQuery(['product', slug], () => getProduct(slug!), {
    enabled: !!slug,
    staleTime: 30_000,
  })
