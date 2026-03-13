import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

export type TableProduct = Product;

export const COLUMN_SORT_MAP: Record<string, string> = {
  product: 'title',
  brand: 'brand',
  sku: 'sku',
  rating: 'rating',
  price: 'price',
};

export const API_TO_COLUMN_MAP: Record<string, string> = {
  title: 'product',
  brand: 'brand',
  sku: 'sku',
  rating: 'rating',
  price: 'price',
};

interface ColumnOptions {
  onEdit: (product: TableProduct) => void;
}

export function getColumns({ onEdit }: ColumnOptions): ColumnDef<TableProduct>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Выбрать все"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Выбрать строку"
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      id: 'product',
      header: 'Наименование',
      accessorFn: (row) => row.title,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            {p.thumbnail ? (
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-12 h-12 object-cover rounded-lg shrink-0 bg-muted"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-muted shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground truncate">{p.category}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'brand',
      header: 'Вендор',
      accessorFn: (row) => row.brand,
      cell: ({ getValue }) => (
        <span className="font-semibold text-sm">{getValue<string>() ?? '—'}</span>
      ),
    },
    {
      id: 'sku',
      header: 'Артикул',
      accessorFn: (row) => row.sku,
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue<string>() ?? '—'}</span>
      ),
    },
    {
      id: 'rating',
      header: 'Оценка',
      accessorFn: (row) => row.rating,
      cell: ({ getValue }) => {
        const v = getValue<number>();
        const low = v < 3;
        return (
          <span className={`text-sm font-medium ${low ? 'text-destructive' : 'text-foreground'}`}>
            {v > 0 ? `${v.toFixed(1)}/5` : '—'}
          </span>
        );
      },
    },
    {
      id: 'price',
      header: 'Цена, ₽',
      accessorFn: (row) => row.price,
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <span className="text-sm font-medium">
            {v.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="icon"
            className="w-13 h-6.75 rounded-[1rem] bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onEdit(row.original)}
            aria-label="Редактировать"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="w-8 h-8 rounded-full border-border text-muted-foreground hover:text-foreground"
            aria-label="Ещё"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h.01M12 12h.01M19 12h.01"
              />
            </svg>
          </Button>
        </div>
      ),
      enableSorting: false,
      size: 80,
    },
  ];
}
