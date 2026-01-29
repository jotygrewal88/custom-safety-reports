'use client';

import React, { useMemo } from 'react';
import {
  useAnalytics,
  useOpenEventsBySeverity,
  useEventsToday,
  useEventsThisWeek,
  useTrendingHazards,
  useAssetsWithRepeatedEvents,
} from '../../../src/contexts/AnalyticsContext';
import { SeverityKPIRow, KPITile } from '../../../src/components/widgets/KPITile';
import { RankedList, AlertList, CAPAList } from '../../../src/components/widgets/RankedList';
import { TrendChart } from '../../../src/components/widgets/TrendChart';
import { DistributionChart } from '../../../src/components/widgets/DistributionChart';
import {
  AIInsightCard,
  generateMockOperationalInsight,
} from '../../../src/components/widgets/AIInsightCard';
import {
  HAZARD_CATEGORY_LABELS,
  HazardCategory,
  isLeadingIndicator,
  CLASSIFICATION_LABELS,
} from '../../../src/types/analytics';

export default function SafetyManagerDashboard() {
  const {
    filteredEvents,
    overdueCapas,
    dueSoonCapas,
    eventTrendData,
    loading,
  } = useAnalytics();

  const openEventsBySeverity = useOpenEventsBySeverity();
  const eventsToday = useEventsToday();
  const eventsThisWeek = useEventsThisWeek();
  const trendingHazards = useTrendingHazards(30);
  const assetsWithRepeatedEvents = useAssetsWithRepeatedEvents(2);

  // New high-severity events (last 7 days)
  const highSeverityEvents = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    return filteredEvents
      .filter(e => 
        (e.severity === 'critical' || e.severity === 'high') &&
        new Date(e.eventDate) >= weekAgo
      )
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 10);
  }, [filteredEvents]);

  // OSHA recordable watchlist
  const oshaRecordables = useMemo(() => {
    return filteredEvents
      .filter(e => e.oshaRecordable)
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 10);
  }, [filteredEvents]);

  // Leading vs Lagging indicators
  const leadingVsLagging = useMemo(() => {
    const leading = filteredEvents.filter(e => isLeadingIndicator(e.classification)).length;
    const lagging = filteredEvents.filter(e => !isLeadingIndicator(e.classification)).length;
    return { leading, lagging, total: leading + lagging };
  }, [filteredEvents]);

  // Prepare CAPA list items
  const capaItems = useMemo(() => {
    const allCapaItems = [...overdueCapas, ...dueSoonCapas]
      .map(capa => {
        const dueDate = new Date(capa.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now;
        const isDueSoon = !isOverdue && dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return {
          id: capa.id,
          title: capa.title,
          owner: capa.ownerName,
          dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: isOverdue ? 'overdue' as const : isDueSoon ? 'due_soon' as const : 'on_track' as const,
          priority: capa.priority,
        };
      })
      .sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (a.status !== 'overdue' && b.status === 'overdue') return 1;
        return 0;
      });
    
    return allCapaItems.slice(0, 10);
  }, [overdueCapas, dueSoonCapas]);

  // AI Insight
  const aiInsight = generateMockOperationalInsight();

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today/Week Events */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Events Submitted</h3>
          <div className="grid grid-cols-2 gap-4">
            <KPITile
              label="Today"
              value={eventsToday.length}
              color="info"
              size="sm"
            />
            <KPITile
              label="This Week"
              value={eventsThisWeek.length}
              color="default"
              size="sm"
            />
          </div>
        </div>

        {/* Open Events by Severity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Open Events by Severity</h3>
            <SeverityKPIRow
              critical={openEventsBySeverity.critical}
              high={openEventsBySeverity.high}
              medium={openEventsBySeverity.medium}
              low={openEventsBySeverity.low}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Trend */}
          <TrendChart
            title="Safety Events Trend"
            subtitle="Events created over time"
            data={eventTrendData}
            dataKeys={[
              { key: 'created', label: 'Created', color: '#2563eb' },
              { key: 'closed', label: 'Closed', color: '#10b981' },
            ]}
            type="bar"
            height={280}
            loading={loading}
          />

          {/* Trending Hazards */}
          <RankedList
            title="Trending Hazards"
            subtitle="Most common hazard categories (Last 30 days)"
            items={trendingHazards.map((h, idx) => ({
              id: h.category,
              label: HAZARD_CATEGORY_LABELS[h.category as HazardCategory] || h.category,
              value: h.count,
              trend: idx < 3 ? 'up' : undefined,
            }))}
            maxItems={8}
            showRank
            valueLabel="events"
            loading={loading}
            emptyMessage="No hazard data available"
          />

          {/* Leading vs Lagging Indicators */}
          <DistributionChart
            title="Leading vs Lagging Indicators"
            subtitle="Proactive reporting ratio"
            data={[
              { 
                name: 'Leading (Near Miss, Hazard, Observation)', 
                value: leadingVsLagging.leading, 
                color: '#22c55e' 
              },
              { 
                name: 'Lagging (Incidents)', 
                value: leadingVsLagging.lagging, 
                color: '#ef4444' 
              },
            ]}
            type="donut"
            height={280}
            centerValue={leadingVsLagging.total}
            centerLabel="Total Events"
            loading={loading}
            tooltip="Leading indicators (near misses, hazards, observations) help predict and prevent incidents. A higher ratio of leading to lagging indicators suggests a more proactive safety culture."
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* High Severity Events */}
          <AlertList
            title="New High-Severity Events"
            subtitle="Last 7 days"
            items={highSeverityEvents.map(event => ({
              id: event.id,
              title: event.title,
              subtitle: `${event.siteName} · ${new Date(event.eventDate).toLocaleDateString()}`,
              severity: event.severity,
              timestamp: new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            }))}
            maxItems={5}
            loading={loading}
            emptyMessage="No high-severity events this week"
          />

          {/* CAPAs Due/Overdue */}
          <CAPAList
            title="CAPAs Requiring Attention"
            subtitle={`${overdueCapas.length} overdue · ${dueSoonCapas.length} due soon`}
            items={capaItems}
            maxItems={5}
            loading={loading}
          />

          {/* OSHA Recordable Watchlist */}
          <AlertList
            title="OSHA Recordable Watchlist"
            subtitle="Events marked as OSHA recordable"
            items={oshaRecordables.map(event => ({
              id: event.id,
              title: event.title,
              subtitle: `${event.siteName} · ${CLASSIFICATION_LABELS[event.classification]}`,
              severity: event.severity,
              timestamp: new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            }))}
            maxItems={5}
            loading={loading}
            emptyMessage="No OSHA recordable events"
          />

          {/* Assets with Repeated Events */}
          <RankedList
            title="Assets with Repeated Events"
            subtitle="Potential high-risk assets"
            items={assetsWithRepeatedEvents.map(asset => ({
              id: asset.assetId,
              label: asset.assetName,
              value: asset.count,
              badge: asset.count >= 3 ? { text: 'High Risk', color: 'danger' } : undefined,
            }))}
            maxItems={5}
            showRank
            valueLabel="events"
            loading={loading}
            emptyMessage="No assets with repeated events"
          />
        </div>
      </div>

      {/* Row 3: AI Summary */}
      <AIInsightCard
        title="AI Safety Summary"
        insight={aiInsight}
        lastUpdated="Just now"
        collapsible
        followUpPrompts={[
          'What caused the increase?',
          'Show me details on Chicago',
          'Compare to last month',
        ]}
      />
    </div>
  );
}
