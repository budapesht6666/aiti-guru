import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { ProductsTable } from '@/components/ProductsTable/ProductsTable';
import { Pagination } from '@/components/Pagination';
import { SearchInput } from '@/components/SearchInput';
import { AddProductSheet } from '@/components/AddProductSheet';
import { EditProductSheet } from '@/components/EditProductSheet';
import type { TableProduct } from '@/components/ProductsTable/columns';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const resetFilters = useProductStore((s) => s.resetFilters);

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<TableProduct | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleEdit = useCallback((p: TableProduct) => setEditProduct(p), []);
  const handleRefetch = () => {
    resetFilters();
    setResetKey((k) => k + 1);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return (
    <div className="min-h-screen lg-bg-neutral">
      {/* Navigation bar */}
      <header className="glass-nav rounded-[10px] mx-4 sm:mx-6 lg:mx-7.5 sticky top-5 z-20">
        <div className="px-7.5 h-26.25 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground shrink-0">Товары</h1>
          <div className="flex-1 flex justify-center">
            <SearchInput />
          </div>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Выйти" title="Выйти">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </Button>
        </div>
      </header>

      {/* Content card */}
      <main className="mx-4 sm:mx-6 lg:mx-7.5 mt-7.5 pb-6">
        <div className="glass-section rounded-xl p-3 sm:p-5 lg:p-7.5 flex flex-col gap-5 lg:gap-10">
          {/* Card header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-[#333]">Все позиции</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-10.5 h-10.5 rounded-lg border-border"
                onClick={handleRefetch}
                aria-label="Обновить"
              >
                <svg
                  className="w-5.5 h-5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </Button>
              <Button
                onClick={() => setAddOpen(true)}
                className="gap-3.75 min-h-10.5 rounded-md bg-[#242edb] hover:bg-[#242edb]/90 px-5"
              >
                <svg
                  className="w-5.5 h-5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m4-4H8" />
                </svg>
                <span className="font-semibold text-sm">Добавить</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <ProductsTable onEdit={handleEdit} resetKey={resetKey} />

          {/* Pagination */}
          <Pagination />
        </div>
      </main>

      {/* Sheets */}
      <AddProductSheet open={addOpen} onOpenChange={setAddOpen} />
      <EditProductSheet
        product={editProduct}
        onOpenChange={(open) => {
          if (!open) setEditProduct(null);
        }}
      />
    </div>
  );
}
