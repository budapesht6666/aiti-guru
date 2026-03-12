import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Product } from '@/types/product'
import { getProducts, searchProducts, updateProduct as apiUpdateProduct } from '@/api/products'
import type { ProductPatch } from '@/types/product'
import { useAuthStore } from './useAuthStore'

export interface LocalProduct extends Omit<Product, 'id'> {
  id: string
}

interface ProductState {
  products: Product[]
  localProducts: LocalProduct[]
  isLoading: boolean
  sortBy: string
  order: 'asc' | 'desc'
  currentPage: number
  total: number
  search: string

  fetchProducts: () => Promise<void>
  addProduct: (data: Pick<Product, 'title' | 'price' | 'brand' | 'sku'>) => void
  updateProduct: (id: number | string, patch: ProductPatch) => Promise<void>
  setSort: (sortBy: string, order: 'asc' | 'desc') => void
  setPage: (page: number) => void
  setSearch: (q: string) => void
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      localProducts: [],
      isLoading: false,
      sortBy: 'title',
      order: 'asc',
      currentPage: 1,
      total: 0,
      search: '',

      fetchProducts: async () => {
        const { sortBy, order, currentPage, search } = get()
        const token = useAuthStore.getState().token ?? ''
        set({ isLoading: true })
        try {
          let resp
          if (search.trim()) {
            resp = await searchProducts({ q: search, sortBy, order, page: currentPage }, token)
          } else {
            resp = await getProducts({ sortBy, order, page: currentPage }, token)
          }
          set({ products: resp.products, total: resp.total })
        } finally {
          set({ isLoading: false })
        }
      },

      addProduct: (data) => {
        const newProduct: LocalProduct = {
          id: `local-${Date.now()}`,
          title: data.title,
          price: data.price,
          brand: data.brand,
          sku: data.sku,
          category: '',
          rating: 0,
          thumbnail: '',
          description: '',
          stock: 0,
          availabilityStatus: '',
          discountPercentage: 0,
        }
        set((s) => ({ localProducts: [newProduct, ...s.localProducts] }))
      },

      updateProduct: async (id, patch) => {
        if (typeof id === 'string' && id.startsWith('local-')) {
          set((s) => ({
            localProducts: s.localProducts.map((p) =>
              p.id === id ? { ...p, ...patch } : p,
            ),
          }))
          return
        }
        const token = useAuthStore.getState().token ?? ''
        const updated = await apiUpdateProduct(id as number, patch, token)
        set((s) => ({
          products: s.products.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
        }))
      },

      setSort: (sortBy, order) => {
        set({ sortBy, order, currentPage: 1 })
        get().fetchProducts()
      },

      setPage: (page) => {
        set({ currentPage: page })
        get().fetchProducts()
      },

      setSearch: (q) => {
        set({ search: q, currentPage: 1 })
        get().fetchProducts()
      },
    }),
    { name: 'ProductStore', enabled: import.meta.env.DEV },
  ),
)
