import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { useProductStore } from '@/store/useProductStore'
import { getColumns, type TableProduct } from './columns'

interface ProductsTableProps {
  onEdit: (product: TableProduct) => void
}

export function ProductsTable({ onEdit }: ProductsTableProps) {
  const { products, localProducts, isLoading, sortBy, order, setSort } = useProductStore()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const data: TableProduct[] = [
    ...localProducts,
    ...products,
  ]

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: order === 'desc' }]
    : []

  const columns = getColumns({ onEdit })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      if (next.length > 0) {
        setSort(next[0].id, next[0].desc ? 'desc' : 'asc')
      } else {
        setSort('title', 'asc')
      }
    },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  return (
    <div className="relative w-full">
      {isLoading && (
        <Progress value={null} className="absolute top-0 left-0 right-0 h-0.5 z-10" />
      )}
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/30 hover:bg-muted/30">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
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
            {table.getRowModel().rows.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  Нет данных
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className={`border-b border-border last:border-0 transition-colors ${
                  row.getIsSelected()
                    ? 'border-l-4 border-l-primary bg-primary/5'
                    : ''
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
  )
}
