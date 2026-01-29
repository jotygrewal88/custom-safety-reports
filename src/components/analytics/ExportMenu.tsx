'use client';

import React, { useState } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface ExportMenuProps {
  dashboardName?: string;
  className?: string;
}

export function ExportMenu({ dashboardName = 'Analytics', className = '' }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { filteredEvents, filteredCapas, filteredWorkOrders, timeRange } = useAnalytics();

  const exportToCSV = (data: object[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = (row as Record<string, unknown>)[header];
          // Escape commas and quotes in values
          const stringValue = String(value ?? '');
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportEvents = () => {
    const exportData = filteredEvents.map(event => ({
      ID: event.id,
      Title: event.title,
      Classification: event.classification,
      Severity: event.severity,
      Status: event.status,
      Site: event.siteName,
      Location: event.locationName || '',
      'Hazard Category': event.hazardCategory || '',
      'Event Date': event.eventDate,
      Reporter: event.reporterName,
      Asset: event.assetName || '',
      'OSHA Recordable': event.oshaRecordable ? 'Yes' : 'No',
      'Created At': event.createdAt,
    }));
    exportToCSV(exportData, 'safety_events');
  };

  const exportCAPAs = () => {
    const exportData = filteredCapas.map(capa => ({
      ID: capa.id,
      Title: capa.title,
      Type: capa.type,
      Status: capa.status,
      Priority: capa.priority,
      Owner: capa.ownerName,
      Site: capa.siteName,
      'Created Date': capa.createdDate,
      'Due Date': capa.dueDate,
      'Closed Date': capa.closedDate || '',
      'Linked Events': capa.linkedEventIds.join('; '),
    }));
    exportToCSV(exportData, 'capas');
  };

  const exportWorkOrders = () => {
    const exportData = filteredWorkOrders.map(wo => ({
      ID: wo.id,
      Title: wo.title,
      Status: wo.status,
      Priority: wo.priority,
      Type: wo.workOrderType,
      Site: wo.siteName,
      Location: wo.locationName || '',
      Asset: wo.assetName || '',
      Assignee: wo.assigneeName || '',
      'Created Date': wo.createdDate,
      'Due Date': wo.dueDate || '',
      'Completed Date': wo.completedDate || '',
    }));
    exportToCSV(exportData, 'work_orders');
  };

  const printDashboard = () => {
    window.print();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase">Export Data as CSV</p>
            </div>
            
            <button
              onClick={exportEvents}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Safety Events ({filteredEvents.length})
            </button>
            
            <button
              onClick={exportCAPAs}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              CAPAs ({filteredCapas.length})
            </button>
            
            <button
              onClick={exportWorkOrders}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Work Orders ({filteredWorkOrders.length})
            </button>

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={printDashboard}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Dashboard
              </button>
            </div>

            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
              Showing data for: {timeRange === 'ytd' ? 'Year to Date' : timeRange}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
