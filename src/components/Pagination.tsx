import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/useProductStore';
import { PAGE_SIZE, useProductsQuery } from '@/api/products';

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
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Показано {from}–{to} из {total}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
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
          <Button
            key={p}
            variant={p === currentPage ? 'default' : 'ghost'}
            size="icon"
            className={`w-8 h-8 rounded-full text-sm ${
              p === currentPage ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
            onClick={() => setPage(p)}
            aria-label={`Страница ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
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
