import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { CheckCircle2, XCircle } from 'lucide-react'
import Layout from "./shared/layout/Layout"
import { MainPage } from "./pages/main-page"
import { ProductsPage } from "./pages/products"
import { CompanyPage } from "./pages/company-page"
import { SubcategoryPage } from "./pages/subcategory"
import { CategoryPage } from "./pages/category"
import { ProductPage } from "./pages/product"
import { LoginPage } from "./admin/pages/login"
import { AdminLayout } from "./admin/AdminLayout"
import { ProtectedRoute } from "./admin/ProtectedRoute"
import { DashboardPage } from "./admin/pages/dashboard"
import { AdminCategoriesPage } from "./admin/pages/categories"
import { AdminSubcategoriesPage } from "./admin/pages/subcategories"
import { AdminProductsPage } from "./admin/pages/products"
import { ProductFormPage } from "./admin/pages/product-form"
import { AdminOrdersPage } from "./admin/pages/orders"
import { useAuthStore } from "./shared/auth/useAuthStore"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const restore = useAuthStore((state) => state.restore)

  // Восстановление сессии из localStorage (вход переживает перезагрузку)
  useEffect(() => {
    restore()
  }, [restore])

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* ── Клиентская часть ── */}
        <Route path="/" element={<Layout />} >
          <Route index element={<MainPage />} />
          <Route path='products' element={<ProductsPage />} />
          <Route path='products/:slug' element={<SubcategoryPage />} />
          <Route path='category/:slug' element={<CategoryPage />} />
          <Route path='product/:slug' element={<ProductPage />} />
          <Route path='custom-order' element={<CompanyPage />} />
        </Route>

        {/* ── Админка (без сайтовых Header/Footer) ── */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path='categories' element={<AdminCategoriesPage />} />
          <Route path='subcategories' element={<AdminSubcategoriesPage />} />
          <Route path='products' element={<AdminProductsPage />} />
          <Route path='products/new' element={<ProductFormPage />} />
          <Route path='products/:slug/edit' element={<ProductFormPage />} />
          <Route path='orders' element={<AdminOrdersPage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontSize: '14px' },
          // иконки тостов из единого набора (lucide), цвета — из design-system
          success: { icon: <CheckCircle2 size={18} strokeWidth={1.75} color="#1B873F" /> },
          error: { icon: <XCircle size={18} strokeWidth={1.75} color="#C8102E" /> },
        }}
      />
      <div id="modal" />
      <div id="modal-root" />
    </QueryClientProvider>
  )
}

export default App
