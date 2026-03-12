import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/store/useProductStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ProductsTable } from '@/components/ProductsTable/ProductsTable'
import { Pagination } from '@/components/Pagination'
import { SearchInput } from '@/components/SearchInput'
import { AddProductSheet } from '@/components/AddProductSheet'
import { EditProductSheet } from '@/components/EditProductSheet'
import type { TableProduct } from '@/components/ProductsTable/columns'

export function ProductsPage() {
  const { fetchProducts } = useProductStore()
  const logout = useAuthStore((s) => s.logout)

  const [addOpen, setAddOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<TableProduct | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <h1 className="text-xl font-bold text-foreground flex-shrink-0">Товары</h1>
          <div className="flex-1 flex justify-center">
            <SearchInput />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={() => setAddOpen(true)} className="gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Добавить</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              aria-label="Выйти"
              title="Выйти"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <ProductsTable onEdit={(p) => setEditProduct(p)} />
        <Pagination />
      </main>

      {/* Sheets */}
      <AddProductSheet open={addOpen} onOpenChange={setAddOpen} />
      <EditProductSheet
        product={editProduct}
        onOpenChange={(open) => { if (!open) setEditProduct(null) }}
      />
    </div>
  )
}
