// ─── Типы ответа API каталога ───

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiCategoryMini {
  id: number
  name: string
  slug: string
}

export interface ApiSubcategoryMini {
  id: number
  name: string
  slug: string
  category: ApiCategoryMini
}

export interface ApiSubcategory {
  id: number
  name: string
  slug: string
  image: string | null
  order: number
  is_active: boolean
  category: ApiCategoryMini
  products_count: number
  created_at: string
  updated_at: string
}

export interface ApiCategory {
  id: number
  name: string
  slug: string
  image: string | null
  order: number
  is_active: boolean
  subcategories: ApiSubcategory[]
  products_count: number
  created_at: string
  updated_at: string
}

export interface ApiProductImage {
  id: number
  image: string
  alt: string
  is_main: boolean
  order: number
}

export interface ApiProductSpec {
  id: number
  label: string
  value: string
  order: number
}

export interface ApiProduct {
  id: number
  name: string
  slug: string
  subtitle: string
  price: string
  old_price: string | null
  currency: string
  in_stock: boolean
  is_active: boolean
  is_featured: boolean
  order: number
  subcategory: ApiSubcategoryMini
  category: ApiCategoryMini
  main_image: ApiProductImage | null
  created_at: string
}

export interface ApiProductDetail extends ApiProduct {
  description: string
  images: ApiProductImage[]
  specs: ApiProductSpec[]
  updated_at: string
}

export interface ApiOrder {
  id: number
  name: string
  phone: string
  product: number | null
  product_detail: { id: number; name: string; slug: string; subtitle: string } | null
  comment: string
  status: 'new' | 'in_progress' | 'done' | 'cancelled'
  created: string
}

export interface ApiUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

export interface ProductsParams {
  category?: string
  subcategory?: string
  featured?: boolean
  in_stock?: boolean
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}
