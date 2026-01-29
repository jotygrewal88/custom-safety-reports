'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Collapsible Section Component
function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
      >
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// Code Block Component
function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-4">
      {title && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg">
          {title}
        </div>
      )}
      <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono ${title ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

// Table Component
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Formula Component
function Formula({ title, formula, explanation }: { title: string; formula: string; explanation: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-blue-900 mb-2">{title}</h4>
      <div className="bg-white border border-blue-100 rounded p-3 font-mono text-sm mb-2">
        {formula}
      </div>
      <p className="text-sm text-blue-800">{explanation}</p>
    </div>
  );
}

// Dashboard Card Component
function DashboardCard({ 
  title, 
  route, 
  purpose, 
  widgets 
}: { 
  title: string; 
  route: string; 
  purpose: string; 
  widgets: string[];
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{route}</code>
      </div>
      <p className="text-sm text-gray-600 mb-3">{purpose}</p>
      <div className="flex flex-wrap gap-1">
        {widgets.map((widget, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {widget}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsReportingProductSpecs() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting Product Requirements</h1>
              <p className="text-sm text-gray-500 mt-1">Technical Documentation for Engineers</p>
            </div>
            <Link
              href="/analytics"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex gap-4 text-sm overflow-x-auto">
            <a href="#executive-summary" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Executive Summary</a>
            <a href="#architecture" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Architecture</a>
            <a href="#data-models" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Data Models</a>
            <a href="#calculations" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Calculations</a>
            <a href="#dashboards" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Dashboards</a>
            <a href="#components" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Components</a>
            <a href="#context-hooks" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Context & Hooks</a>
            <a href="#filtering" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Filtering</a>
            <a href="#export" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Export</a>
            <a href="#technical-specs" className="text-blue-600 hover:text-blue-800 whitespace-nowrap">Technical Specs</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Executive Summary */}
        <section id="executive-summary">
          <CollapsibleSection title="1. Executive Summary">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Module Purpose</h3>
              <p className="text-gray-700 mb-4">
                The Analytics & Reporting module provides <strong>proactive safety analytics and compliance reporting</strong> for 
                EHS (Environment, Health, and Safety) organizations. It transforms raw safety event data into actionable insights 
                through 4 specialized dashboards, each targeting different user personas and use cases.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">OSHA Compliance</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>- TRIR (Total Recordable Incident Rate)</li>
                    <li>- DART Rate calculation</li>
                    <li>- OSHA 300/300A summaries</li>
                    <li>- Quarterly trend tracking</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Real-time Filtering</h4>
                  <ul className="text-sm text-green-800 mt-2 space-y-1">
                    <li>- Time range presets & custom dates</li>
                    <li>- Multi-site filtering</li>
                    <li>- Severity and classification filters</li>
                    <li>- Hazard category selection</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">CAPA Tracking</h4>
                  <ul className="text-sm text-purple-800 mt-2 space-y-1">
                    <li>- Corrective vs Preventive analysis</li>
                    <li>- Effectiveness verification</li>
                    <li>- Overdue tracking by owner</li>
                    <li>- Repeat incident detection</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900">AI Insights</h4>
                  <ul className="text-sm text-orange-800 mt-2 space-y-1">
                    <li>- What Changed summaries</li>
                    <li>- Why It Matters analysis</li>
                    <li>- Recommended Actions</li>
                    <li>- Follow-up prompts</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Users</h3>
              <Table
                headers={['User Role', 'Primary Dashboard', 'Key Metrics']}
                rows={[
                  ['Safety Managers', 'Daily Triage', 'Open events, trending hazards, OSHA watchlist'],
                  ['Executives', 'Performance', 'TRIR, DART, compliance coverage, risk hotspots'],
                  ['CAPA Owners', 'CAPA Effectiveness', 'Avg close time, overdue count, preventive ratio'],
                  ['Operations Teams', 'Operational', 'Work orders, response times, asset activity'],
                ]}
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Dashboard Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard
                  title="Daily Triage"
                  route="/analytics/safety-manager"
                  purpose="What needs attention right now"
                  widgets={['Open Events', 'Trending Hazards', 'CAPA Alerts', 'OSHA Watchlist']}
                />
                <DashboardCard
                  title="Performance"
                  route="/analytics/executive"
                  purpose="Compliance metrics and KPIs for leadership"
                  widgets={['TRIR/DART', 'Risk Hotspots', 'Compliance Coverage', 'Period Summary']}
                />
                <DashboardCard
                  title="CAPA Effectiveness"
                  route="/analytics/capa-effectiveness"
                  purpose="Track corrective/preventive action effectiveness"
                  widgets={['Avg Close Time', 'Repeat Incidents', 'Overdue by Owner', 'Status Breakdown']}
                />
                <DashboardCard
                  title="Operational"
                  route="/analytics/operational"
                  purpose="EHS x CMMS integration"
                  widgets={['Work Orders', 'Response Time', 'Asset Activity', 'Completion Rates']}
                />
              </div>
            </div>
          </CollapsibleSection>
        </section>

        {/* Architecture Overview */}
        <section id="architecture">
          <CollapsibleSection title="2. Architecture Overview">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Architecture</h3>
            
            {/* Architecture Diagram */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex flex-col items-center">
                {/* Layout */}
                <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium mb-4">
                  app/analytics/layout.tsx
                </div>
                
                <div className="w-px h-4 bg-gray-400"></div>
                
                {/* Dashboard Pages */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  <div className="bg-blue-100 border-2 border-blue-300 px-3 py-2 rounded text-xs text-center">
                    safety-manager<br/><span className="text-gray-500">Daily Triage</span>
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 px-3 py-2 rounded text-xs text-center">
                    executive<br/><span className="text-gray-500">Performance</span>
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 px-3 py-2 rounded text-xs text-center">
                    capa-effectiveness<br/><span className="text-gray-500">CAPA</span>
                  </div>
                  <div className="bg-blue-100 border-2 border-blue-300 px-3 py-2 rounded text-xs text-center">
                    operational<br/><span className="text-gray-500">EHS x CMMS</span>
                  </div>
                </div>

                <div className="w-px h-4 bg-gray-400 mt-4"></div>
                
                {/* Widget Components */}
                <div className="text-xs text-gray-500 mt-2 mb-2">Reusable Widgets</div>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">KPITile</div>
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">TrendChart</div>
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">Distribution</div>
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">RankedList</div>
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">DataTable</div>
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">AlertList</div>
                  <div className="bg-white border-2 border-green-200 px-2 py-1 rounded text-xs text-center">AIInsight</div>
                </div>

                <div className="w-px h-4 bg-gray-400 mt-4"></div>

                {/* Analytics Components */}
                <div className="text-xs text-gray-500 mt-2 mb-2">Analytics Components</div>
                <div className="flex gap-3">
                  <div className="bg-white border-2 border-purple-200 px-3 py-1 rounded text-xs">FilterBar</div>
                  <div className="bg-white border-2 border-purple-200 px-3 py-1 rounded text-xs">ExportMenu</div>
                  <div className="bg-white border-2 border-purple-200 px-3 py-1 rounded text-xs">DataConfidence</div>
                </div>

                <div className="w-px h-4 bg-gray-400 mt-4"></div>

                {/* Context Layer */}
                <div className="flex gap-4 mt-2">
                  <div className="bg-yellow-100 border border-yellow-300 px-4 py-2 rounded text-sm font-medium">
                    AnalyticsContext
                  </div>
                </div>

                <div className="w-px h-4 bg-gray-400 mt-4"></div>

                {/* Data Layer */}
                <div className="flex gap-4 mt-2">
                  <div className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-xs">analyticsData.ts</div>
                  <div className="bg-gray-200 border border-gray-400 px-3 py-1 rounded text-xs">analytics.ts (types)</div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">File Structure</h3>
            <CodeBlock title="Directory Structure">{`app/
└── analytics/
    ├── layout.tsx              # Shared layout with tabs, filters, export
    ├── page.tsx                # Redirects to /safety-manager
    ├── safety-manager/
    │   └── page.tsx            # Daily Triage dashboard
    ├── executive/
    │   └── page.tsx            # Performance dashboard
    ├── capa-effectiveness/
    │   └── page.tsx            # CAPA Effectiveness dashboard
    └── operational/
        └── page.tsx            # Operational dashboard

src/
├── components/
│   ├── widgets/
│   │   ├── WidgetCard.tsx      # Base container component
│   │   ├── KPITile.tsx         # KPI display with trends
│   │   ├── TrendChart.tsx      # Line/bar/area charts
│   │   ├── DistributionChart.tsx # Donut/pie charts
│   │   ├── RankedList.tsx      # Ranked items with bars
│   │   ├── DataTable.tsx       # Sortable paginated table
│   │   └── AIInsightCard.tsx   # AI summary component
│   └── analytics/
│       ├── FilterBar.tsx       # Global filter controls
│       ├── ExportMenu.tsx      # CSV/print export
│       └── DataConfidence.tsx  # Data quality indicator
├── contexts/
│   └── AnalyticsContext.tsx    # State management & hooks
├── types/
│   └── analytics.ts            # TypeScript interfaces
└── data/
    └── analyticsData.ts        # Mock data & helpers`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Data Flow</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ol className="text-sm text-gray-700 space-y-2">
                <li><strong>1. Data Source:</strong> Mock data loaded from analyticsData.ts (60 events, 35 CAPAs, 45 work orders)</li>
                <li><strong>2. Context Provider:</strong> AnalyticsProvider wraps all dashboard pages, manages filter state</li>
                <li><strong>3. Filter Application:</strong> Date range → Site → Severity → Classification → Hazard filters applied in order</li>
                <li><strong>4. Computed Metrics:</strong> useMemo calculates aggregations (by severity, site, status, etc.)</li>
                <li><strong>5. Custom Hooks:</strong> Specialized hooks (useOSHAMetrics, useCAPAEffectiveness) provide derived data</li>
                <li><strong>6. Widget Rendering:</strong> Dashboard pages compose widgets with filtered/computed data</li>
              </ol>
            </div>
          </CollapsibleSection>
        </section>

        {/* Data Models */}
        <section id="data-models">
          <CollapsibleSection title="3. Data Models">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AnalyticsSafetyEvent</h3>
            <p className="text-gray-600 mb-4">
              The primary event interface with 25+ fields supporting OSHA tracking, asset linkage, and AI confidence scoring.
            </p>
            
            <CodeBlock title="src/types/analytics.ts">{`interface AnalyticsSafetyEvent {
  // Core Identification
  id: string;
  title: string;
  description: string;
  
  // Classification & Status
  classification: EventClassification;  // incident | near_miss | hazard | observation | unsafe_condition
  severity: Severity;                   // critical | high | medium | low
  status: EventStatus;                  // open | in_review | closed
  eventDate: string;                    // ISO date
  
  // Location
  siteId: string;
  siteName: string;
  locationId: string;
  locationName: string;
  department?: string;
  
  // Categorization
  hazardCategory: HazardCategory;       // 12 categories (slip_trip_fall, struck_by, etc.)
  templateId?: string;
  templateName?: string;
  
  // Asset Linkage
  assetId?: string;
  assetName?: string;
  
  // People
  reporterId: string;
  reporterName: string;
  assigneeId?: string;
  assigneeName?: string;
  
  // OSHA Tracking
  oshaRecordable: boolean;
  oshaReportable?: boolean;
  daysAway?: number;                    // Days away from work
  restrictedDays?: number;              // Days on restricted duty
  
  // Linkages
  linkedCapaIds: string[];
  linkedWorkOrderIds: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  
  // AI
  aiConfidenceScore?: number;           // 0-100 extraction confidence
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">CAPA (Corrective & Preventive Action)</h3>
            <CodeBlock title="src/types/analytics.ts">{`interface CAPA {
  id: string;
  title: string;
  description: string;
  
  // Type & Status
  type: CapaType;                       // corrective | preventive
  status: CapaStatus;                   // open | in_progress | pending_review | closed
  priority: Severity;
  
  // Ownership
  ownerId: string;
  ownerName: string;
  assignedById?: string;
  assignedByName?: string;
  
  // Location
  siteId: string;
  siteName: string;
  
  // Dates
  createdDate: string;
  dueDate: string;
  closedDate?: string;
  
  // Linkages
  linkedEventIds: string[];
  linkedWorkOrderIds: string[];
  
  // Effectiveness
  rootCause?: string;
  effectivenessVerified?: boolean;
  effectivenessVerifiedDate?: string;
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">SafetyWorkOrder</h3>
            <CodeBlock title="src/types/analytics.ts">{`interface SafetyWorkOrder {
  id: string;
  title: string;
  description: string;
  
  // Status & Priority
  status: WorkOrderStatus;              // open | in_progress | completed | cancelled
  priority: Severity;
  workOrderType: WorkOrderType;         // corrective | preventive | inspection | emergency
  
  // Asset & Location
  assetId?: string;
  assetName?: string;
  siteId: string;
  siteName: string;
  locationId?: string;
  locationName?: string;
  
  // Ownership
  assigneeId?: string;
  assigneeName?: string;
  createdById: string;
  createdByName: string;
  
  // Dates
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  
  // Linkages
  linkedEventId?: string;
  linkedCapaId?: string;
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">OSHA Data Models</h3>
            <p className="text-gray-600 mb-4">
              OSHA compliance tracking follows the 300/300A log structure with quarterly aggregations.
            </p>
            
            <CodeBlock title="src/types/analytics.ts">{`// Individual OSHA 300 Log Entry
interface OSHA300Entry {
  id: string;
  oshaLocationId: string;
  caseNumber: string;
  
  // Employee Info
  employeeName: string;
  jobTitle: string;
  dateOfInjury: string;
  whereOccurred: string;
  description: string;
  
  // Classification (mutually exclusive)
  death: boolean;
  daysAwayFromWork: boolean;
  jobTransferOrRestriction: boolean;
  otherRecordableCase: boolean;
  
  // Days
  daysAway: number;
  daysRestricted: number;
  
  // Injury Type
  injuryType: 'injury' | 'skin_disorder' | 'respiratory' | 'poisoning' | 'hearing_loss' | 'other';
  
  linkedEventId?: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
}

// Annual OSHA 300A Summary
interface OSHA300ASummary {
  id: string;
  oshaLocationId: string;
  year: number;
  
  // Establishment
  establishmentName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  industry: string;
  naicsCode: string;
  
  // Employment
  annualAverageEmployees: number;
  totalHoursWorked: number;
  
  // Injury Totals
  totalDeaths: number;
  totalDaysAwayFromWork: number;
  totalJobTransferOrRestriction: number;
  totalOtherRecordableCases: number;
  
  // Days Totals
  totalDaysAway: number;
  totalDaysRestricted: number;
  
  // Calculated Rates
  trir: number;                         // Total Recordable Incident Rate
  dart: number;                         // Days Away, Restricted, Transferred
  ltir: number;                         // Lost Time Incident Rate
}

// Quarterly Summary for Trending
interface OSHAQuarterlySummary {
  oshaLocationId: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  recordableCount: number;
  dartCount: number;
  hoursWorked: number;
  daysAway: number;
  daysRestricted: number;
  trir: number;
  dart: number;
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Enums & Constants</h3>
            <CodeBlock title="src/types/analytics.ts">{`// Event Classification
type EventClassification = 
  | 'incident'           // Actual injury/damage (lagging)
  | 'near_miss'          // Almost happened (leading)
  | 'hazard'             // Identified risk (leading)
  | 'observation'        // Safety observation (leading)
  | 'unsafe_condition';  // Hazardous condition (leading)

// Severity Levels
type Severity = 'critical' | 'high' | 'medium' | 'low';

// Event Status
type EventStatus = 'open' | 'in_review' | 'closed';

// CAPA Types & Status
type CapaType = 'corrective' | 'preventive';
type CapaStatus = 'open' | 'in_progress' | 'pending_review' | 'closed';

// Work Order Status & Type
type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
type WorkOrderType = 'corrective' | 'preventive' | 'inspection' | 'emergency';

// Hazard Categories (12 total)
type HazardCategory = 
  | 'slip_trip_fall'
  | 'struck_by'
  | 'caught_in'
  | 'electrical'
  | 'chemical'
  | 'ergonomic'
  | 'fire'
  | 'machine_guarding'
  | 'ppe'
  | 'housekeeping'
  | 'environmental'
  | 'other';`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">Data Relationships</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-700 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">Event → CAPA</span>
                  <span>Events link to CAPAs via linkedCapaIds[] (one-to-many)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">Event → Work Order</span>
                  <span>Events link to Work Orders via linkedWorkOrderIds[] (one-to-many)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">CAPA → Work Order</span>
                  <span>CAPAs link to Work Orders via linkedWorkOrderIds[] (one-to-many)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">Event → Asset</span>
                  <span>Events optionally link to Assets via assetId (many-to-one)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">Event → OSHA 300</span>
                  <span>OSHA recordable events create OSHA300Entry via linkedEventId</span>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </section>

        {/* Calculation Methods */}
        <section id="calculations">
          <CollapsibleSection title="4. Calculation Methods">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">OSHA Metrics</h3>
            
            <Formula
              title="TRIR (Total Recordable Incident Rate)"
              formula="TRIR = (Total Recordables × 200,000) / Total Hours Worked"
              explanation="Where Total Recordables = Deaths + Days Away From Work cases + Job Transfer/Restriction cases + Other Recordable Cases. The 200,000 factor represents 100 employees working 40 hours/week for 50 weeks."
            />
            
            <Formula
              title="DART Rate (Days Away, Restricted, or Transferred)"
              formula="DART = (DART Cases × 200,000) / Total Hours Worked"
              explanation="Where DART Cases = Days Away From Work cases + Job Transfer/Restriction cases. DART is a subset of TRIR focusing on more severe injuries."
            />

            <CodeBlock title="src/contexts/AnalyticsContext.tsx - useOSHAMetrics()">{`const useOSHAMetrics = () => {
  return useMemo(() => {
    // Aggregate across all OSHA 300A summaries
    const totals = osha300ASummaries.reduce((acc, summary) => ({
      recordables: acc.recordables + 
        summary.totalDaysAwayFromWork + 
        summary.totalJobTransferOrRestriction + 
        summary.totalOtherRecordableCases,
      hours: acc.hours + summary.totalHoursWorked,
      dart: acc.dart + 
        summary.totalDaysAwayFromWork + 
        summary.totalJobTransferOrRestriction,
    }), { recordables: 0, hours: 0, dart: 0 });

    // Calculate rates (guard against division by zero)
    const trir = totals.hours > 0 
      ? (totals.recordables * 200000) / totals.hours 
      : 0;
    const dartRate = totals.hours > 0 
      ? (totals.dart * 200000) / totals.hours 
      : 0;

    return {
      trir: trir.toFixed(2),
      dart: dartRate.toFixed(2),
      totalRecordables: totals.recordables,
      totalHoursWorked: totals.hours,
      quarterlySummaries: oshaQuarterlySummaries,
    };
  }, [osha300ASummaries, oshaQuarterlySummaries]);
};`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">CAPA Effectiveness Metrics</h3>
            
            <Formula
              title="Average Time to Close"
              formula="Avg Close Time = Σ(closedDate - createdDate) / Number of Closed CAPAs"
              explanation="Calculated in days. Only includes CAPAs with status='closed' and a valid closedDate. Indicates the organization's responsiveness to identified issues."
            />
            
            <Formula
              title="Preventive Ratio"
              formula="Preventive Ratio = (Preventive CAPAs / Total CAPAs) × 100"
              explanation="Higher ratios indicate proactive safety culture. Target: ≥40% preventive actions. Organizations with high preventive ratios tend to have fewer incidents."
            />

            <CodeBlock title="src/contexts/AnalyticsContext.tsx - useCAPAEffectiveness()">{`const useCAPAEffectiveness = () => {
  return useMemo(() => {
    const closedCapas = filteredCapas.filter(
      c => c.status === 'closed' && c.closedDate
    );
    
    // Calculate average time to close in days
    let totalDays = 0;
    closedCapas.forEach(c => {
      const created = new Date(c.createdDate);
      const closed = new Date(c.closedDate!);
      totalDays += (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    });
    const avgTimeToClose = closedCapas.length > 0 
      ? Math.round(totalDays / closedCapas.length) 
      : 0;

    // Count by type
    const preventiveCount = filteredCapas.filter(c => c.type === 'preventive').length;
    const correctiveCount = filteredCapas.filter(c => c.type === 'corrective').length;
    
    // Calculate ratio
    const total = filteredCapas.length;
    const preventiveRatio = total > 0 
      ? Math.round((preventiveCount / total) * 100) 
      : 0;

    return {
      avgTimeToClose,
      preventiveCount,
      correctiveCount,
      preventiveRatio,
      closedCount: closedCapas.length,
      openCount: filteredCapas.filter(c => c.status !== 'closed').length,
    };
  }, [filteredCapas]);
};`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Trend Data Aggregation</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-yellow-900 mb-2">Aggregation Rules</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>- <strong>Daily aggregation:</strong> Used for time periods ≤30 days</li>
                <li>- <strong>Weekly aggregation:</strong> Used for time periods &gt;30 days (grouped by 7-day slices)</li>
                <li>- <strong>Date format:</strong> &quot;MMM DD&quot; (e.g., &quot;Jan 15&quot;)</li>
              </ul>
            </div>

            <CodeBlock title="src/contexts/AnalyticsContext.tsx - eventTrendData">{`const eventTrendData = useMemo(() => {
  const days = Math.ceil(
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) 
    / (1000 * 60 * 60 * 24)
  );
  
  // Generate daily data points
  const dailyData: TrendDataPoint[] = [];
  for (let i = 0; i <= days; i++) {
    const date = new Date(dateRange.startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const created = filteredEvents.filter(e => 
      e.eventDate.split('T')[0] === dateStr
    ).length;
    
    const closed = filteredEvents.filter(e => 
      e.closedAt && e.closedAt.split('T')[0] === dateStr
    ).length;
    
    dailyData.push({
      date: formatDate(date),  // "MMM DD"
      count: created,
      created,
      closed,
    });
  }
  
  // Aggregate to weekly if > 30 days
  if (days > 30) {
    const weeklyData: TrendDataPoint[] = [];
    for (let i = 0; i < dailyData.length; i += 7) {
      const slice = dailyData.slice(i, i + 7);
      weeklyData.push({
        date: slice[0].date,
        count: slice.reduce((sum, d) => sum + d.count, 0),
        created: slice.reduce((sum, d) => sum + d.created, 0),
        closed: slice.reduce((sum, d) => sum + d.closed, 0),
      });
    }
    return weeklyData;
  }
  
  return dailyData;
}, [dateRange, filteredEvents]);`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Leading vs Lagging Indicators</h3>
            
            <Table
              headers={['Type', 'Classifications', 'Interpretation']}
              rows={[
                ['Leading (Proactive)', 'near_miss, hazard, observation, unsafe_condition', 'Predictive indicators that help prevent incidents'],
                ['Lagging (Reactive)', 'incident', 'After-the-fact indicators of actual harm/damage'],
              ]}
            />

            <CodeBlock title="src/data/analyticsData.ts">{`// Helper functions for indicator classification
export const isLeadingIndicator = (classification: EventClassification): boolean => {
  return ['near_miss', 'hazard', 'observation', 'unsafe_condition'].includes(classification);
};

export const isLaggingIndicator = (classification: EventClassification): boolean => {
  return classification === 'incident';
};

// Leading ratio calculation
const leadingCount = events.filter(e => isLeadingIndicator(e.classification)).length;
const laggingCount = events.filter(e => isLaggingIndicator(e.classification)).length;
const leadingRatio = (leadingCount / (leadingCount + laggingCount)) * 100;
// Target: ≥70% leading indicates strong proactive culture`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Data Confidence Scoring</h3>
            
            <CodeBlock title="src/data/analyticsData.ts - getDataConfidenceMetrics()">{`export const getDataConfidenceMetrics = (events: AnalyticsSafetyEvent[]) => {
  const total = events.length;
  if (total === 0) return defaultMetrics;
  
  return {
    // Percentage of events with severity assigned
    eventsWithSeverity: events.filter(e => e.severity).length,
    
    // Percentage of events with hazard category
    eventsWithHazardCategory: events.filter(e => e.hazardCategory).length,
    
    // Percentage of events linked to an asset
    eventsWithAssetLinkage: events.filter(e => e.assetId).length,
    
    // Percentage of events linked to a CAPA
    eventsWithCapaLinkage: events.filter(e => e.linkedCapaIds?.length > 0).length,
    
    totalEvents: total,
  };
};

// Overall confidence score (average of 4 metrics)
const overallScore = (
  (eventsWithSeverity / total) +
  (eventsWithHazardCategory / total) +
  (eventsWithAssetLinkage / total) +
  (eventsWithCapaLinkage / total)
) / 4 * 100;

// Color thresholds
// Green: ≥80%
// Yellow: ≥60%
// Red: <60%`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Color Coding Standards</h3>
            <Table
              headers={['Metric', 'Success (Green)', 'Warning (Yellow)', 'Danger (Red)']}
              rows={[
                ['TRIR', '≤ 2.5', '≤ 3.5', '> 3.5'],
                ['DART Rate', '≤ 1.5', '≤ 2.5', '> 2.5'],
                ['Avg Time to Close', '≤ 14 days', '≤ 21 days', '> 21 days'],
                ['Preventive Ratio', '≥ 40%', '≥ 25%', '< 25%'],
                ['Data Confidence', '≥ 80%', '≥ 60%', '< 60%'],
                ['Work Order Response', '≤ 1 day', '≤ 3 days', '> 3 days'],
              ]}
            />
          </CollapsibleSection>
        </section>

        {/* Dashboard Specifications */}
        <section id="dashboards">
          <CollapsibleSection title="5. Dashboard Specifications">
            
            {/* Daily Triage */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Triage Dashboard</h3>
                  <code className="text-xs text-gray-500">/analytics/safety-manager</code>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> What needs attention right now. Designed for Safety Managers to quickly identify and prioritize immediate actions.
              </p>
              
              <h4 className="font-medium text-gray-900 mb-2">Widget Layout</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-xs text-gray-500 mb-2">Row 1: KPI Summary</div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Events Today</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">This Week</div>
                  <div className="bg-red-50 border border-red-200 p-2 rounded text-xs text-center">Critical</div>
                  <div className="bg-orange-50 border border-orange-200 p-2 rounded text-xs text-center">High</div>
                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs text-center">Medium</div>
                  <div className="bg-green-50 border border-green-200 p-2 rounded text-xs text-center">Low</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">Row 2: Two-Column Layout</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Safety Events Trend (Bar Chart)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Trending Hazards (Ranked List)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Leading vs Lagging (Donut)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50 border border-red-200 p-2 rounded text-xs">High-Severity Events (Alert List)</div>
                    <div className="bg-orange-50 border border-orange-200 p-2 rounded text-xs">CAPAs Requiring Attention</div>
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs">OSHA Recordable Watchlist</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Assets with Repeated Events</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-4 mb-2">Row 3: AI Summary</div>
                <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs">AI Safety Summary (Collapsible)</div>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">Key Metrics & Data Sources</h4>
              <Table
                headers={['Widget', 'Data Source', 'Hook/Calculation']}
                rows={[
                  ['Events Today', 'filteredEvents', 'useEventsToday()'],
                  ['Events This Week', 'filteredEvents', 'useEventsThisWeek()'],
                  ['Open by Severity', 'filteredEvents', 'useOpenEventsBySeverity()'],
                  ['Trending Hazards', 'filteredEvents', 'useTrendingHazards(30)'],
                  ['High-Severity Events', 'filteredEvents', 'Filter: severity in [critical, high], last 7 days'],
                  ['CAPAs Attention', 'overdueCapas + dueSoonCapas', 'Context computed'],
                  ['OSHA Watchlist', 'filteredEvents', 'Filter: oshaRecordable = true'],
                  ['Repeated Assets', 'filteredEvents', 'useAssetsWithRepeatedEvents(2)'],
                ]}
              />
            </div>

            {/* Performance Dashboard */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Dashboard</h3>
                  <code className="text-xs text-gray-500">/analytics/executive</code>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> Compliance metrics and KPIs for leadership. Provides executive-level view of safety performance and regulatory compliance.
              </p>

              <h4 className="font-medium text-gray-900 mb-2">Widget Layout</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-xs text-gray-500 mb-2">Row 1: OSHA KPIs</div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-white border-2 border-green-200 p-2 rounded text-xs text-center">TRIR</div>
                  <div className="bg-white border-2 border-green-200 p-2 rounded text-xs text-center">DART Rate</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Total Recordables</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Hours Worked (K)</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">Row 2: Two-Column Layout</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Volume vs Closure Trend (Dual Line)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Risk Hotspots by Site (Ranked)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Severity Distribution (Donut)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Compliance Coverage (Progress Bars)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Period Summary Card</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-4 mb-2">Row 3: AI Summary</div>
                <div className="bg-green-50 border border-green-200 p-2 rounded text-xs">AI Executive Summary (Expanded by default)</div>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">Risk Hotspot Scoring</h4>
              <CodeBlock title="Risk Score Calculation">{`// Severity-weighted risk score per site
const riskScore = (
  (criticalCount * 10) +   // Critical events weighted 10x
  (highCount * 5) +        // High events weighted 5x
  (mediumCount * 2) +      // Medium events weighted 2x
  (lowCount * 1)           // Low events weighted 1x
);

// Sites sorted by riskScore descending
// Badge color: critical count > 0 = red, high count > 0 = orange`}</CodeBlock>
            </div>

            {/* CAPA Effectiveness */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">CAPA Effectiveness Dashboard</h3>
                  <code className="text-xs text-gray-500">/analytics/capa-effectiveness</code>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> Track corrective/preventive action effectiveness. Helps CAPA owners and quality teams monitor action completion and identify systemic issues.
              </p>

              <h4 className="font-medium text-gray-900 mb-2">Widget Layout</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-xs text-gray-500 mb-2">Row 1: KPI Summary (5 tiles)</div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Avg. Close Time</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Open CAPAs</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Closed Period</div>
                  <div className="bg-red-50 border border-red-200 p-2 rounded text-xs text-center">Overdue</div>
                  <div className="bg-green-50 border border-green-200 p-2 rounded text-xs text-center">Preventive %</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">Row 2: Two-Column Layout</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">CAPAs Created vs Closed (Bar Chart)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Repeat Incidents Table (DataTable)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Preventive vs Corrective (Donut)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Avg Close Time by Type (Progress)</div>
                    <div className="bg-orange-50 border border-orange-200 p-2 rounded text-xs">Overdue by Owner (Ranked)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Status Summary (Breakdown)</div>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">Repeat Incidents Detection</h4>
              <CodeBlock title="Repeat Incident Logic">{`// Find assets with multiple events that have linked CAPAs
const repeatIncidents = useMemo(() => {
  // Group events by asset
  const byAsset = new Map<string, AnalyticsSafetyEvent[]>();
  filteredEvents.forEach(event => {
    if (event.assetId) {
      const existing = byAsset.get(event.assetId) || [];
      byAsset.set(event.assetId, [...existing, event]);
    }
  });
  
  // Filter to assets with 2+ events AND linked CAPAs
  return Array.from(byAsset.entries())
    .filter(([_, events]) => events.length >= 2)
    .filter(([_, events]) => events.some(e => e.linkedCapaIds.length > 0))
    .map(([assetId, events]) => ({
      assetId,
      assetName: events[0].assetName,
      eventCount: events.length,
      linkedCapaCount: events.flatMap(e => e.linkedCapaIds).length,
      lastEventDate: events.sort((a, b) => 
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      )[0].eventDate,
    }))
    .sort((a, b) => b.eventCount - a.eventCount);
}, [filteredEvents]);`}</CodeBlock>
            </div>

            {/* Operational Dashboard */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Operational Dashboard</h3>
                  <code className="text-xs text-gray-500">/analytics/operational</code>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                <strong>Purpose:</strong> EHS x CMMS integration. Bridges safety events with maintenance work orders to ensure timely remediation and track operational response.
              </p>

              <h4 className="font-medium text-gray-900 mb-2">Widget Layout</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="text-xs text-gray-500 mb-2">Row 1: KPI Summary (5 tiles)</div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Total WOs</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Open</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">In Progress</div>
                  <div className="bg-green-50 border border-green-200 p-2 rounded text-xs text-center">Completed/Week</div>
                  <div className="bg-white border border-gray-200 p-2 rounded text-xs text-center">Avg Response</div>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">Row 2: Two-Column Layout</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Safety Work Orders (DataTable)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Response Time Distribution (Custom)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Work Orders by Status (Donut)</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Assets with Highest Activity</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">Completion Summary Card</div>
                    <div className="bg-white border border-gray-200 p-2 rounded text-xs">By Work Order Type</div>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-2">Response Time Calculation</h4>
              <CodeBlock title="Incident → Work Order Response Time">{`// Calculate lag time between event and linked work order creation
const responseTimes = useMemo(() => {
  const times: number[] = [];
  
  filteredWorkOrders.forEach(wo => {
    if (wo.linkedEventId) {
      const event = allEvents.find(e => e.id === wo.linkedEventId);
      if (event) {
        const eventDate = new Date(event.eventDate);
        const woDate = new Date(wo.createdDate);
        const lagDays = Math.ceil(
          (woDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        times.push(lagDays);
      }
    }
  });
  
  return {
    avgLag: times.length > 0 
      ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1)
      : 'N/A',
    sameDay: times.filter(t => t === 0).length,
    oneToTwo: times.filter(t => t >= 1 && t <= 2).length,
    threeToSeven: times.filter(t => t >= 3 && t <= 7).length,
    sevenPlus: times.filter(t => t > 7).length,
  };
}, [filteredWorkOrders, allEvents]);`}</CodeBlock>
            </div>
          </CollapsibleSection>
        </section>

        {/* Component Reference */}
        <section id="components">
          <CollapsibleSection title="6. Component Reference">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reusable Widgets</h3>
            <p className="text-gray-600 mb-4">
              Located in <code className="bg-gray-100 px-1 rounded">src/components/widgets/</code>
            </p>
            
            <Table
              headers={['Component', 'Purpose', 'Key Props']}
              rows={[
                ['WidgetCard', 'Base container for all widgets', 'title, subtitle, loading, empty, tooltip, headerAction, footer'],
                ['KPITile', 'Single metric display with trend', 'value, label, trend, color, severity, size, suffix, invertTrendColors'],
                ['SeverityKPIRow', 'Grid of 4 severity KPIs', 'critical, high, medium, low (numbers)'],
                ['TrendChart', 'Time series line/bar/area chart', 'data, dataKeys, type, height, showGrid, showLegend, stacked'],
                ['DualMetricChart', 'Two metrics comparison chart', 'data, dataKey1, dataKey2, label1, label2, type'],
                ['DistributionChart', 'Donut/pie/horizontal bar', 'data, type, centerLabel, centerValue, showLabels'],
                ['ProgressGroup', 'Multiple progress bars', 'items: [{label, value, max, color}], showPercentage'],
                ['RankedList', 'Ordered list with bars/badges', 'items, maxItems, showRank, showBar, valueLabel'],
                ['AlertList', 'Alert-style list', 'items, maxItems, showSeverity'],
                ['CAPAList', 'CAPA-specific list', 'items, showStatus, showDueDate'],
                ['DataTable', 'Sortable paginated table', 'columns, data, pageSize, onRowClick, exportable'],
                ['AIInsightCard', 'AI summary with sections', 'insight, collapsible, defaultExpanded, followUpPrompts'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Analytics Components</h3>
            <p className="text-gray-600 mb-4">
              Located in <code className="bg-gray-100 px-1 rounded">src/components/analytics/</code>
            </p>

            <div className="space-y-6">
              {/* FilterBar */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">FilterBar</h4>
                <p className="text-sm text-gray-600 mb-3">Global filtering controls with time range, site, severity, and classification filters.</p>
                
                <Table
                  headers={['Prop', 'Type', 'Default', 'Description']}
                  rows={[
                    ['showSiteFilter', 'boolean', 'true', 'Show/hide site dropdown'],
                    ['showSeverityFilter', 'boolean', 'true', 'Show/hide severity dropdown'],
                    ['showClassificationFilter', 'boolean', 'true', 'Show/hide classification dropdown'],
                    ['compact', 'boolean', 'false', 'Use compact layout'],
                  ]}
                />

                <h5 className="font-medium text-gray-900 mt-4 mb-2">Time Range Options</h5>
                <div className="flex flex-wrap gap-2">
                  {['Today', '7 Days', '30 Days', '90 Days', 'YTD', 'Custom Range'].map(opt => (
                    <span key={opt} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{opt}</span>
                  ))}
                </div>

                <h5 className="font-medium text-gray-900 mt-4 mb-2">Custom Date Range</h5>
                <p className="text-sm text-gray-600">
                  When &quot;Custom Range&quot; is selected, start/end date inputs appear with quick presets: Last 2 Weeks, This Month, Last Month, Last 3 Months.
                </p>
              </div>

              {/* ExportMenu */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">ExportMenu</h4>
                <p className="text-sm text-gray-600 mb-3">Dropdown menu for CSV export and print functionality.</p>
                
                <h5 className="font-medium text-gray-900 mb-2">Export Options</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>- <strong>Safety Events (CSV):</strong> All filtered events with 13 columns</li>
                  <li>- <strong>CAPAs (CSV):</strong> All filtered CAPAs with 11 columns</li>
                  <li>- <strong>Work Orders (CSV):</strong> All filtered work orders with 12 columns</li>
                  <li>- <strong>Print Dashboard:</strong> Triggers browser print dialog</li>
                </ul>
              </div>

              {/* DataConfidence */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">DataConfidence</h4>
                <p className="text-sm text-gray-600 mb-3">Data quality indicator showing completeness metrics.</p>
                
                <Table
                  headers={['Prop', 'Type', 'Default', 'Description']}
                  rows={[
                    ['variant', "'inline' | 'card' | 'tooltip'", "'inline'", 'Display variant'],
                  ]}
                />

                <h5 className="font-medium text-gray-900 mt-4 mb-2">Metrics Displayed</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-gray-50 p-2 rounded text-xs text-center">Severity %</div>
                  <div className="bg-gray-50 p-2 rounded text-xs text-center">Hazard Category %</div>
                  <div className="bg-gray-50 p-2 rounded text-xs text-center">Asset Linkage %</div>
                  <div className="bg-gray-50 p-2 rounded text-xs text-center">CAPA Linkage %</div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </section>

        {/* Context & Hooks */}
        <section id="context-hooks">
          <CollapsibleSection title="7. Context API & Hooks">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AnalyticsProvider</h3>
            <p className="text-gray-600 mb-4">
              Central state management for all analytics dashboards. Wraps the analytics layout and provides filtered data to all child components.
            </p>

            <CodeBlock title="src/contexts/AnalyticsContext.tsx - Provider Value">{`interface AnalyticsContextValue {
  // Raw Data
  allEvents: AnalyticsSafetyEvent[];
  allCapas: CAPA[];
  allWorkOrders: SafetyWorkOrder[];
  allAssets: Asset[];
  sites: Site[];
  osha300ASummaries: OSHA300ASummary[];
  oshaQuarterlySummaries: OSHAQuarterlySummary[];

  // Filter State
  filters: AnalyticsFilters;
  setFilters: (filters: AnalyticsFilters) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  resetFilters: () => void;

  // Filtered Data (computed)
  filteredEvents: AnalyticsSafetyEvent[];
  filteredCapas: CAPA[];
  filteredWorkOrders: SafetyWorkOrder[];

  // Aggregations (computed)
  eventsBySeverity: Record<Severity, number>;
  eventsByClassification: Record<EventClassification, number>;
  eventsByStatus: Record<EventStatus, number>;
  eventsByHazard: Record<HazardCategory, number>;
  eventsBySite: { siteId: string; siteName: string; count: number }[];
  capasByStatus: Record<CapaStatus, number>;
  overdueCapas: CAPA[];
  dueSoonCapas: CAPA[];

  // Trend Data (computed)
  eventTrendData: TrendDataPoint[];
  capaTrendData: TrendDataPoint[];

  // Data Quality
  dataConfidence: DataConfidenceMetrics;
}`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Custom Hooks</h3>
            
            <Table
              headers={['Hook', 'Returns', 'Purpose']}
              rows={[
                ['useAnalytics()', 'AnalyticsContextValue', 'Access full context'],
                ['useOpenEventsBySeverity()', '{ critical, high, medium, low, total }', 'Open events grouped by severity'],
                ['useEventsToday()', 'AnalyticsSafetyEvent[]', 'Events from today'],
                ['useEventsThisWeek()', 'AnalyticsSafetyEvent[]', 'Events from last 7 days'],
                ['useTrendingHazards(days)', '{ category, count }[]', 'Top hazard categories'],
                ['useOSHAMetrics()', '{ trir, dart, totalRecordables, totalHoursWorked }', 'OSHA compliance rates'],
                ['useCAPAEffectiveness()', '{ avgTimeToClose, preventiveRatio, ... }', 'CAPA metrics'],
                ['useAssetsWithRepeatedEvents(min)', '{ assetId, assetName, count }[]', 'Assets with multiple events'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Hook Implementation Examples</h3>

            <CodeBlock title="useOpenEventsBySeverity()">{`const useOpenEventsBySeverity = () => {
  const { filteredEvents } = useAnalytics();
  
  return useMemo(() => {
    const open = filteredEvents.filter(e => e.status === 'open');
    return {
      critical: open.filter(e => e.severity === 'critical').length,
      high: open.filter(e => e.severity === 'high').length,
      medium: open.filter(e => e.severity === 'medium').length,
      low: open.filter(e => e.severity === 'low').length,
      total: open.length,
    };
  }, [filteredEvents]);
};`}</CodeBlock>

            <CodeBlock title="useTrendingHazards(days)">{`const useTrendingHazards = (days: number = 30) => {
  const { filteredEvents } = useAnalytics();
  
  return useMemo(() => {
    // Calculate cutoff date (pure calculation)
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
    
    // Filter to recent events
    const recentEvents = filteredEvents.filter(e => 
      new Date(e.eventDate) >= cutoff
    );
    
    // Count by hazard category
    const counts = new Map<HazardCategory, number>();
    recentEvents.forEach(e => {
      counts.set(e.hazardCategory, (counts.get(e.hazardCategory) || 0) + 1);
    });
    
    // Sort descending and return
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEvents, days]);
};`}</CodeBlock>
          </CollapsibleSection>
        </section>

        {/* Filtering System */}
        <section id="filtering">
          <CollapsibleSection title="8. Filtering System">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter State Structure</h3>
            
            <CodeBlock title="src/types/analytics.ts">{`interface AnalyticsFilters {
  timeRange: TimeRange;           // 'today' | '7d' | '30d' | '90d' | 'ytd' | 'custom'
  startDate?: string;             // ISO date (for custom range)
  endDate?: string;               // ISO date (for custom range)
  siteIds: string[];              // Multi-select
  locationIds: string[];          // Multi-select
  severities: Severity[];         // Multi-select
  classifications: EventClassification[];  // Multi-select
  hazardCategories: HazardCategory[];      // Multi-select
  templateIds: string[];          // Multi-select
  assetIds: string[];             // Multi-select
}

type TimeRange = 'today' | '7d' | '30d' | '90d' | 'ytd' | 'custom';`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Filter Application Order</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <ol className="text-sm text-gray-700 space-y-2">
                <li><strong>1. Date Range (Primary):</strong> filterEventsByDateRange() filters by eventDate</li>
                <li><strong>2. Site Filter:</strong> If siteIds.length &gt; 0, filter by siteId</li>
                <li><strong>3. Location Filter:</strong> If locationIds.length &gt; 0, filter by locationId</li>
                <li><strong>4. Severity Filter:</strong> If severities.length &gt; 0, filter by severity</li>
                <li><strong>5. Classification Filter:</strong> If classifications.length &gt; 0, filter by classification</li>
                <li><strong>6. Hazard Category Filter:</strong> If hazardCategories.length &gt; 0, filter by hazardCategory</li>
                <li><strong>7. Asset Filter:</strong> If assetIds.length &gt; 0, filter by assetId</li>
              </ol>
            </div>

            <CodeBlock title="Filter Implementation">{`const filteredEvents = useMemo(() => {
  let events = filterEventsByDateRange(allEvents, dateRange);
  
  if (filters.siteIds.length > 0) {
    events = events.filter(e => filters.siteIds.includes(e.siteId));
  }
  if (filters.locationIds.length > 0) {
    events = events.filter(e => filters.locationIds.includes(e.locationId));
  }
  if (filters.severities.length > 0) {
    events = events.filter(e => filters.severities.includes(e.severity));
  }
  if (filters.classifications.length > 0) {
    events = events.filter(e => filters.classifications.includes(e.classification));
  }
  if (filters.hazardCategories.length > 0) {
    events = events.filter(e => filters.hazardCategories.includes(e.hazardCategory));
  }
  if (filters.assetIds.length > 0) {
    events = events.filter(e => e.assetId && filters.assetIds.includes(e.assetId));
  }
  
  return events;
}, [allEvents, dateRange, filters]);`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Date Range Helper</h3>
            
            <CodeBlock title="src/data/analyticsData.ts - getDateRange()">{`export const getDateRange = (timeRange: TimeRange): { startDate: Date; endDate: Date } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1); // End of today
  
  switch (timeRange) {
    case 'today':
      return { startDate: today, endDate };
    case '7d':
      return { 
        startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), 
        endDate 
      };
    case '30d':
      return { 
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), 
        endDate 
      };
    case '90d':
      return { 
        startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), 
        endDate 
      };
    case 'ytd':
      return { 
        startDate: new Date(now.getFullYear(), 0, 1),  // Jan 1 of current year
        endDate 
      };
    case 'custom':
      // Custom uses filters.startDate and filters.endDate
      return { startDate: today, endDate };
    default:
      return { startDate: today, endDate };
  }
};`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Custom Date Range Presets</h3>
            
            <Table
              headers={['Preset', 'Start Date', 'End Date']}
              rows={[
                ['Last 2 Weeks', '14 days ago', 'Today'],
                ['This Month', '1st of current month', 'Today'],
                ['Last Month', '1st of previous month', 'Last day of previous month'],
                ['Last 3 Months', '1st of 3 months ago', 'Today'],
              ]}
            />
          </CollapsibleSection>
        </section>

        {/* Export Functionality */}
        <section id="export">
          <CollapsibleSection title="9. Export Functionality">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CSV Export</h3>
            
            <div className="space-y-4">
              {/* Events Export */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Safety Events Export</h4>
                <p className="text-sm text-gray-600 mb-2">13 columns exported:</p>
                <div className="flex flex-wrap gap-1">
                  {['ID', 'Title', 'Classification', 'Severity', 'Status', 'Site', 'Location', 'Hazard Category', 'Event Date', 'Reporter', 'Asset', 'OSHA Recordable', 'Created At'].map(col => (
                    <span key={col} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{col}</span>
                  ))}
                </div>
              </div>

              {/* CAPAs Export */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">CAPAs Export</h4>
                <p className="text-sm text-gray-600 mb-2">11 columns exported:</p>
                <div className="flex flex-wrap gap-1">
                  {['ID', 'Title', 'Type', 'Status', 'Priority', 'Owner', 'Site', 'Created Date', 'Due Date', 'Closed Date', 'Linked Events'].map(col => (
                    <span key={col} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs">{col}</span>
                  ))}
                </div>
              </div>

              {/* Work Orders Export */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Work Orders Export</h4>
                <p className="text-sm text-gray-600 mb-2">12 columns exported:</p>
                <div className="flex flex-wrap gap-1">
                  {['ID', 'Title', 'Status', 'Priority', 'Type', 'Site', 'Location', 'Asset', 'Assignee', 'Created Date', 'Due Date', 'Completed Date'].map(col => (
                    <span key={col} className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs">{col}</span>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">CSV Formatting</h3>
            
            <CodeBlock title="src/components/analytics/ExportMenu.tsx">{`const escapeCSV = (value: string | number | boolean | undefined): string => {
  if (value === undefined || value === null) return '';
  const str = String(value);
  // Escape quotes, commas, and newlines
  if (str.includes(',') || str.includes('"') || str.includes('\\n')) {
    return \`"\${str.replace(/"/g, '""')}"\`;
  }
  return str;
};

const generateFilename = (type: string): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return \`\${type}_export_\${timestamp}.csv\`;
};

// Download triggers browser save dialog
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Print Dashboard</h3>
            
            <p className="text-gray-600 mb-4">
              Print functionality uses <code className="bg-gray-100 px-1 rounded">window.print()</code> with CSS media queries for print optimization:
            </p>
            
            <CodeBlock title="Print CSS">{`@media print {
  /* Hide navigation and filters */
  nav, .filter-bar, .export-menu { display: none !important; }
  
  /* Ensure charts fit on page */
  .recharts-responsive-container { max-width: 100% !important; }
  
  /* Page breaks between major sections */
  .widget-card { page-break-inside: avoid; }
  
  /* Remove background colors */
  .bg-gray-50, .bg-gray-100 { background: white !important; }
}`}</CodeBlock>
          </CollapsibleSection>
        </section>

        {/* Technical Specifications */}
        <section id="technical-specs">
          <CollapsibleSection title="10. Technical Specifications">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependencies</h3>
            <Table
              headers={['Package', 'Version', 'Purpose']}
              rows={[
                ['react', '^19.x', 'UI framework'],
                ['next', '^16.x', 'App framework with App Router'],
                ['recharts', '^2.x', 'Charting library (line, bar, area, pie)'],
                ['tailwindcss', '^4.x', 'Utility-first CSS styling'],
                ['typescript', '^5.x', 'Type safety'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">State Management</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Context API:</strong> AnalyticsContext provides global state to all dashboard pages</li>
                <li><strong>useMemo:</strong> All computed values (aggregations, trends, metrics) are memoized</li>
                <li><strong>No localStorage:</strong> Analytics state is not persisted (server-side safe)</li>
                <li><strong>No Redux/Zustand:</strong> Simple Context-based state management</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Optimizations</h3>
            <Table
              headers={['Optimization', 'Implementation', 'Impact']}
              rows={[
                ['Memoized computations', 'useMemo for all derived data', 'Prevents recalculation on every render'],
                ['Weekly aggregation', 'Aggregate daily data to weekly for >30 days', 'Reduces chart data points'],
                ['Pagination', 'DataTable uses 10 rows per page default', 'Limits DOM elements'],
                ['Lazy tab loading', 'Dashboard pages only render when active', 'Faster initial load'],
                ['Filtered data reuse', 'All hooks use shared filteredEvents', 'Single filter pass'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Mock Data Volumes</h3>
            <Table
              headers={['Data Type', 'Count', 'Distribution']}
              rows={[
                ['Safety Events', '60', '15 incidents, 20 near misses, 10 hazards, 10 observations, 5 recent'],
                ['CAPAs', '35', 'Linked to incidents and high/critical events'],
                ['Work Orders', '45', '15 event-linked, 10 CAPA-linked, 20 standalone'],
                ['Sites', '5', 'Chicago, Dallas, Phoenix, Atlanta, Denver'],
                ['Locations', '10', '2 per site (Building A/B, Line 1/2, etc.)'],
                ['Assets', '10', 'Forklifts, CNC machines, conveyors, etc.'],
                ['Users', '10', 'Reporters, owners, assignees'],
                ['OSHA Summaries', '5+', 'Annual 300A per location + quarterly'],
              ]}
            />

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Recharts Configuration</h3>
            <CodeBlock title="Common Chart Settings">{`// Responsive container wrapper
<ResponsiveContainer width="100%" height={height}>
  <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    ...
  </BarChart>
</ResponsiveContainer>

// Color palette
const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500  
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#06B6D4', // cyan-500
];

// Severity colors
const SEVERITY_COLORS = {
  critical: '#EF4444',  // red-500
  high: '#F97316',      // orange-500
  medium: '#EAB308',    // yellow-500
  low: '#22C55E',       // green-500
};

// Tooltip styling
<Tooltip
  contentStyle={{
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }}
/>`}</CodeBlock>

            <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">File Size Reference</h3>
            <Table
              headers={['File', 'Lines (approx)', 'Purpose']}
              rows={[
                ['AnalyticsContext.tsx', '~600', 'Context provider, hooks, all computations'],
                ['analyticsData.ts', '~700', 'Mock data generation, helper functions'],
                ['analytics.ts (types)', '~400', 'All TypeScript interfaces'],
                ['safety-manager/page.tsx', '~300', 'Daily Triage dashboard'],
                ['executive/page.tsx', '~280', 'Performance dashboard'],
                ['capa-effectiveness/page.tsx', '~350', 'CAPA Effectiveness dashboard'],
                ['operational/page.tsx', '~400', 'Operational dashboard'],
              ]}
            />
          </CollapsibleSection>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Analytics & Reporting Module - UpKeep EHS</p>
          <p className="mt-1">Last Updated: January 2026</p>
        </footer>
      </main>
    </div>
  );
}
