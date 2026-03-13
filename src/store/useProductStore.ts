import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Product } from '@/types/product';
import type { ProductPatch } from '@/types/product';

export interface LocalProduct extends Omit<Product, 'id'> {
  id: string;
}

interface ProductState {
  localProducts: LocalProduct[];
  sortBy: string;
  order: 'asc' | 'desc';
  currentPage: number;
  search: string;

  addProduct: (data: Pick<Product, 'title' | 'price' | 'brand' | 'sku'>) => void;
  updateLocalProduct: (id: string, patch: ProductPatch) => void;
  setSort: (sortBy: string, order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setSearch: (q: string) => void;
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      localProducts: [],
      sortBy: 'title',
      order: 'asc',
      currentPage: 1,
      search: '',

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
        };
        set((s) => ({ localProducts: [newProduct, ...s.localProducts] }));
      },

      updateLocalProduct: (id, patch) => {
        set((s) => ({
          localProducts: s.localProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      setSort: (sortBy, order) => {
        set({ sortBy, order, currentPage: 1 });
      },

      setPage: (page) => {
        set({ currentPage: page });
      },

      setSearch: (q) => {
        set({ search: q, currentPage: 1 });
      },
    }),
    { name: 'ProductStore', enabled: import.meta.env.DEV },
  ),
);
