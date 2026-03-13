import { memo, useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
  type ColumnPinningState,
  type Row,
  type Column,
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
import { useIsMobile } from '@/hooks/useIsMobile';

const COLUMN_PINNING: ColumnPinningState = {
  left: ['select', 'product'],
  right: [],
};

const DESKTOP_OFFSETS: Record<string, number> = { select: 0, product: 48 };
const MOBILE_OFFSETS: Record<string, number> = { select: 0, product: 32 };

function getPinnedStyle(column: Column<TableProduct, unknown>, offsets: Record<string, number>) {
  const pinned = column.getIsPinned();
  if (!pinned) return undefined;
  return {
    position: 'sticky' as const,
    left: offsets[column.id] ?? 0,
    zIndex: 1,
  };
}

interface ProductsTableProps {
  onEdit: (product: TableProduct) => void;
  resetKey?: number;
}

const ProductRow = memo(
  ({
    row,
    isSelected,
    offsets,
  }: {
    row: Row<TableProduct>;
    isSelected: boolean;
    offsets: Record<string, number>;
  }) => (
    <TableRow
      data-state={isSelected ? 'selected' : undefined}
      className={`border-b border-border last:border-0 ${isSelected ? 'bg-primary/5' : ''}`}
    >
      {row.getVisibleCells().map((cell) => {
        const pinnedStyle = getPinnedStyle(cell.column, offsets);
        const isSelectCol = cell.column.id === 'select';
        return (
          <TableCell
            key={cell.id}
            style={pinnedStyle}
            className={
              [
                `& > span:{background-color:'red'}`,
                pinnedStyle ? (isSelected ? 'bg-muted' : 'bg-background') : undefined,
                isSelectCol ? 'relative overflow-visible' : undefined,
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
          >
            {isSelectCol && (
              <span
                className={`absolute left-0 top-0 h-full w-1 ${isSelected ? 'bg-primary' : 'bg-transparent'}`}
              />
            )}
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  ),
  (prev, next) =>
    prev.isSelected === next.isSelected &&
    prev.row.id === next.row.id &&
    prev.row.original === next.row.original &&
    prev.offsets === next.offsets,
);

export function ProductsTable({ onEdit, resetKey }: ProductsTableProps) {
  const { sortBy, order, setSort } = useProductStore();
  const { data, isFetching, isLoading } = useProductsQuery();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    setRowSelection({});
  }, [resetKey]);
  const progress = useLoadingProgress(isFetching);

  const apiProducts = data?.products ?? [];
  const tableData: TableProduct[] = useMemo(() => apiProducts, [apiProducts]);

  const columnId = API_TO_COLUMN_MAP[sortBy] ?? sortBy;
  const sorting: SortingState = sortBy ? [{ id: columnId, desc: order === 'desc' }] : [];

  const isMobile = useIsMobile(768);
  const offsets = isMobile ? MOBILE_OFFSETS : DESKTOP_OFFSETS;

  const columns = useMemo(() => getColumns({ onEdit }), [onEdit]);

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row) => String(row.id),
    state: { sorting, rowSelection, columnPinning: COLUMN_PINNING },
    onRowSelectionChange: setRowSelection,
    enableColumnPinning: true,
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
        <Table className={isMobile ? 'min-w-185.5' : 'min-w-244.5'}>
          <colgroup>
            <col style={{ width: isMobile ? 32 : 48 }} />
            <col style={{ width: isMobile ? 200 : 300 }} />
            <col style={{ width: isMobile ? 120 : 160 }} />
            <col style={{ width: isMobile ? 140 : 170 }} />
            <col style={{ width: isMobile ? 80 : 100 }} />
            <col style={{ width: isMobile ? 80 : 100 }} />
            <col style={{ width: isMobile ? 90 : 100 }} />
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent border-b-0">
                {hg.headers.map((header) => {
                  const pinnedStyle = getPinnedStyle(header.column, offsets);
                  return (
                    <TableHead
                      key={header.id}
                      style={pinnedStyle ? { ...pinnedStyle, zIndex: 2 } : undefined}
                      className={`text-[#b2b3b9] font-bold text-sm md:text-base ${pinnedStyle ? 'bg-background' : ''} ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        className={`flex items-center gap-1 ${header.column.id === 'select' ? 'justify-center' : ''}`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-xs text-muted-foreground w-3 inline-block text-center">
                            {header.column.getIsSorted() === 'asc'
                              ? '↑'
                              : header.column.getIsSorted() === 'desc'
                                ? '↓'
                                : ''}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
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
              <ProductRow
                key={row.id}
                row={row}
                isSelected={row.getIsSelected()}
                offsets={offsets}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
