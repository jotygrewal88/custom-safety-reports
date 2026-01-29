'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import {
  AnalyticsSafetyEvent,
  CAPA,
  SafetyWorkOrder,
  OSHA300ASummary,
  OSHAQuarterlySummary,
  Asset,
  TimeRange,
  AnalyticsFilters,
  Severity,
  EventClassification,
  HazardCategory,
  DataConfidenceMetrics,
  EventStatus,
  CapaStatus,
} from '../types/analytics';
import {
  SAFETY_EVENTS,
  CAPAS,
  SAFETY_WORK_ORDERS,
  OSHA_300A_SUMMARIES,
  OSHA_QUARTERLY_SUMMARIES,
  ASSETS,
  SITES,
  USERS,
  getDateRange,
  filterEventsByDateRange,
  getDataConfidenceMetrics,
} from '../data/analyticsData';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface AnalyticsContextValue {
  // Raw data
  allEvents: AnalyticsSafetyEvent[];
  allCapas: CAPA[];
  allWorkOrders: SafetyWorkOrder[];
  allAssets: Asset[];
  osha300ASummaries: OSHA300ASummary[];
  oshaQuarterlySummaries: OSHAQuarterlySummary[];
  
  // Filtered data
  filteredEvents: AnalyticsSafetyEvent[];
  filteredCapas: CAPA[];
  filteredWorkOrders: SafetyWorkOrder[];
  
  // Filters
  filters: AnalyticsFilters;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;
  
  // Time range
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  dateRange: { startDate: Date; endDate: Date };
  
  // Computed metrics
  dataConfidence: DataConfidenceMetrics;
  
  // Event metrics
  eventsBySeverity: Record<Severity, number>;
  eventsByClassification: Record<EventClassification, number>;
  eventsByStatus: Record<EventStatus, number>;
  eventsByHazard: Record<HazardCategory, number>;
  eventsBySite: Array<{ siteId: string; siteName: string; count: number }>;
  
  // CAPA metrics
  capasByStatus: Record<CapaStatus, number>;
  overdueCapas: CAPA[];
  dueSoonCapas: CAPA[];
  
  // Trend data
  eventTrendData: Array<{ date: string; count: number; created: number; closed: number }>;
  capaTrendData: Array<{ date: string; created: number; closed: number }>;
  
  // Reference data
  sites: typeof SITES;
  users: typeof USERS;
  
  // Loading state
  loading: boolean;
}

const defaultFilters: AnalyticsFilters = {
  timeRange: '30d',
  siteIds: [],
  locationIds: [],
  severities: [],
  classifications: [],
  hazardCategories: [],
  templateIds: [],
  assetIds: [],
};

// ============================================================================
// CONTEXT
// ============================================================================

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [filters, setFiltersState] = useState<AnalyticsFilters>(defaultFilters);
  const [loading] = useState(false);

  // Set filters with partial update
  const setFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const setTimeRange = useCallback((range: TimeRange) => {
    setFiltersState(prev => ({ ...prev, timeRange: range }));
  }, []);

  // Date range calculation
  const dateRange = useMemo(() => {
    if (filters.startDate && filters.endDate) {
      return {
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
      };
    }
    return getDateRange(filters.timeRange);
  }, [filters.timeRange, filters.startDate, filters.endDate]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = filterEventsByDateRange(SAFETY_EVENTS, dateRange.startDate, dateRange.endDate);

    if (filters.siteIds.length > 0) {
      events = events.filter(e => filters.siteIds.includes(e.siteId));
    }
    if (filters.locationIds.length > 0) {
      events = events.filter(e => e.locationId && filters.locationIds.includes(e.locationId));
    }
    if (filters.severities.length > 0) {
      events = events.filter(e => filters.severities.includes(e.severity));
    }
    if (filters.classifications.length > 0) {
      events = events.filter(e => filters.classifications.includes(e.classification));
    }
    if (filters.hazardCategories.length > 0) {
      events = events.filter(e => e.hazardCategory && filters.hazardCategories.includes(e.hazardCategory));
    }
    if (filters.assetIds.length > 0) {
      events = events.filter(e => e.assetId && filters.assetIds.includes(e.assetId));
    }

    return events;
  }, [dateRange, filters]);

  // Filter CAPAs
  const filteredCapas = useMemo(() => {
    let capas = CAPAS.filter(c => {
      const createdDate = new Date(c.createdDate);
      return createdDate >= dateRange.startDate && createdDate <= dateRange.endDate;
    });

    if (filters.siteIds.length > 0) {
      capas = capas.filter(c => filters.siteIds.includes(c.siteId));
    }

    return capas;
  }, [dateRange, filters.siteIds]);

  // Filter Work Orders
  const filteredWorkOrders = useMemo(() => {
    let workOrders = SAFETY_WORK_ORDERS.filter(wo => {
      const createdDate = new Date(wo.createdDate);
      return createdDate >= dateRange.startDate && createdDate <= dateRange.endDate;
    });

    if (filters.siteIds.length > 0) {
      workOrders = workOrders.filter(wo => filters.siteIds.includes(wo.siteId));
    }

    return workOrders;
  }, [dateRange, filters.siteIds]);

  // Events by severity
  const eventsBySeverity = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<Severity, number>);
  }, [filteredEvents]);

  // Events by classification
  const eventsByClassification = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      acc[event.classification] = (acc[event.classification] || 0) + 1;
      return acc;
    }, {} as Record<EventClassification, number>);
  }, [filteredEvents]);

  // Events by status
  const eventsByStatus = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<EventStatus, number>);
  }, [filteredEvents]);

  // Events by hazard category
  const eventsByHazard = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      if (event.hazardCategory) {
        acc[event.hazardCategory] = (acc[event.hazardCategory] || 0) + 1;
      }
      return acc;
    }, {} as Record<HazardCategory, number>);
  }, [filteredEvents]);

  // Events by site
  const eventsBySite = useMemo(() => {
    const siteMap = filteredEvents.reduce((acc, event) => {
      if (!acc[event.siteId]) {
        acc[event.siteId] = { siteId: event.siteId, siteName: event.siteName, count: 0 };
      }
      acc[event.siteId].count++;
      return acc;
    }, {} as Record<string, { siteId: string; siteName: string; count: number }>);
    
    return Object.values(siteMap).sort((a, b) => b.count - a.count);
  }, [filteredEvents]);

  // CAPAs by status
  const capasByStatus = useMemo(() => {
    return filteredCapas.reduce((acc, capa) => {
      acc[capa.status] = (acc[capa.status] || 0) + 1;
      return acc;
    }, {} as Record<CapaStatus, number>);
  }, [filteredCapas]);

  // Overdue CAPAs
  const overdueCapas = useMemo(() => {
    const now = new Date();
    return CAPAS.filter(c => c.status !== 'closed' && new Date(c.dueDate) < now);
  }, []);

  // Due soon CAPAs (within 7 days)
  const dueSoonCapas = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return CAPAS.filter(c => {
      const dueDate = new Date(c.dueDate);
      return c.status !== 'closed' && dueDate >= now && dueDate <= sevenDaysFromNow;
    });
  }, []);

  // Event trend data (daily counts for the period)
  const eventTrendData = useMemo(() => {
    const days = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const data: Array<{ date: string; count: number; created: number; closed: number }> = [];

    for (let i = 0; i <= days; i++) {
      const date = new Date(dateRange.startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const created = filteredEvents.filter(e => 
        e.eventDate.split('T')[0] === dateStr
      ).length;
      
      const closed = filteredEvents.filter(e => 
        e.closedAt && e.closedAt.split('T')[0] === dateStr
      ).length;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: created,
        created,
        closed,
      });
    }

    // Aggregate to weekly if more than 30 days
    if (days > 30) {
      const weeklyData: typeof data = [];
      for (let i = 0; i < data.length; i += 7) {
        const weekSlice = data.slice(i, i + 7);
        const weekLabel = weekSlice[0].date;
        weeklyData.push({
          date: weekLabel,
          count: weekSlice.reduce((sum, d) => sum + d.count, 0),
          created: weekSlice.reduce((sum, d) => sum + d.created, 0),
          closed: weekSlice.reduce((sum, d) => sum + d.closed, 0),
        });
      }
      return weeklyData;
    }

    return data;
  }, [dateRange, filteredEvents]);

  // CAPA trend data
  const capaTrendData = useMemo(() => {
    const days = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const data: Array<{ date: string; created: number; closed: number }> = [];

    for (let i = 0; i <= days; i++) {
      const date = new Date(dateRange.startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const created = filteredCapas.filter(c => 
        c.createdDate.split('T')[0] === dateStr
      ).length;
      
      const closed = filteredCapas.filter(c => 
        c.closedDate && c.closedDate.split('T')[0] === dateStr
      ).length;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        created,
        closed,
      });
    }

    // Aggregate to weekly if more than 30 days
    if (days > 30) {
      const weeklyData: typeof data = [];
      for (let i = 0; i < data.length; i += 7) {
        const weekSlice = data.slice(i, i + 7);
        const weekLabel = weekSlice[0].date;
        weeklyData.push({
          date: weekLabel,
          created: weekSlice.reduce((sum, d) => sum + d.created, 0),
          closed: weekSlice.reduce((sum, d) => sum + d.closed, 0),
        });
      }
      return weeklyData;
    }

    return data;
  }, [dateRange, filteredCapas]);

  // Data confidence
  const dataConfidence = useMemo(() => {
    return getDataConfidenceMetrics(filteredEvents);
  }, [filteredEvents]);

  const value: AnalyticsContextValue = {
    // Raw data
    allEvents: SAFETY_EVENTS,
    allCapas: CAPAS,
    allWorkOrders: SAFETY_WORK_ORDERS,
    allAssets: ASSETS,
    osha300ASummaries: OSHA_300A_SUMMARIES,
    oshaQuarterlySummaries: OSHA_QUARTERLY_SUMMARIES,
    
    // Filtered data
    filteredEvents,
    filteredCapas,
    filteredWorkOrders,
    
    // Filters
    filters,
    setFilters,
    resetFilters,
    
    // Time range
    timeRange: filters.timeRange,
    setTimeRange,
    dateRange,
    
    // Computed metrics
    dataConfidence,
    eventsBySeverity,
    eventsByClassification,
    eventsByStatus,
    eventsByHazard,
    eventsBySite,
    capasByStatus,
    overdueCapas,
    dueSoonCapas,
    
    // Trend data
    eventTrendData,
    capaTrendData,
    
    // Reference data
    sites: SITES,
    users: USERS,
    
    loading,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// ============================================================================
// ADDITIONAL HOOKS FOR SPECIFIC USE CASES
// ============================================================================

// Hook for getting open events by severity
export function useOpenEventsBySeverity() {
  const { filteredEvents } = useAnalytics();
  
  return useMemo(() => {
    const openEvents = filteredEvents.filter(e => e.status === 'open');
    return {
      critical: openEvents.filter(e => e.severity === 'critical').length,
      high: openEvents.filter(e => e.severity === 'high').length,
      medium: openEvents.filter(e => e.severity === 'medium').length,
      low: openEvents.filter(e => e.severity === 'low').length,
      total: openEvents.length,
    };
  }, [filteredEvents]);
}

// Hook for getting events submitted today
export function useEventsToday() {
  const { allEvents } = useAnalytics();
  
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allEvents.filter(e => {
      const eventDate = new Date(e.eventDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, [allEvents]);
}

// Hook for getting events this week
export function useEventsThisWeek() {
  const { allEvents } = useAnalytics();
  
  return useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return allEvents.filter(e => new Date(e.eventDate) >= weekAgo);
  }, [allEvents]);
}

// Hook for trending hazards
export function useTrendingHazards(days: number = 30) {
  const { allEvents } = useAnalytics();
  
  return useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
    const recentEvents = allEvents.filter(e => new Date(e.eventDate) >= cutoff);
    
    const hazardCounts = recentEvents.reduce((acc, event) => {
      if (event.hazardCategory) {
        acc[event.hazardCategory] = (acc[event.hazardCategory] || 0) + 1;
      }
      return acc;
    }, {} as Record<HazardCategory, number>);
    
    return Object.entries(hazardCounts)
      .map(([category, count]) => ({ category: category as HazardCategory, count }))
      .sort((a, b) => b.count - a.count);
  }, [allEvents, days]);
}

// Hook for OSHA metrics
export function useOSHAMetrics() {
  const { osha300ASummaries, oshaQuarterlySummaries } = useAnalytics();
  
  return useMemo(() => {
    // Aggregate all locations
    const totals = osha300ASummaries.reduce((acc, summary) => ({
      recordables: acc.recordables + (summary.totalDaysAwayFromWork + summary.totalJobTransferOrRestriction + summary.totalOtherRecordableCases),
      hours: acc.hours + summary.totalHoursWorked,
      dart: acc.dart + (summary.totalDaysAwayFromWork + summary.totalJobTransferOrRestriction),
    }), { recordables: 0, hours: 0, dart: 0 });

    const trir = totals.hours > 0 ? (totals.recordables * 200000) / totals.hours : 0;
    const dartRate = totals.hours > 0 ? (totals.dart * 200000) / totals.hours : 0;

    return {
      trir: trir.toFixed(2),
      dart: dartRate.toFixed(2),
      totalRecordables: totals.recordables,
      totalHoursWorked: totals.hours,
      quarterlySummaries: oshaQuarterlySummaries,
    };
  }, [osha300ASummaries, oshaQuarterlySummaries]);
}

// Hook for CAPA effectiveness metrics
export function useCAPAEffectiveness() {
  const { allCapas } = useAnalytics();
  
  return useMemo(() => {
    const closedCapas = allCapas.filter(c => c.status === 'closed' && c.closedDate);
    
    // Average time to close (in days)
    const avgTimeToClose = closedCapas.length > 0
      ? closedCapas.reduce((sum, c) => {
          const created = new Date(c.createdDate);
          const closed = new Date(c.closedDate!);
          return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / closedCapas.length
      : 0;

    // Preventive vs corrective ratio
    const preventive = allCapas.filter(c => c.type === 'preventive').length;
    const corrective = allCapas.filter(c => c.type === 'corrective').length;

    return {
      avgTimeToClose: Math.round(avgTimeToClose),
      preventiveCount: preventive,
      correctiveCount: corrective,
      preventiveRatio: allCapas.length > 0 ? (preventive / allCapas.length) * 100 : 0,
      closedCount: closedCapas.length,
      openCount: allCapas.filter(c => c.status !== 'closed').length,
    };
  }, [allCapas]);
}

// Hook for assets with repeated events
export function useAssetsWithRepeatedEvents(minCount: number = 2) {
  const { filteredEvents, allAssets } = useAnalytics();
  
  return useMemo(() => {
    const assetEventCounts = filteredEvents.reduce((acc, event) => {
      if (event.assetId) {
        acc[event.assetId] = (acc[event.assetId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(assetEventCounts)
      .filter(([, count]) => count >= minCount)
      .map(([assetId, count]) => {
        const asset = allAssets.find(a => a.id === assetId);
        return {
          assetId,
          assetName: asset?.name || 'Unknown Asset',
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [filteredEvents, allAssets, minCount]);
}
