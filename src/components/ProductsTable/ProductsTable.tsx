import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { useProductStore } from '@/store/useProductStore';
import { useProductsQuery } from '@/api/products';
import { getColumns, COLUMN_SORT_MAP, API_TO_COLUMN_MAP, type TableProduct } from './columns';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';

interface ProductsTableProps {
  onEdit: (product: TableProduct) => void;
}

export function ProductsTable({ onEdit }: ProductsTableProps) {
  const { sortBy, order, setSort } = useProductStore();
  const { data, isFetching, isLoading } = useProductsQuery();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const progress = useLoadingProgress(isFetching);

  const apiProducts = data?.products ?? [];
  const tableData: TableProduct[] = useMemo(() => apiProducts, [apiProducts]);

  const columnId = API_TO_COLUMN_MAP[sortBy] ?? sortBy;
  const sorting: SortingState = sortBy ? [{ id: columnId, desc: order === 'desc' }] : [];

  const columns = useMemo(() => getColumns({ onEdit }), [onEdit]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, rowSelection },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      if (next.length > 0) {
        const apiField = COLUMN_SORT_MAP[next[0].id] ?? next[0].id;
        setSort(apiField, next[0].desc ? 'desc' : 'asc');
      } else {
        setSort('title', 'asc');
      }
    },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  if (isLoading && !data) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {progress > 0 && isFetching && (
        <Progress value={progress} className="absolute top-0 left-0 right-0 h-0.5 z-10" />
      )}
      <div className="rounded-xl overflow-hidden bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent border-b-0">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    className={`text-[#b2b3b9] font-bold text-base ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && (
                        <span className="text-xs text-muted-foreground">↑</span>
                      )}
                      {header.column.getIsSorted() === 'desc' && (
                        <span className="text-xs text-muted-foreground">↓</span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 && !isFetching && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-12 text-muted-foreground"
                >
                  Нет данных
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className={`border-b border-border last:border-0 transition-colors ${
                  row.getIsSelected() ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
