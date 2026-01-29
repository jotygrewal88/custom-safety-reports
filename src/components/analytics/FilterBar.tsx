'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { TimeRange, Severity, EventClassification, SEVERITY_LABELS, CLASSIFICATION_LABELS } from '../../types/analytics';

const TIME_RANGE_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' },
];

interface FilterBarProps {
  showSiteFilter?: boolean;
  showSeverityFilter?: boolean;
  showClassificationFilter?: boolean;
  compact?: boolean;
}

export function FilterBar({
  showSiteFilter = true,
  showSeverityFilter = true,
  showClassificationFilter = true,
  compact = false,
}: FilterBarProps) {
  const { filters, setFilters, sites, timeRange, setTimeRange, resetFilters } = useAnalytics();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(() => {
    if (timeRange === 'custom' && filters.startDate) {
      return filters.startDate.split('T')[0];
    }
    return '';
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    if (timeRange === 'custom' && filters.endDate) {
      return filters.endDate.split('T')[0];
    }
    return '';
  });
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = 
    filters.siteIds.length > 0 || 
    filters.severities.length > 0 || 
    filters.classifications.length > 0;

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TimeRange;
    if (value === 'custom') {
      setShowDatePicker(true);
      // Set default custom range to last 30 days
      const end = new Date();
      const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      setCustomStartDate(start.toISOString().split('T')[0]);
      setCustomEndDate(end.toISOString().split('T')[0]);
    } else {
      setShowDatePicker(false);
      setFilters({ startDate: undefined, endDate: undefined });
    }
    setTimeRange(value);
  };

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setFilters({
        startDate: new Date(customStartDate).toISOString(),
        endDate: new Date(customEndDate + 'T23:59:59').toISOString(),
      });
      setShowDatePicker(false);
    }
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setFilters({ siteIds: [] });
    } else {
      setFilters({ siteIds: [value] });
    }
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setFilters({ severities: [] });
    } else {
      setFilters({ severities: [value as Severity] });
    }
  };

  const handleClassificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setFilters({ classifications: [] });
    } else {
      setFilters({ classifications: [value as EventClassification] });
    }
  };

  // Format the custom date range for display
  const getTimeRangeDisplay = () => {
    if (timeRange === 'custom' && filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return null;
  };

  const customRangeDisplay = getTimeRangeDisplay();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${compact ? '' : 'p-4 bg-white rounded-lg border border-gray-200 shadow-sm'}`}>
      {/* Time Range */}
      <div className="relative flex items-center gap-2" ref={datePickerRef}>
        <label className="text-sm font-medium text-gray-700">Period:</label>
        <div className="relative">
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TIME_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Custom date display badge */}
        {customRangeDisplay && (
          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md">
            {customRangeDisplay}
          </span>
        )}
        
        {/* Custom date picker dropdown */}
        {showDatePicker && (
          <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[320px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">Select Date Range</h4>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={customEndDate || undefined}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate || undefined}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Quick presets */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
                    setCustomStartDate(start.toISOString().split('T')[0]);
                    setCustomEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  Last 2 weeks
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getFullYear(), end.getMonth(), 1);
                    setCustomStartDate(start.toISOString().split('T')[0]);
                    setCustomEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  This month
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
                    const endOfLastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
                    setCustomStartDate(start.toISOString().split('T')[0]);
                    setCustomEndDate(endOfLastMonth.toISOString().split('T')[0]);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  Last month
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getFullYear(), end.getMonth() - 3, end.getDate());
                    setCustomStartDate(start.toISOString().split('T')[0]);
                    setCustomEndDate(end.toISOString().split('T')[0]);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  Last 3 months
                </button>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomRange}
                  disabled={!customStartDate || !customEndDate}
                  className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Site Filter */}
      {showSiteFilter && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Site:</label>
          <select
            value={filters.siteIds[0] || 'all'}
            onChange={handleSiteChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sites</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Severity Filter */}
      {showSeverityFilter && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Severity:</label>
          <select
            value={filters.severities[0] || 'all'}
            onChange={handleSeverityChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            {(Object.keys(SEVERITY_LABELS) as Severity[]).map((severity) => (
              <option key={severity} value={severity}>
                {SEVERITY_LABELS[severity]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Classification Filter */}
      {showClassificationFilter && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Type:</label>
          <select
            value={filters.classifications[0] || 'all'}
            onChange={handleClassificationChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {(Object.keys(CLASSIFICATION_LABELS) as EventClassification[]).map((classification) => (
              <option key={classification} value={classification}>
                {CLASSIFICATION_LABELS[classification]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

// Compact filter chips for dashboard headers
export function FilterChips() {
  const { filters, setFilters, sites, timeRange } = useAnalytics();

  const activeFilters: Array<{ label: string; onRemove: () => void }> = [];

  // Time range chip - handle custom range display
  let timeRangeLabel: string;
  if (timeRange === 'custom' && filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    timeRangeLabel = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } else {
    timeRangeLabel = TIME_RANGE_OPTIONS.find(t => t.value === timeRange)?.label || timeRange;
  }

  // Site chips
  filters.siteIds.forEach(siteId => {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      activeFilters.push({
        label: site.name,
        onRemove: () => setFilters({ siteIds: filters.siteIds.filter(id => id !== siteId) }),
      });
    }
  });

  // Severity chips
  filters.severities.forEach(severity => {
    activeFilters.push({
      label: SEVERITY_LABELS[severity],
      onRemove: () => setFilters({ severities: filters.severities.filter(s => s !== severity) }),
    });
  });

  // Classification chips
  filters.classifications.forEach(classification => {
    activeFilters.push({
      label: CLASSIFICATION_LABELS[classification],
      onRemove: () => setFilters({ classifications: filters.classifications.filter(c => c !== classification) }),
    });
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Time range indicator */}
      <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">
        {timeRangeLabel}
      </span>

      {/* Active filter chips */}
      {activeFilters.map((filter, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
        >
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="ml-0.5 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
}
