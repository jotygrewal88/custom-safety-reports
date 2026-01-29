'use client';

import React, { useMemo } from 'react';
import {
  useAnalytics,
  useOSHAMetrics,
} from '../../../src/contexts/AnalyticsContext';
import { KPITile } from '../../../src/components/widgets/KPITile';
import { KPIGrid } from '../../../src/components/widgets/WidgetCard';
import { RankedList } from '../../../src/components/widgets/RankedList';
import { TrendChart, DualMetricChart } from '../../../src/components/widgets/TrendChart';
import { SeverityDistribution, ProgressGroup } from '../../../src/components/widgets/DistributionChart';
import {
  AIInsightCard,
  generateMockExecutiveInsight,
} from '../../../src/components/widgets/AIInsightCard';

export default function ExecutiveDashboard() {
  const {
    filteredEvents,
    eventsBySeverity,
    eventsBySite,
    eventTrendData,
    overdueCapas,
    dueSoonCapas,
    loading,
  } = useAnalytics();

  const oshaMetrics = useOSHAMetrics();

  // Compliance coverage
  const complianceCoverage = useMemo(() => {
    const totalCapas = overdueCapas.length + dueSoonCapas.length;
    const onTimeCapas = dueSoonCapas.length;
    
    // Calculate events with proper follow-up
    const eventsWithCapa = filteredEvents.filter(e => e.linkedCapaIds.length > 0).length;
    const highSeverityEvents = filteredEvents.filter(e => 
      e.severity === 'critical' || e.severity === 'high'
    ).length;

    return {
      capaOnTime: totalCapas > 0 ? Math.round((onTimeCapas / totalCapas) * 100) : 100,
      eventFollowUp: highSeverityEvents > 0 ? Math.round((eventsWithCapa / highSeverityEvents) * 100) : 100,
      dataCompleteness: Math.round((filteredEvents.filter(e => e.hazardCategory).length / Math.max(filteredEvents.length, 1)) * 100),
    };
  }, [filteredEvents, overdueCapas, dueSoonCapas]);

  // Risk hotspots with severity weighting
  const riskHotspots = useMemo(() => {
    const siteRiskScores = eventsBySite.map(site => {
      const siteEvents = filteredEvents.filter(e => e.siteId === site.siteId);
      const riskScore = siteEvents.reduce((score, event) => {
        switch (event.severity) {
          case 'critical': return score + 4;
          case 'high': return score + 3;
          case 'medium': return score + 2;
          case 'low': return score + 1;
          default: return score;
        }
      }, 0);
      
      return {
        ...site,
        riskScore,
        criticalCount: siteEvents.filter(e => e.severity === 'critical').length,
        highCount: siteEvents.filter(e => e.severity === 'high').length,
      };
    }).sort((a, b) => b.riskScore - a.riskScore);

    return siteRiskScores;
  }, [eventsBySite, filteredEvents]);

  // AI Insight
  const aiInsight = generateMockExecutiveInsight();

  return (
    <div className="space-y-6">
      {/* Row 1: OSHA KPIs */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">OSHA Metrics</h3>
            <p className="text-xs text-gray-500">Year to date performance</p>
          </div>
          <span className="text-xs text-gray-400">Based on 200,000 hours worked</span>
        </div>
        <KPIGrid columns={4}>
          <KPITile
            label="TRIR"
            value={oshaMetrics.trir}
            color={parseFloat(oshaMetrics.trir) <= 2.5 ? 'success' : 'warning'}
            size="lg"
          />
          <KPITile
            label="DART Rate"
            value={oshaMetrics.dart}
            color={parseFloat(oshaMetrics.dart) <= 1.5 ? 'success' : 'warning'}
            size="lg"
          />
          <KPITile
            label="Total Recordables"
            value={oshaMetrics.totalRecordables}
            color="default"
            size="lg"
          />
          <KPITile
            label="Hours Worked"
            value={Math.round(oshaMetrics.totalHoursWorked / 1000)}
            suffix="K"
            color="default"
            size="lg"
          />
        </KPIGrid>
      </div>

      {/* Row 2: Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Volume vs Closure Trend */}
          <DualMetricChart
            title="Incident Volume vs Closure Trend"
            subtitle="Monthly event lifecycle"
            data={eventTrendData}
            metric1={{ key: 'created', label: 'Events Created', color: '#2563eb' }}
            metric2={{ key: 'closed', label: 'Events Closed', color: '#10b981' }}
            type="line"
            height={300}
            loading={loading}
          />

          {/* Risk Hotspots */}
          <RankedList
            title="Risk Hotspots by Site"
            subtitle="Severity-weighted risk score"
            items={riskHotspots.map(site => ({
              id: site.siteId,
              label: site.siteName,
              value: site.riskScore,
              secondaryValue: site.count,
              secondaryLabel: 'events',
              badge: site.criticalCount > 0 
                ? { text: `${site.criticalCount} Critical`, color: 'danger' }
                : site.highCount > 0
                  ? { text: `${site.highCount} High`, color: 'warning' }
                  : undefined,
            }))}
            maxItems={5}
            showRank
            valueLabel="risk score"
            loading={loading}
            tooltip="Risk score = Critical×4 + High×3 + Medium×2 + Low×1"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Severity Distribution */}
          <SeverityDistribution
            title="Incident Severity Distribution"
            subtitle="Current period"
            critical={eventsBySeverity.critical || 0}
            high={eventsBySeverity.high || 0}
            medium={eventsBySeverity.medium || 0}
            low={eventsBySeverity.low || 0}
            type="donut"
            loading={loading}
          />

          {/* Compliance Coverage */}
          <ProgressGroup
            title="Compliance Coverage"
            subtitle="Key compliance indicators"
            items={[
              {
                label: 'CAPA On-Time Completion',
                value: complianceCoverage.capaOnTime,
                color: complianceCoverage.capaOnTime >= 80 ? 'success' : complianceCoverage.capaOnTime >= 60 ? 'warning' : 'danger',
              },
              {
                label: 'High-Severity Event Follow-Up',
                value: complianceCoverage.eventFollowUp,
                color: complianceCoverage.eventFollowUp >= 80 ? 'success' : complianceCoverage.eventFollowUp >= 60 ? 'warning' : 'danger',
              },
              {
                label: 'Data Completeness',
                value: complianceCoverage.dataCompleteness,
                color: complianceCoverage.dataCompleteness >= 80 ? 'success' : complianceCoverage.dataCompleteness >= 60 ? 'warning' : 'danger',
              },
            ]}
            loading={loading}
          />

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Period Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="text-sm font-semibold text-gray-900">{filteredEvents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Open Events</span>
                <span className="text-sm font-semibold text-gray-900">
                  {filteredEvents.filter(e => e.status === 'open').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Closed Events</span>
                <span className="text-sm font-semibold text-green-600">
                  {filteredEvents.filter(e => e.status === 'closed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overdue CAPAs</span>
                <span className={`text-sm font-semibold ${overdueCapas.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {overdueCapas.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: AI Executive Summary */}
      <AIInsightCard
        title="AI Executive Summary"
        insight={aiInsight}
        lastUpdated="Just now"
        collapsible
        defaultExpanded
        followUpPrompts={[
          'What are the top priorities?',
          'Compare to industry benchmarks',
          'Show quarterly trend',
        ]}
      />
    </div>
  );
}
