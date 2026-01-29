'use client';

import React, { useMemo } from 'react';
import {
  useAnalytics,
  useCAPAEffectiveness,
} from '../../../src/contexts/AnalyticsContext';
import { KPITile } from '../../../src/components/widgets/KPITile';
import { KPIGrid } from '../../../src/components/widgets/WidgetCard';
import { RankedList } from '../../../src/components/widgets/RankedList';
import { DualMetricChart } from '../../../src/components/widgets/TrendChart';
import { DistributionChart } from '../../../src/components/widgets/DistributionChart';
import { DataTable, SeverityCell, StatusCell, DateCell } from '../../../src/components/widgets/DataTable';
import { CAPA_STATUS_LABELS, CAPA_TYPE_LABELS, CapaStatus } from '../../../src/types/analytics';

export default function CAPAEffectivenessDashboard() {
  const {
    allCapas,
    filteredCapas,
    filteredEvents,
    capaTrendData,
    overdueCapas,
    loading,
  } = useAnalytics();

  const capaEffectiveness = useCAPAEffectiveness();

  // CAPAs by owner with overdue count
  const capasByOwner = useMemo(() => {
    const ownerMap = allCapas.reduce((acc, capa) => {
      if (!acc[capa.ownerId]) {
        acc[capa.ownerId] = {
          ownerId: capa.ownerId,
          ownerName: capa.ownerName,
          total: 0,
          overdue: 0,
          closed: 0,
        };
      }
      acc[capa.ownerId].total++;
      if (capa.status === 'closed') {
        acc[capa.ownerId].closed++;
      }
      if (capa.status !== 'closed' && new Date(capa.dueDate) < new Date()) {
        acc[capa.ownerId].overdue++;
      }
      return acc;
    }, {} as Record<string, { ownerId: string; ownerName: string; total: number; overdue: number; closed: number }>);

    return Object.values(ownerMap)
      .sort((a, b) => b.overdue - a.overdue);
  }, [allCapas]);

  // Repeat incidents (events with same asset or similar hazard after CAPA)
  const repeatIncidents = useMemo(() => {
    // Find events that have linked CAPAs but occurred after CAPA creation
    const eventsWithCapas = filteredEvents.filter(e => e.linkedCapaIds.length > 0);
    
    // Group by asset to find repeats
    const assetEvents = eventsWithCapas.reduce((acc, event) => {
      if (event.assetId) {
        if (!acc[event.assetId]) {
          acc[event.assetId] = [];
        }
        acc[event.assetId].push(event);
      }
      return acc;
    }, {} as Record<string, typeof eventsWithCapas>);

    // Find assets with multiple events
    const repeats = Object.entries(assetEvents)
      .filter(([, events]) => events.length > 1)
      .map(([assetId, events]) => ({
        assetId,
        assetName: events[0].assetName || 'Unknown Asset',
        eventCount: events.length,
        events: events.slice(0, 3),
        linkedCapas: [...new Set(events.flatMap(e => e.linkedCapaIds))],
      }))
      .sort((a, b) => b.eventCount - a.eventCount);

    return repeats;
  }, [filteredEvents]);

  // Preventive vs Corrective distribution
  const capaTypeDistribution = useMemo(() => {
    return [
      { 
        name: 'Preventive', 
        value: capaEffectiveness.preventiveCount, 
        color: '#22c55e' 
      },
      { 
        name: 'Corrective', 
        value: capaEffectiveness.correctiveCount, 
        color: '#3b82f6' 
      },
    ];
  }, [capaEffectiveness]);

  // Average time to close by type
  const avgTimeByType = useMemo(() => {
    const closedCapas = allCapas.filter(c => c.status === 'closed' && c.closedDate);
    
    const preventive = closedCapas.filter(c => c.type === 'preventive');
    const corrective = closedCapas.filter(c => c.type === 'corrective');

    const calcAvg = (capas: typeof closedCapas) => {
      if (capas.length === 0) return 0;
      return Math.round(capas.reduce((sum, c) => {
        const created = new Date(c.createdDate);
        const closed = new Date(c.closedDate!);
        return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / capas.length);
    };

    return {
      preventive: calcAvg(preventive),
      corrective: calcAvg(corrective),
      overall: capaEffectiveness.avgTimeToClose,
    };
  }, [allCapas, capaEffectiveness.avgTimeToClose]);

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Summary */}
      <KPIGrid columns={5}>
        <KPITile
          label="Avg. Time to Close"
          value={capaEffectiveness.avgTimeToClose}
          suffix=" days"
          color={capaEffectiveness.avgTimeToClose <= 14 ? 'success' : capaEffectiveness.avgTimeToClose <= 21 ? 'warning' : 'danger'}
          size="lg"
        />
        <KPITile
          label="Open CAPAs"
          value={capaEffectiveness.openCount}
          color="info"
          size="lg"
        />
        <KPITile
          label="Closed This Period"
          value={capaEffectiveness.closedCount}
          color="success"
          size="lg"
        />
        <KPITile
          label="Overdue"
          value={overdueCapas.length}
          color={overdueCapas.length === 0 ? 'success' : 'danger'}
          size="lg"
        />
        <KPITile
          label="Preventive Ratio"
          value={Math.round(capaEffectiveness.preventiveRatio)}
          suffix="%"
          color={capaEffectiveness.preventiveRatio >= 40 ? 'success' : 'warning'}
          size="lg"
        />
      </KPIGrid>

      {/* Row 2: Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* CAPAs Created vs Closed */}
          <DualMetricChart
            title="CAPAs Created vs Closed"
            subtitle="Action throughput over time"
            data={capaTrendData}
            metric1={{ key: 'created', label: 'Created', color: '#3b82f6' }}
            metric2={{ key: 'closed', label: 'Closed', color: '#22c55e' }}
            type="bar"
            height={300}
            loading={loading}
          />

          {/* Repeat Incidents Table */}
          <DataTable
            title="Repeat Incidents with Linked CAPAs"
            subtitle="Events occurring after CAPA creation on same asset"
            data={repeatIncidents.map((item, idx) => ({
              id: item.assetId || `repeat-${idx}`,
              assetName: item.assetName,
              eventCount: item.eventCount,
              linkedCapaCount: item.linkedCapas.length,
              lastEvent: item.events[0]?.eventDate || '',
            }))}
            columns={[
              { key: 'assetName', header: 'Asset', sortable: true },
              { 
                key: 'eventCount', 
                header: 'Events', 
                align: 'center',
                sortable: true,
                render: (item) => (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    item.eventCount >= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.eventCount}
                  </span>
                ),
              },
              { key: 'linkedCapaCount', header: 'Linked CAPAs', align: 'center' },
              { 
                key: 'lastEvent', 
                header: 'Last Event',
                render: (item) => <DateCell date={item.lastEvent} format="short" />,
              },
            ]}
            pageSize={5}
            loading={loading}
            emptyMessage="No repeat incidents found - CAPAs are working!"
            exportable
            onExport={() => console.log('Export repeat incidents')}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Preventive vs Corrective */}
          <DistributionChart
            title="Preventive vs Corrective Ratio"
            subtitle="CAPA type distribution"
            data={capaTypeDistribution}
            type="donut"
            height={250}
            centerValue={allCapas.length}
            centerLabel="Total CAPAs"
            loading={loading}
            tooltip="A higher preventive ratio indicates proactive safety management"
          />

          {/* Avg Time by Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Average Time to Close by Type</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Preventive</span>
                  <span className="text-sm font-semibold text-gray-900">{avgTimeByType.preventive} days</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.min((avgTimeByType.preventive / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Corrective</span>
                  <span className="text-sm font-semibold text-gray-900">{avgTimeByType.corrective} days</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((avgTimeByType.corrective / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overdue CAPAs by Owner */}
          <RankedList
            title="Overdue CAPAs by Owner"
            subtitle="Action items requiring attention"
            items={capasByOwner
              .filter(owner => owner.overdue > 0)
              .map(owner => ({
                id: owner.ownerId,
                label: owner.ownerName,
                value: owner.overdue,
                secondaryValue: owner.total,
                secondaryLabel: 'total',
                badge: owner.overdue >= 3 ? { text: 'High', color: 'danger' } : undefined,
              }))}
            maxItems={5}
            showRank
            valueLabel="overdue"
            loading={loading}
            emptyMessage="No overdue CAPAs - great job!"
          />

          {/* CAPA Status Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Summary</h3>
            <div className="space-y-2">
              {(Object.keys(CAPA_STATUS_LABELS) as CapaStatus[]).map(status => {
                const count = filteredCapas.filter(c => c.status === status).length;
                const percentage = filteredCapas.length > 0 
                  ? Math.round((count / filteredCapas.length) * 100) 
                  : 0;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{CAPA_STATUS_LABELS[status]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                      <span className="text-xs text-gray-400">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
