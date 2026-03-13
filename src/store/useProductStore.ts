import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProductState {
  sortBy: string;
  order: 'asc' | 'desc';
  currentPage: number;
  search: string;

  setSort: (sortBy: string, order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setSearch: (q: string) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      sortBy: 'title',
      order: 'asc',
      currentPage: 1,
      search: '',

      setSort: (sortBy, order) => {
        set({ sortBy, order, currentPage: 1 });
      },

      setPage: (page) => {
        set({ currentPage: page });
      },

      setSearch: (q) => {
        set({ search: q, currentPage: 1 });
      },

      resetFilters: () => {
        set({ sortBy: 'title', order: 'asc', currentPage: 1, search: '' });
      },
    }),
    { name: 'ProductStore', enabled: import.meta.env.DEV },
  ),
);
