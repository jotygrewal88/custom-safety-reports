'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WidgetCard } from './WidgetCard';

// Chart color palette
const CHART_COLORS = {
  primary: '#2563eb', // blue-600
  secondary: '#10b981', // emerald-500
  tertiary: '#f59e0b', // amber-500
  quaternary: '#8b5cf6', // violet-500
  danger: '#ef4444', // red-500
  success: '#22c55e', // green-500
  warning: '#f97316', // orange-500
  gray: '#6b7280', // gray-500
};

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface TrendChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  dataKeys: Array<{
    key: string;
    label: string;
    color?: string;
  }>;
  type?: 'line' | 'bar' | 'area';
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  loading?: boolean;
  className?: string;
  xAxisKey?: string;
  yAxisLabel?: string;
  tooltip?: string;
}

export function TrendChart({
  title,
  subtitle,
  data,
  dataKeys,
  type = 'line',
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  loading = false,
  className = '',
  xAxisKey = 'date',
  yAxisLabel,
  tooltip,
}: TrendChartProps) {
  const colorPalette = Object.values(CHART_COLORS);

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const commonAxisProps = {
      xAxis: (
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
        />
      ),
      yAxis: (
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 11 } : undefined}
        />
      ),
      grid: showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />,
      tooltip: (
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
          }}
        />
      ),
      legend: showLegend && (
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
          iconType="circle"
          iconSize={8}
        />
      ),
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {dataKeys.map((dk, index) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.label}
                fill={dk.color || colorPalette[index % colorPalette.length]}
                stackId={stacked ? 'stack' : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {dataKeys.map((dk, index) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.label}
                stroke={dk.color || colorPalette[index % colorPalette.length]}
                fill={dk.color || colorPalette[index % colorPalette.length]}
                fillOpacity={0.2}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </AreaChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            {commonAxisProps.grid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {dataKeys.map((dk, index) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.label}
                stroke={dk.color || colorPalette[index % colorPalette.length]}
                strokeWidth={2}
                dot={{ fill: dk.color || colorPalette[index % colorPalette.length], r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <WidgetCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={!data || data.length === 0}
      emptyMessage="No trend data available"
      className={className}
      tooltip={tooltip}
    >
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}

// Dual metric chart (e.g., Created vs Closed)
interface DualMetricChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  metric1: { key: string; label: string; color?: string };
  metric2: { key: string; label: string; color?: string };
  type?: 'line' | 'bar';
  height?: number;
  loading?: boolean;
  className?: string;
}

export function DualMetricChart({
  title,
  subtitle,
  data,
  metric1,
  metric2,
  type = 'line',
  height = 300,
  loading = false,
  className = '',
}: DualMetricChartProps) {
  return (
    <TrendChart
      title={title}
      subtitle={subtitle}
      data={data}
      dataKeys={[
        { key: metric1.key, label: metric1.label, color: metric1.color || CHART_COLORS.primary },
        { key: metric2.key, label: metric2.label, color: metric2.color || CHART_COLORS.secondary },
      ]}
      type={type}
      height={height}
      loading={loading}
      className={className}
    />
  );
}

// Mini sparkline chart
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({
  data,
  color = CHART_COLORS.primary,
  height = 40,
  width = 100,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { CHART_COLORS };
