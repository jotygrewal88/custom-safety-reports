'use client';

import React, { useState } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface DataConfidenceProps {
  variant?: 'inline' | 'card' | 'tooltip';
  className?: string;
}

export function DataConfidence({ variant = 'inline', className = '' }: DataConfidenceProps) {
  const { dataConfidence } = useAnalytics();
  const [showDetails, setShowDetails] = useState(false);

  const metrics = [
    {
      label: 'Severity',
      value: dataConfidence.totalEvents > 0 
        ? Math.round((dataConfidence.eventsWithSeverity / dataConfidence.totalEvents) * 100)
        : 0,
    },
    {
      label: 'Hazard Category',
      value: dataConfidence.totalEvents > 0
        ? Math.round((dataConfidence.eventsWithHazardCategory / dataConfidence.totalEvents) * 100)
        : 0,
    },
    {
      label: 'Asset Linkage',
      value: dataConfidence.totalEvents > 0
        ? Math.round((dataConfidence.eventsWithAssetLinkage / dataConfidence.totalEvents) * 100)
        : 0,
    },
    {
      label: 'CAPA Linkage',
      value: dataConfidence.totalEvents > 0
        ? Math.round((dataConfidence.eventsWithCapaLinkage / dataConfidence.totalEvents) * 100)
        : 0,
    },
  ];

  const overallScore = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (variant === 'tooltip') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Data Quality: <span className={getScoreColor(overallScore)}>{Math.round(overallScore)}%</span>
        </button>

        {showDetails && (
          <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Data Completeness</h4>
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{metric.label}</span>
                    <span className={`text-xs font-medium ${getScoreColor(metric.value)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(metric.value)} transition-all duration-500`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Higher data completeness leads to more accurate insights.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Data Completeness</h3>
          <span className={`text-lg font-bold ${getScoreColor(overallScore)}`}>
            {Math.round(overallScore)}%
          </span>
        </div>
        <div className="space-y-3">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">{metric.label}</span>
                <span className={`text-xs font-medium ${getScoreColor(metric.value)}`}>
                  {metric.value}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(metric.value)} transition-all duration-500`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {metrics.map((metric) => (
        <div key={metric.label} className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{metric.label}:</span>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(metric.value)}`}
              style={{ width: `${metric.value}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${getScoreColor(metric.value)}`}>
            {metric.value}%
          </span>
        </div>
      ))}
    </div>
  );
}
