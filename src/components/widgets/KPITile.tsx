'use client';

import React from 'react';
import { SEVERITY_COLORS, Severity } from '../../types/analytics';

interface KPITileProps {
  label: string;
  value: number | string;
  previousValue?: number;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  suffix?: string;
  prefix?: string;
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  severity?: Severity;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  invertTrendColors?: boolean; // When true, "up" is good, "down" is bad
}

export function KPITile({
  label,
  value,
  previousValue,
  trend,
  trendLabel,
  suffix,
  prefix,
  color = 'default',
  severity,
  size = 'md',
  loading = false,
  onClick,
  className = '',
  invertTrendColors = false,
}: KPITileProps) {
  // Calculate trend if not provided
  const calculatedTrend = trend ?? (
    previousValue !== undefined && typeof value === 'number'
      ? value > previousValue ? 'up' : value < previousValue ? 'down' : 'flat'
      : undefined
  );

  // Calculate change percentage
  const changePercent = previousValue !== undefined && typeof value === 'number' && previousValue !== 0
    ? Math.round(((value - previousValue) / previousValue) * 100)
    : undefined;

  const getTrendColor = () => {
    if (!calculatedTrend) return 'text-gray-500';
    
    if (invertTrendColors) {
      // For metrics where up is good (e.g., safety inspections completed)
      return calculatedTrend === 'up' ? 'text-green-600' : calculatedTrend === 'down' ? 'text-red-600' : 'text-gray-500';
    } else {
      // For safety events, up is bad, down is good
      return calculatedTrend === 'up' ? 'text-red-600' : calculatedTrend === 'down' ? 'text-green-600' : 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    if (!calculatedTrend || calculatedTrend === 'flat') return null;
    
    return calculatedTrend === 'up' ? (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  const getColorClasses = () => {
    if (severity) {
      const severityColor = SEVERITY_COLORS[severity];
      return {
        bg: severityColor.bg,
        text: severityColor.text,
        border: severityColor.border,
      };
    }

    switch (color) {
      case 'success':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'warning':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'danger':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'info':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      default:
        return { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { wrapper: 'p-3', label: 'text-xs', value: 'text-xl' };
      case 'lg':
        return { wrapper: 'p-6', label: 'text-sm', value: 'text-4xl' };
      default:
        return { wrapper: 'p-4', label: 'text-xs', value: 'text-2xl' };
    }
  };

  const colors = getColorClasses();
  const sizes = getSizeClasses();

  if (loading) {
    return (
      <div className={`rounded-lg border ${colors.border} ${colors.bg} ${sizes.wrapper} animate-pulse ${className}`}>
        <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-7 bg-gray-200 rounded w-12" />
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-lg border ${colors.border} ${colors.bg} ${sizes.wrapper}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <p className={`font-medium text-gray-500 uppercase tracking-wider mb-1 ${sizes.label}`}>
        {label}
      </p>
      <div className="flex items-end justify-between gap-2">
        <div className={`font-bold ${colors.text} ${sizes.value}`}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {(calculatedTrend || trendLabel) && (
          <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {changePercent !== undefined && (
              <span>{changePercent > 0 ? '+' : ''}{changePercent}%</span>
            )}
            {trendLabel && (
              <span className="text-gray-400 font-normal ml-1">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Severity-based KPI tiles row
interface SeverityKPIRowProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
  previousCritical?: number;
  previousHigh?: number;
  previousMedium?: number;
  previousLow?: number;
  loading?: boolean;
  onClick?: (severity: Severity) => void;
}

export function SeverityKPIRow({
  critical,
  high,
  medium,
  low,
  previousCritical,
  previousHigh,
  previousMedium,
  previousLow,
  loading = false,
  onClick,
}: SeverityKPIRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KPITile
        label="Critical"
        value={critical}
        previousValue={previousCritical}
        severity="critical"
        loading={loading}
        onClick={onClick ? () => onClick('critical') : undefined}
      />
      <KPITile
        label="High"
        value={high}
        previousValue={previousHigh}
        severity="high"
        loading={loading}
        onClick={onClick ? () => onClick('high') : undefined}
      />
      <KPITile
        label="Medium"
        value={medium}
        previousValue={previousMedium}
        severity="medium"
        loading={loading}
        onClick={onClick ? () => onClick('medium') : undefined}
      />
      <KPITile
        label="Low"
        value={low}
        previousValue={previousLow}
        severity="low"
        loading={loading}
        onClick={onClick ? () => onClick('low') : undefined}
      />
    </div>
  );
}
