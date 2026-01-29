'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnalyticsProvider } from '../../src/contexts/AnalyticsContext';
import Sidebar from '../../src/components/Sidebar';
import { FilterBar } from '../../src/components/analytics/FilterBar';
import { ExportMenu } from '../../src/components/analytics/ExportMenu';
import { DataConfidence } from '../../src/components/analytics/DataConfidence';

const DASHBOARD_TABS = [
  { name: 'Daily Triage', href: '/analytics/safety-manager', description: 'What needs attention right now' },
  { name: 'Performance', href: '/analytics/executive', description: 'Compliance metrics and KPIs' },
  { name: 'CAPA Effectiveness', href: '/analytics/capa-effectiveness', description: 'Action tracking' },
  { name: 'Operational', href: '/analytics/operational', description: 'EHS × CMMS' },
];

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentTab = DASHBOARD_TABS.find(tab => pathname === tab.href) || DASHBOARD_TABS[0];

  return (
    <AnalyticsProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 ml-64">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            {/* Top bar */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics & Reporting</h1>
                <p className="text-sm text-gray-500">{currentTab.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <DataConfidence variant="tooltip" />
                <ExportMenu dashboardName={currentTab.name} />
              </div>
            </div>

            {/* Tab navigation */}
            <div className="px-6 flex items-center border-t border-gray-100">
              <nav className="flex -mb-px">
                {DASHBOARD_TABS.map((tab) => {
                  const isActive = pathname === tab.href;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`
                        px-4 py-3 text-sm font-medium border-b-2 transition-colors
                        ${isActive
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      {tab.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Filter bar */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <FilterBar compact />
            </div>
          </div>

          {/* Dashboard content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AnalyticsProvider>
  );
}
