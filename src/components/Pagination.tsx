import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/useProductStore';
import { PAGE_SIZE, useProductsQuery } from '@/api/products';
import { motion, AnimatePresence } from 'motion/react';

export function Pagination() {
  const { currentPage, setPage } = useProductStore();
  const { data } = useProductsQuery();
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (total === 0) return null;

  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, total);

  // Build page numbers: show up to 5 pages around current
  const pages: number[] = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-1 py-3 flex-wrap gap-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${from}-${to}`}
          className="text-sm text-muted-foreground whitespace-nowrap"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          Показано {from}–{to} из {total}
        </motion.span>
      </AnimatePresence>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 transition-transform duration-150 hover:scale-110 active:scale-90"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {pages.map((p) => (
          <div key={p} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full text-sm relative z-10 transition-colors duration-200 ${
                p === currentPage
                  ? 'text-primary-foreground hover:text-primary-foreground'
                  : 'text-foreground'
              }`}
              onClick={() => setPage(p)}
              aria-label={`Страница ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Button>
            {p === currentPage && (
              <motion.div
                layoutId="pagination-active"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </div>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 transition-transform duration-150 hover:scale-110 active:scale-90"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Следующая страница"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
