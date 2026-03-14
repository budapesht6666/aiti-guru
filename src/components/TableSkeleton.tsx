import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  rows?: number;
  isMobile?: boolean;
}

export function TableSkeleton({ rows = 10, isMobile = false }: TableSkeletonProps) {
  return (
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
          <TableRow className="hover:bg-transparent border-b-0">
            <TableHead>
              <div className="flex justify-center">
                <div className="skeleton w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="skeleton w-24 h-4" />
            </TableHead>
            <TableHead>
              <div className="skeleton w-16 h-4" />
            </TableHead>
            <TableHead>
              <div className="skeleton w-16 h-4" />
            </TableHead>
            <TableHead>
              <div className="skeleton w-12 h-4" />
            </TableHead>
            <TableHead>
              <div className="skeleton w-14 h-4" />
            </TableHead>
            <TableHead>
              <div className="w-16" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow
              key={i}
              className="border-b border-border last:border-0 hover:bg-transparent"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <TableCell>
                <div className="flex justify-center">
                  <div className="skeleton w-4 h-4 rounded" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`skeleton ${isMobile ? 'w-9 h-9' : 'w-12 h-12'} rounded-lg shrink-0`}
                  />
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="skeleton h-3.5 w-32" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="skeleton h-3.5 w-20" />
              </TableCell>
              <TableCell>
                <div className="skeleton h-3.5 w-24" />
              </TableCell>
              <TableCell>
                <div className="skeleton h-3.5 w-10" />
              </TableCell>
              <TableCell>
                <div className="skeleton h-3.5 w-14" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <div className="skeleton w-13 h-6.75 rounded-[1rem]" />
                  <div className="skeleton w-8 h-8 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
