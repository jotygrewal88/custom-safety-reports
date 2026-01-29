'use client';

import React, { useMemo } from 'react';
import { useAnalytics } from '../../../src/contexts/AnalyticsContext';
import { KPITile } from '../../../src/components/widgets/KPITile';
import { KPIGrid } from '../../../src/components/widgets/WidgetCard';
import { RankedList } from '../../../src/components/widgets/RankedList';
import { DistributionChart } from '../../../src/components/widgets/DistributionChart';
import { DataTable, DateCell, StatusCell } from '../../../src/components/widgets/DataTable';
import { WORK_ORDER_STATUS_LABELS, WorkOrderStatus, Severity } from '../../../src/types/analytics';

export default function OperationalDashboard() {
  const {
    filteredWorkOrders,
    filteredEvents,
    allAssets,
    loading,
  } = useAnalytics();

  // Work orders by status
  const workOrdersByStatus = useMemo(() => {
    return filteredWorkOrders.reduce((acc, wo) => {
      acc[wo.status] = (acc[wo.status] || 0) + 1;
      return acc;
    }, {} as Record<WorkOrderStatus, number>);
  }, [filteredWorkOrders]);

  // Work orders completed this week/month
  const completedWorkOrders = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = filteredWorkOrders.filter(wo => 
      wo.completedDate && new Date(wo.completedDate) >= weekAgo
    ).length;

    const thisMonth = filteredWorkOrders.filter(wo => 
      wo.completedDate && new Date(wo.completedDate) >= monthAgo
    ).length;

    return { thisWeek, thisMonth };
  }, [filteredWorkOrders]);

  // Assets with highest incident + WO density
  const assetDensity = useMemo(() => {
    const assetMetrics = allAssets.map(asset => {
      const eventCount = filteredEvents.filter(e => e.assetId === asset.id).length;
      const woCount = filteredWorkOrders.filter(wo => wo.assetId === asset.id).length;
      
      return {
        ...asset,
        eventCount,
        woCount,
        totalDensity: eventCount + woCount,
      };
    }).filter(a => a.totalDensity > 0);

    return assetMetrics.sort((a, b) => b.totalDensity - a.totalDensity);
  }, [allAssets, filteredEvents, filteredWorkOrders]);

  // Incident to Work Order creation lag
  const creationLag = useMemo(() => {
    const linkedWorkOrders = filteredWorkOrders.filter(wo => wo.linkedEventId);
    
    if (linkedWorkOrders.length === 0) return { avgDays: 0, count: 0, breakdown: [] };

    const lags = linkedWorkOrders.map(wo => {
      const event = filteredEvents.find(e => e.id === wo.linkedEventId);
      if (!event) return null;
      
      const eventDate = new Date(event.eventDate);
      const woCreatedDate = new Date(wo.createdDate);
      const lagDays = (woCreatedDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);
      
      return {
        woId: wo.id,
        eventId: event.id,
        lagDays: Math.max(0, Math.round(lagDays)),
        eventTitle: event.title,
        woTitle: wo.title,
      };
    }).filter(Boolean) as Array<{ woId: string; eventId: string; lagDays: number; eventTitle: string; woTitle: string }>;

    const avgDays = lags.length > 0 
      ? Math.round(lags.reduce((sum, l) => sum + l.lagDays, 0) / lags.length)
      : 0;

    // Breakdown by lag range
    const breakdown = [
      { label: 'Same Day', count: lags.filter(l => l.lagDays === 0).length },
      { label: '1-2 Days', count: lags.filter(l => l.lagDays >= 1 && l.lagDays <= 2).length },
      { label: '3-7 Days', count: lags.filter(l => l.lagDays >= 3 && l.lagDays <= 7).length },
      { label: '7+ Days', count: lags.filter(l => l.lagDays > 7).length },
    ];

    return { avgDays, count: lags.length, breakdown };
  }, [filteredWorkOrders, filteredEvents]);

  // Status distribution for chart
  const statusDistribution = useMemo(() => {
    const colors: Record<WorkOrderStatus, string> = {
      open: '#3b82f6',
      in_progress: '#f59e0b',
      completed: '#22c55e',
      cancelled: '#6b7280',
    };

    return (Object.keys(WORK_ORDER_STATUS_LABELS) as WorkOrderStatus[]).map(status => ({
      name: WORK_ORDER_STATUS_LABELS[status],
      value: workOrdersByStatus[status] || 0,
      color: colors[status],
    })).filter(item => item.value > 0);
  }, [workOrdersByStatus]);

  // Recent work orders for table
  const recentWorkOrders = useMemo(() => {
    return [...filteredWorkOrders]
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 20);
  }, [filteredWorkOrders]);

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Summary */}
      <KPIGrid columns={5}>
        <KPITile
          label="Total Work Orders"
          value={filteredWorkOrders.length}
          color="default"
          size="lg"
        />
        <KPITile
          label="Open"
          value={workOrdersByStatus.open || 0}
          color="info"
          size="lg"
        />
        <KPITile
          label="In Progress"
          value={workOrdersByStatus.in_progress || 0}
          color="warning"
          size="lg"
        />
        <KPITile
          label="Completed This Week"
          value={completedWorkOrders.thisWeek}
          color={completedWorkOrders.thisWeek > 0 ? 'success' : 'default'}
          size="lg"
        />
        <KPITile
          label="Avg. Response Time"
          value={creationLag.avgDays}
          suffix=" days"
          color={creationLag.avgDays <= 1 ? 'success' : creationLag.avgDays <= 3 ? 'warning' : 'danger'}
          size="lg"
        />
      </KPIGrid>

      {/* Row 2: Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Orders Table */}
          <DataTable
            title="Safety Work Orders"
            subtitle="Recent work orders by status"
            data={recentWorkOrders.map(wo => ({
              id: wo.id,
              title: wo.title,
              status: wo.status,
              priority: wo.priority,
              assetName: wo.assetName || 'N/A',
              siteName: wo.siteName,
              assignee: wo.assigneeName || 'Unassigned',
              createdDate: wo.createdDate,
              dueDate: wo.dueDate,
            }))}
            columns={[
              { 
                key: 'id', 
                header: 'ID',
                width: '80px',
                render: (item) => (
                  <span className="text-xs font-mono text-gray-600">{item.id}</span>
                ),
              },
              { key: 'title', header: 'Title', sortable: true },
              { 
                key: 'status', 
                header: 'Status',
                width: '100px',
                render: (item) => {
                  const statusColors: Record<WorkOrderStatus, string> = {
                    open: 'bg-blue-100 text-blue-800',
                    in_progress: 'bg-yellow-100 text-yellow-800',
                    completed: 'bg-green-100 text-green-800',
                    cancelled: 'bg-gray-100 text-gray-800',
                  };
                  return (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[item.status as WorkOrderStatus]}`}>
                      {WORK_ORDER_STATUS_LABELS[item.status as WorkOrderStatus]}
                    </span>
                  );
                },
              },
              { 
                key: 'priority', 
                header: 'Priority',
                width: '80px',
                render: (item) => {
                  const priorityColors: Record<Severity, string> = {
                    critical: 'bg-red-100 text-red-800',
                    high: 'bg-orange-100 text-orange-800',
                    medium: 'bg-yellow-100 text-yellow-800',
                    low: 'bg-green-100 text-green-800',
                  };
                  return (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${priorityColors[item.priority as Severity]}`}>
                      {(item.priority as string).charAt(0).toUpperCase() + (item.priority as string).slice(1)}
                    </span>
                  );
                },
              },
              { key: 'assetName', header: 'Asset' },
              { key: 'assignee', header: 'Assignee' },
              { 
                key: 'createdDate', 
                header: 'Created',
                render: (item) => <DateCell date={item.createdDate} format="short" />,
              },
            ]}
            pageSize={8}
            loading={loading}
            exportable
            onExport={() => console.log('Export work orders')}
          />

          {/* Incident to WO Creation Lag */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Incident → Work Order Response Time</h3>
                <p className="text-xs text-gray-500">Time between safety event and work order creation</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{creationLag.avgDays} days</p>
                <p className="text-xs text-gray-500">average from {creationLag.count} linked WOs</p>
              </div>
            </div>
            <div className="flex gap-4">
              {creationLag.breakdown.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  <p className="text-lg font-semibold text-gray-900">{item.count}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${creationLag.count > 0 ? (item.count / creationLag.count) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Work Orders by Status */}
          <DistributionChart
            title="Work Orders by Status"
            subtitle="Current distribution"
            data={statusDistribution}
            type="donut"
            height={250}
            centerValue={filteredWorkOrders.length}
            centerLabel="Total WOs"
            loading={loading}
          />

          {/* Assets with Highest Density */}
          <RankedList
            title="Assets with Highest Activity"
            subtitle="Combined incidents + work orders"
            items={assetDensity.slice(0, 10).map(asset => ({
              id: asset.id,
              label: asset.name,
              value: asset.totalDensity,
              metadata: `${asset.eventCount} events · ${asset.woCount} WOs`,
              badge: asset.eventCount >= 3 ? { text: 'High Risk', color: 'danger' } : undefined,
            }))}
            maxItems={5}
            showRank
            valueLabel="total"
            loading={loading}
            emptyMessage="No asset activity recorded"
          />

          {/* Completion Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Completion Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed This Week</span>
                <span className={`text-sm font-semibold ${completedWorkOrders.thisWeek > 0 ? 'text-green-600' : 'text-gray-500'}`}>{completedWorkOrders.thisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed This Month</span>
                <span className={`text-sm font-semibold ${completedWorkOrders.thisMonth > 0 ? 'text-green-600' : 'text-gray-500'}`}>{completedWorkOrders.thisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  {filteredWorkOrders.length > 0 
                    ? Math.round(((workOrdersByStatus.completed || 0) / filteredWorkOrders.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-sm font-semibold text-gray-500">{workOrdersByStatus.cancelled || 0}</span>
              </div>
            </div>
          </div>

          {/* Work Order Types */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">By Work Order Type</h3>
            <div className="space-y-2">
              {(['corrective', 'preventive', 'inspection', 'emergency'] as const).map(type => {
                const count = filteredWorkOrders.filter(wo => wo.workOrderType === type).length;
                const percentage = filteredWorkOrders.length > 0 
                  ? Math.round((count / filteredWorkOrders.length) * 100) 
                  : 0;
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{type}</span>
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
