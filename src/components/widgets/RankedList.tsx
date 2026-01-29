'use client';

import React from 'react';
import { WidgetCard } from './WidgetCard';
import { SEVERITY_COLORS, Severity, STATUS_COLORS, EventStatus } from '../../types/analytics';

interface RankedItem {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  secondaryLabel?: string;
  badge?: {
    text: string;
    color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  };
  severity?: Severity;
  status?: EventStatus;
  trend?: 'up' | 'down' | 'flat';
  metadata?: string;
  icon?: React.ReactNode;
}

interface RankedListProps {
  title: string;
  subtitle?: string;
  items: RankedItem[];
  maxItems?: number;
  showRank?: boolean;
  showBar?: boolean;
  valueLabel?: string;
  secondaryValueLabel?: string;
  loading?: boolean;
  className?: string;
  onItemClick?: (item: RankedItem) => void;
  emptyMessage?: string;
  tooltip?: string;
  headerAction?: React.ReactNode;
}

export function RankedList({
  title,
  subtitle,
  items,
  maxItems = 10,
  showRank = false,
  showBar = true,
  valueLabel,
  secondaryValueLabel,
  loading = false,
  className = '',
  onItemClick,
  emptyMessage = 'No items to display',
  tooltip,
  headerAction,
}: RankedListProps) {
  const displayItems = items.slice(0, maxItems);
  const maxValue = Math.max(...items.map(item => item.value), 1);

  const getTrendIcon = (trend?: 'up' | 'down' | 'flat') => {
    if (!trend || trend === 'flat') return null;
    
    return trend === 'up' ? (
      <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  const getBadgeClasses = (color?: string) => {
    switch (color) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'danger': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityClasses = (severity: Severity) => {
    return `${SEVERITY_COLORS[severity].bg} ${SEVERITY_COLORS[severity].text}`;
  };

  const getStatusClasses = (status: EventStatus) => {
    return `${STATUS_COLORS[status].bg} ${STATUS_COLORS[status].text}`;
  };

  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!displayItems || displayItems.length === 0}
      emptyMessage={emptyMessage}
      className={className}
      tooltip={tooltip}
      noPadding
      headerAction={headerAction}
    >
      <div className="divide-y divide-gray-100">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className={`px-4 py-3 ${onItemClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
          >
            <div className="flex items-center gap-3">
              {/* Rank number */}
              {showRank && (
                <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500 bg-gray-100 rounded-full flex-shrink-0">
                  {index + 1}
                </span>
              )}

              {/* Icon */}
              {item.icon && (
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.label}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Severity badge */}
                    {item.severity && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getSeverityClasses(item.severity)}`}>
                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      </span>
                    )}

                    {/* Status badge */}
                    {item.status && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusClasses(item.status)}`}>
                        {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                      </span>
                    )}

                    {/* Custom badge */}
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getBadgeClasses(item.badge.color)}`}>
                        {item.badge.text}
                      </span>
                    )}

                    {/* Trend indicator */}
                    {getTrendIcon(item.trend)}

                    {/* Primary value */}
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value.toLocaleString()}
                      {valueLabel && (
                        <span className="font-normal text-gray-500 ml-1">{valueLabel}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Metadata line */}
                {(item.metadata || item.secondaryValue !== undefined) && (
                  <div className="flex items-center justify-between mt-0.5">
                    {item.metadata && (
                      <p className="text-xs text-gray-500 truncate">{item.metadata}</p>
                    )}
                    {item.secondaryValue !== undefined && (
                      <span className="text-xs text-gray-500">
                        {item.secondaryValue.toLocaleString()}
                        {secondaryValueLabel && ` ${secondaryValueLabel}`}
                      </span>
                    )}
                  </div>
                )}

                {/* Progress bar */}
                {showBar && (
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.value / maxValue) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all link */}
      {items.length > maxItems && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all {items.length} items
          </button>
        </div>
      )}
    </WidgetCard>
  );
}

// Simplified list for alerts/watchlists
interface AlertListItem {
  id: string;
  title: string;
  subtitle?: string;
  severity: Severity;
  timestamp?: string;
  icon?: React.ReactNode;
}

interface AlertListProps {
  title: string;
  subtitle?: string;
  items: AlertListItem[];
  maxItems?: number;
  loading?: boolean;
  className?: string;
  onItemClick?: (item: AlertListItem) => void;
  emptyMessage?: string;
}

export function AlertList({
  title,
  subtitle,
  items,
  maxItems = 5,
  loading = false,
  className = '',
  onItemClick,
  emptyMessage = 'No alerts',
}: AlertListProps) {
  const displayItems = items.slice(0, maxItems);

  const getSeverityIcon = (severity: Severity) => {
    const baseClasses = 'w-5 h-5';
    switch (severity) {
      case 'critical':
        return (
          <svg className={`${baseClasses} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'high':
        return (
          <svg className={`${baseClasses} text-orange-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className={`${baseClasses} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={`${baseClasses} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!displayItems || displayItems.length === 0}
      emptyMessage={emptyMessage}
      className={className}
      noPadding
    >
      <div className="divide-y divide-gray-100">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className={`px-4 py-3 flex items-start gap-3 ${onItemClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.icon || getSeverityIcon(item.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-xs text-gray-500 truncate mt-0.5">{item.subtitle}</p>
              )}
            </div>
            {item.timestamp && (
              <span className="flex-shrink-0 text-xs text-gray-400">
                {item.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

// CAPA list with due dates
interface CAPAListItem {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: 'overdue' | 'due_soon' | 'on_track';
  priority: Severity;
}

interface CAPAListProps {
  title: string;
  subtitle?: string;
  items: CAPAListItem[];
  maxItems?: number;
  loading?: boolean;
  className?: string;
  onItemClick?: (item: CAPAListItem) => void;
}

export function CAPAList({
  title,
  subtitle,
  items,
  maxItems = 5,
  loading = false,
  className = '',
  onItemClick,
}: CAPAListProps) {
  const displayItems = items.slice(0, maxItems);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-50';
      case 'due_soon': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'overdue': return 'Overdue';
      case 'due_soon': return 'Due Soon';
      default: return 'On Track';
    }
  };

  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!displayItems || displayItems.length === 0}
      emptyMessage="No CAPAs to display"
      className={className}
      noPadding
    >
      <div className="divide-y divide-gray-100">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className={`px-4 py-3 ${onItemClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Assigned to {item.owner} · Due {item.dueDate}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getSeverityClasses(item.priority)}`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > maxItems && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all {items.length} CAPAs
          </button>
        </div>
      )}
    </WidgetCard>
  );
}

function getSeverityClasses(severity: Severity) {
  return `${SEVERITY_COLORS[severity].bg} ${SEVERITY_COLORS[severity].text}`;
}
