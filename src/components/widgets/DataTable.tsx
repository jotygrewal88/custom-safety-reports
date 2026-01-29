'use client';

import React, { useState, useMemo } from 'react';
import { WidgetCard } from './WidgetCard';
import { SEVERITY_COLORS, Severity, STATUS_COLORS, EventStatus } from '../../types/analytics';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  loading?: boolean;
  className?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  exportable?: boolean;
  onExport?: () => void;
  tooltip?: string;
  showPagination?: boolean;
}

export function DataTable<T extends { id: string }>({
  title,
  subtitle,
  data,
  columns,
  pageSize = 10,
  loading = false,
  className = '',
  onRowClick,
  emptyMessage = 'No data available',
  exportable = false,
  onExport,
  tooltip,
  showPagination = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const headerAction = exportable && onExport ? (
    <button
      onClick={onExport}
      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export
    </button>
  ) : undefined;

  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!data || data.length === 0}
      emptyMessage={emptyMessage}
      className={className}
      tooltip={tooltip}
      noPadding
      headerAction={headerAction}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className={`flex items-center gap-1 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                    {column.header}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((item, rowIndex) => (
              <tr
                key={item.id}
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-4 py-3 text-sm text-gray-900
                      ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}
                    `}
                  >
                    {column.render
                      ? column.render(item, rowIndex)
                      : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}

// Cell renderers for common data types
export function SeverityCell({ severity }: { severity: Severity }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${SEVERITY_COLORS[severity].bg} ${SEVERITY_COLORS[severity].text}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function StatusCell({ status }: { status: EventStatus }) {
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text}`}>
      {status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
    </span>
  );
}

export function DateCell({ date, format = 'short' }: { date: string; format?: 'short' | 'long' | 'relative' }) {
  const dateObj = new Date(date);
  
  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return <span>Today</span>;
    if (diffDays === 1) return <span>Yesterday</span>;
    if (diffDays < 7) return <span>{diffDays} days ago</span>;
    if (diffDays < 30) return <span>{Math.floor(diffDays / 7)} weeks ago</span>;
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  
  return <span>{dateObj.toLocaleDateString('en-US', options)}</span>;
}

export function TrendCell({ value, previousValue }: { value: number; previousValue: number }) {
  const change = value - previousValue;
  const changePercent = previousValue !== 0 ? Math.round((change / previousValue) * 100) : 0;
  const isPositive = change > 0;
  
  return (
    <div className="flex items-center gap-1">
      <span className="font-medium">{value.toLocaleString()}</span>
      <span className={`text-xs flex items-center ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
        {isPositive ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {changePercent > 0 ? '+' : ''}{changePercent}%
      </span>
    </div>
  );
}

export function LinkCell({ text, href, onClick }: { text: string; href?: string; onClick?: () => void }) {
  if (onClick) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        {text}
      </button>
    );
  }
  
  return (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 font-medium"
      onClick={(e) => e.stopPropagation()}
    >
      {text}
    </a>
  );
}
