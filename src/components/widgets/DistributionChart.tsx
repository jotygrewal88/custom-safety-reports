'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { WidgetCard } from './WidgetCard';
import { SEVERITY_COLORS, Severity } from '../../types/analytics';

// Distribution color palette
const DISTRIBUTION_COLORS = [
  '#2563eb', // blue-600
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
];

const SEVERITY_CHART_COLORS: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

interface DistributionItem {
  name: string;
  value: number;
  color?: string;
}

interface DistributionChartProps {
  title: string;
  subtitle?: string;
  data: DistributionItem[];
  type?: 'donut' | 'pie' | 'horizontal-bar';
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  innerRadius?: number;
  loading?: boolean;
  className?: string;
  tooltip?: string;
  centerLabel?: string;
  centerValue?: string | number;
}

export function DistributionChart({
  title,
  subtitle,
  data,
  type = 'donut',
  height = 300,
  showLegend = true,
  showLabels = false,
  innerRadius = 60,
  loading = false,
  className = '',
  tooltip,
  centerLabel,
  centerValue,
}: DistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, percent }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    // Guard against undefined values
    if (cx === undefined || cy === undefined || midAngle === undefined || 
        ir === undefined || or === undefined || percent === undefined) {
      return null;
    }
    if (!showLabels || percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = ir + (or - ir) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (!active || !payload || !payload.length) return null;
    
    const item = payload[0];
    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-gray-600">
          {item.value.toLocaleString()} ({percentage}%)
        </p>
      </div>
    );
  };

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={type === 'donut' ? innerRadius : 0}
        outerRadius={80}
        paddingAngle={2}
        dataKey="value"
        labelLine={false}
        label={showLabels ? renderCustomLabel : undefined}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.color || DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      {showLegend && (
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-gray-600">{value}</span>
          )}
        />
      )}
    </PieChart>
  );

  const renderBarChart = () => (
    <BarChart
      layout="vertical"
      data={data}
      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
    >
      <XAxis type="number" hide />
      <YAxis
        type="category"
        dataKey="name"
        tick={{ fontSize: 12, fill: '#4b5563' }}
        tickLine={false}
        axisLine={false}
        width={100}
      />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.color || DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]}
          />
        ))}
      </Bar>
    </BarChart>
  );

  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!data || data.length === 0 || total === 0}
      emptyMessage="No distribution data available"
      className={className}
      tooltip={tooltip}
    >
      <div style={{ height }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'horizontal-bar' ? renderBarChart() : renderPieChart()}
        </ResponsiveContainer>
        
        {/* Center label for donut chart */}
        {type === 'donut' && centerValue !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center" style={{ marginTop: showLegend ? '-32px' : 0 }}>
              <p className="text-2xl font-bold text-gray-900">{centerValue}</p>
              {centerLabel && (
                <p className="text-xs text-gray-500">{centerLabel}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}

// Severity distribution chart with predefined colors
interface SeverityDistributionProps {
  title: string;
  subtitle?: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  type?: 'donut' | 'pie' | 'horizontal-bar';
  loading?: boolean;
  className?: string;
}

export function SeverityDistribution({
  title,
  subtitle,
  critical,
  high,
  medium,
  low,
  type = 'donut',
  loading = false,
  className = '',
}: SeverityDistributionProps) {
  const total = critical + high + medium + low;
  
  const data: DistributionItem[] = [
    { name: 'Critical', value: critical, color: SEVERITY_CHART_COLORS.critical },
    { name: 'High', value: high, color: SEVERITY_CHART_COLORS.high },
    { name: 'Medium', value: medium, color: SEVERITY_CHART_COLORS.medium },
    { name: 'Low', value: low, color: SEVERITY_CHART_COLORS.low },
  ].filter(item => item.value > 0);

  return (
    <DistributionChart
      title={title}
      subtitle={subtitle}
      data={data}
      type={type}
      loading={loading}
      className={className}
      centerValue={total}
      centerLabel="Total Events"
    />
  );
}

// Progress bar for single metric (e.g., compliance coverage)
interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: 'default' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  label,
  value,
  max = 100,
  color = 'default',
  showPercentage = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getBarColor = () => {
    switch (color) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-900">{percentage.toFixed(0)}%</span>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${getSizeClasses()}`}>
        <div
          className={`${getBarColor()} ${getSizeClasses()} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Multiple progress bars in a group
interface ProgressGroupProps {
  title: string;
  subtitle?: string;
  items: Array<{
    label: string;
    value: number;
    max?: number;
    color?: 'default' | 'success' | 'warning' | 'danger';
  }>;
  loading?: boolean;
  className?: string;
}

export function ProgressGroup({
  title,
  subtitle,
  items,
  loading = false,
  className = '',
}: ProgressGroupProps) {
  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!items || items.length === 0}
      className={className}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <ProgressBar
            key={index}
            label={item.label}
            value={item.value}
            max={item.max}
            color={item.color}
          />
        ))}
      </div>
    </WidgetCard>
  );
}
