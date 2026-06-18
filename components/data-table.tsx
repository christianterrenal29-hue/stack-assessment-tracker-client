'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  key?: keyof T | string;
  accessorKey?: keyof T | string;
  label?: string;
  header?: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  rowLink?: (row: T) => string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
}

export function DataTable<T extends { id?: string; _id?: string }>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  onRowClick,
  rowLink,
  emptyMessage = 'No data found',
  loading = false,
  error = '',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getColumnKey = useCallback((col: Column<T>) => col.key ?? col.accessorKey, []);
  const getColumnTitle = (col: Column<T>) => col.label ?? col.header ?? '';
  const getRowId = (row: T, index = 0) => row.id ?? row._id ?? String(index);
  const getValue = useCallback((row: T, key: keyof T | string) => row[key as keyof T], []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (!searchTerm) return true;
      return columns.some((col) => {
        if (!col.searchable) return false;
        const key = getColumnKey(col);
        const value = key ? String(getValue(row, key) ?? '').toLowerCase() : '';
        return value.includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns, getColumnKey, getValue]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = String(a[sortConfig.key] ?? '');
      const bValue = String(b[sortConfig.key] ?? '');

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: keyof T | string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key: key as keyof T,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: key as keyof T, direction: 'asc' };
    });
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(getRowId));
    }
  };

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
      return;
    }

    if (rowLink) {
      window.location.href = rowLink(row);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {columns.some((col) => col.searchable) && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/75 bg-white/85 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      selectedRows.length === paginatedData.length
                    }
                    onChange={toggleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((col) => {
                const key = getColumnKey(col);
                const title = getColumnTitle(col);

                return (
                  <TableHead key={String(key ?? title)} className={col.width}>
                    {col.sortable && key ? (
                      <button
                      onClick={() => handleSort(key)}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {title}
                        {sortConfig?.key === key && (
                          <span>{sortConfig.direction === 'asc' ? 'Asc' : 'Desc'}</span>
                        )}
                      </button>
                    ) : (
                      title
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-6"
                >
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-10 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-10 w-10 text-muted-foreground/70" />
                    <span>{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = getRowId(row, index);

                return (
                  <TableRow
                    key={rowId}
                    onClick={() => handleRowClick(row)}
                    className={onRowClick || rowLink ? 'cursor-pointer hover:bg-accent' : ''}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(rowId)}
                          onChange={() => toggleRowSelection(rowId)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => {
                      const key = getColumnKey(col);
                      const title = getColumnTitle(col);

                      return (
                        <TableCell key={String(key ?? title)}>
                          {col.cell
                            ? col.cell(row)
                            : col.render && key
                              ? col.render(getValue(row, key), row)
                              : key
                                ? String(getValue(row, key) ?? '-')
                                : '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({sortedData.length} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
